import type { NormalizedApp, ImportResult } from './types.js'
import { toAppKey, upsertApp } from './utils.js'

// Okta Management API — lists apps configured in the org
// Requires OKTA_DOMAIN (e.g. dev-123456.okta.com) + OKTA_API_TOKEN
const OKTA_MGMT_URL = (domain: string) => `https://${domain}/api/v1/apps?limit=200`

interface OINApp {
  name: string
  displayName?: string
  publisher?: string
  description?: string
  signOnModes?: string[]
  features?: string[]
  categories?: string[]
  logoUrl?: string
  docsUrl?: string
  id?: string
}

function mapOktaApp(raw: OINApp): NormalizedApp | null {
  const name = raw.displayName || raw.name
  if (!name || name.length < 2) return null

  const modes: string[] = (raw.signOnModes || []).map((m: string) => m.toLowerCase())
  const features: string[] = (raw.features || []).map((f: string) => f.toLowerCase())

  const hasOIDC = modes.some(m => m.includes('oidc') || m.includes('openid'))
  const hasSAML = modes.some(m => m.includes('saml'))
  const hasScim = features.some(f => f.includes('scim') || f.includes('push') || f.includes('provisioning'))
  const hasPassword = modes.some(m => m.includes('password'))

  if (!hasOIDC && !hasSAML && !hasPassword && modes.length === 0) return null

  const standardIdP = hasOIDC || hasSAML ? 1 : 0

  const sourceUrls = []
  if (raw.docsUrl) sourceUrls.push({ title: `${name} - Okta Integration Docs`, url: raw.docsUrl })

  const notes: string[] = []
  if (modes.length > 0) notes.push(`Okta sign-on modes: ${modes.join(', ')}`)
  if (features.length > 0) notes.push(`Features: ${features.join(', ')}`)

  return {
    app_key: toAppKey(name),
    app_name: name,
    vendor: raw.publisher || null,
    description: raw.description || null,
    oidc: hasOIDC ? 1 : 0,
    oauth2: hasOIDC ? 1 : 0,
    saml2: hasSAML ? 1 : 0,
    scim: hasScim ? 1 : 0,
    ldap: 0,
    kerberos: 0,
    ws_federation: 0,
    cas: 0,
    entra_id: 0,
    okta: 1,
    ping: standardIdP,
    keycloak: standardIdP,
    auth0: 0,
    onelogin: 0,
    forgerock: 0,
    license_requirement: 'unclear',
    implementation_notes: notes.length > 0 ? notes.join('. ') : null,
    source_urls: sourceUrls.length > 0 ? JSON.stringify(sourceUrls) : null,
    confidence: 90,
    import_source: 'okta',
    external_id: raw.id || raw.name || null,
    logo_url: raw.logoUrl || null,
  }
}

async function fetchOktaManagementAPI(): Promise<OINApp[]> {
  const domain = process.env.OKTA_DOMAIN
  const token = process.env.OKTA_API_TOKEN

  if (!domain || !token) {
    throw new Error('OKTA_DOMAIN and OKTA_API_TOKEN are required')
  }

  const all: OINApp[] = []
  let url: string | null = OKTA_MGMT_URL(domain)

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `SSWS ${token}`,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Okta Management API ${res.status}: ${body.slice(0, 200)}`)
    }

    const data = await res.json() as any[]
    if (!Array.isArray(data)) break

    all.push(...data.map((app: any) => ({
      id: app.id,
      name: app.name,
      displayName: app.label || app.name,
      signOnModes: app.signOnMode ? [app.signOnMode] : [],
      features: app.features || [],
      publisher: app._links?.appLinks?.[0]?.href ? undefined : undefined,
    })))

    // Okta uses Link header for pagination
    const linkHeader = res.headers.get('link')
    const nextMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)
    url = nextMatch ? nextMatch[1] : null

    if (url) await new Promise(r => setTimeout(r, 200))
  }

  return all
}

export async function importOkta(db: any): Promise<ImportResult> {
  const domain = process.env.OKTA_DOMAIN
  const token = process.env.OKTA_API_TOKEN
  if (!domain || !token) throw new Error('OKTA_DOMAIN and OKTA_API_TOKEN are required')

  const start = Date.now()
  let appsAdded = 0
  let appsUpdated = 0
  const errors: string[] = []

  const rawApps = await fetchOktaManagementAPI()
  console.log(`Fetched ${rawApps.length} apps from Okta Management API (${process.env.OKTA_DOMAIN})`)

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

  const normalized = rawApps
    .map(mapOktaApp)
    .filter((a): a is NormalizedApp => a !== null)

  const { added, updated } = upsertMany(normalized)
  appsAdded = added
  appsUpdated = updated

  return {
    source: 'okta',
    appsAdded,
    appsUpdated,
    errors,
    duration: Date.now() - start,
  }
}
