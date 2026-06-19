import type { NormalizedApp, ImportResult } from './types.js'
import { toAppKey, upsertApp } from './utils.js'

const GRAPH_TOKEN_URL = (tenantId: string) =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

const GRAPH_API_URL =
  'https://graph.microsoft.com/beta/applicationTemplates?$top=999&$select=id,displayName,publisher,categories,supportedSingleSignOnModes,supportedProvisioningTypes,homePageUrl,documentationUrl,logoUrl,description'

async function getEntraToken(tenantId: string, clientId: string, clientSecret: string): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  })

  const res = await fetch(GRAPH_TOKEN_URL(tenantId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Entra token error: ${res.status} ${text}`)
  }

  const data = await res.json() as { access_token: string }
  return data.access_token
}

function mapEntraApp(raw: any): NormalizedApp {
  const modes: string[] = raw.supportedSingleSignOnModes || []
  const provTypes: string[] = raw.supportedProvisioningTypes || []

  const hasOIDC = modes.some((m: string) => m.toLowerCase() === 'oidc')
  const hasSAML = modes.some((m: string) => m.toLowerCase() === 'saml')
  const hasSCIM = provTypes.some((p: string) => p.toLowerCase() === 'scim')

  // Derive keycloak/ping support: if OIDC or SAML → standard IdPs can integrate
  const standardIdP = hasOIDC || hasSAML ? 1 : 0

  const sourceUrls = []
  if (raw.homePageUrl) sourceUrls.push({ title: `${raw.displayName} Homepage`, url: raw.homePageUrl })
  if (raw.documentationUrl) sourceUrls.push({ title: 'Microsoft Entra Integration Guide', url: raw.documentationUrl })

  return {
    app_key: toAppKey(raw.displayName),
    app_name: raw.displayName,
    vendor: raw.publisher || null,
    description: raw.description || null,
    oidc: hasOIDC ? 1 : 0,
    oauth2: hasOIDC ? 1 : 0,
    saml2: hasSAML ? 1 : 0,
    scim: hasSCIM ? 1 : 0,
    ldap: 0,
    kerberos: 0,
    ws_federation: 0,
    cas: 0,
    entra_id: 1,
    okta: 0,
    ping: standardIdP,
    keycloak: standardIdP,
    auth0: 0,
    onelogin: 0,
    forgerock: 0,
    license_requirement: 'unclear',
    implementation_notes: modes.length > 0
      ? `Supported SSO modes: ${modes.join(', ')}. Provisioning: ${provTypes.join(', ') || 'none'}.`
      : null,
    source_urls: sourceUrls.length > 0 ? JSON.stringify(sourceUrls) : null,
    confidence: 93,
    import_source: 'entra',
    external_id: raw.id,
    logo_url: raw.logoUrl || null,
  }
}

export async function importEntra(db: any): Promise<ImportResult> {
  const tenantId = process.env.ENTRA_TENANT_ID
  const clientId = process.env.ENTRA_CLIENT_ID
  const clientSecret = process.env.ENTRA_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing ENTRA_TENANT_ID, ENTRA_CLIENT_ID, or ENTRA_CLIENT_SECRET environment variables')
  }

  const start = Date.now()
  let appsAdded = 0
  let appsUpdated = 0
  const errors: string[] = []

  const token = await getEntraToken(tenantId, clientId, clientSecret)

  let url: string | null = GRAPH_API_URL
  let pageCount = 0

  const upsertMany = db.transaction((apps: NormalizedApp[]) => {
    let added = 0, updated = 0
    for (const app of apps) {
      try {
        const result = upsertApp(db, app)
        if (result.added) added++
        else if (result.updated) updated++
      } catch (e) {
        errors.push(`Failed to upsert ${app.app_name}: ${e}`)
      }
    }
    return { added, updated }
  })

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error(`Graph API error: ${res.status} ${await res.text()}`)
    }

    const data = await res.json() as { value: any[]; '@odata.nextLink'?: string }
    const page = data.value || []

    const normalized = page.map(mapEntraApp).filter(a => a.app_name && a.app_name.length > 1)
    const { added, updated } = upsertMany(normalized)
    appsAdded += added
    appsUpdated += updated
    pageCount++

    url = data['@odata.nextLink'] || null

    // Rate limit: small delay between pages
    if (url) await new Promise(r => setTimeout(r, 200))
  }

  return {
    source: 'entra',
    appsAdded,
    appsUpdated,
    errors,
    duration: Date.now() - start,
  }
}
