import type { NormalizedApp, ImportResult } from './types.js'
import { toAppKey, upsertApp } from './utils.js'

const TOC_URL =
  'https://raw.githubusercontent.com/MicrosoftDocs/entra-docs/main/docs/identity/saas-apps/toc.yml'
const RAW_BASE =
  'https://raw.githubusercontent.com/MicrosoftDocs/entra-docs/main/docs/identity/saas-apps/'
const LEARN_BASE =
  'https://learn.microsoft.com/en-us/entra/identity/saas-apps/'

const BATCH_SIZE = 8
const BATCH_DELAY_MS = 300
const ITEM_DELAY_MS = 50

interface TocEntry {
  name: string
  href: string
}

function parseToc(yaml: string): TocEntry[] {
  const entries: TocEntry[] = []
  let pendingName: string | null = null

  for (const rawLine of yaml.split('\n')) {
    const line = rawLine.trim()

    const nameMatch = line.match(/^-?\s*name:\s*(.+)$/)
    if (nameMatch) {
      pendingName = nameMatch[1].trim()
      continue
    }

    const hrefMatch = line.match(/^href:\s*(.+)$/)
    if (hrefMatch) {
      const href = hrefMatch[1].trim()
      if (href.endsWith('-tutorial.md') && pendingName) {
        entries.push({ name: pendingName, href })
      }
      pendingName = null
      continue
    }

    // Any other key resets pending name
    if (line.match(/^\w+:/) && !line.startsWith('name:') && !line.startsWith('href:')) {
      pendingName = null
    }
  }

  return entries
}

function detectProtocols(content: string, href: string) {
  const lc = content.toLowerCase()
  const isOIDC =
    href.includes('oidc') ||
    (lc.includes('openid connect') && !lc.includes('select **saml**'))
  const isSAML =
    lc.includes('select **saml**') || (!isOIDC && lc.includes('saml'))
  const hasSCIM =
    lc.includes('provisioning-tutorial') || lc.includes('scim')
  const hasWSFed =
    lc.includes('ws-fed') || lc.includes('ws-federation')
  return {
    saml2: isSAML ? 1 : 0,
    oidc: isOIDC ? 1 : 0,
    oauth2: isOIDC ? 1 : 0,
    scim: hasSCIM ? 1 : 0,
    ws_federation: hasWSFed ? 1 : 0,
  }
}

function buildApp(entry: TocEntry, protocols: ReturnType<typeof detectProtocols>): NormalizedApp {
  const { saml2, oidc, oauth2, scim, ws_federation } = protocols
  const standardIdP = saml2 || oidc ? 1 : 0
  const hrefSlug = entry.href.replace(/\.md$/, '')

  let notes: string
  if (oidc) {
    notes = `Microsoft Entra ID integration via OpenID Connect (OIDC).`
  } else if (saml2) {
    notes = `Microsoft Entra ID integration via SAML 2.0.`
  } else {
    notes = `Microsoft Entra ID integration.`
  }

  return {
    app_key: toAppKey(entry.name),
    app_name: entry.name,
    vendor: null,
    description: null,
    oidc,
    oauth2,
    saml2,
    scim,
    ldap: 0,
    kerberos: 0,
    ws_federation,
    cas: 0,
    entra_id: 1,
    okta: standardIdP,
    ping: standardIdP,
    keycloak: standardIdP,
    auth0: oidc ? 1 : 0,
    onelogin: standardIdP,
    forgerock: 0,
    license_requirement: 'unclear',
    implementation_notes: notes,
    source_urls: JSON.stringify([
      { title: `${entry.name} Entra Tutorial`, url: `${LEARN_BASE}${hrefSlug}` },
    ]),
    confidence: 85,
    import_source: 'entra-docs',
    external_id: hrefSlug,
    logo_url: null,
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 10_000): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function delay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export async function importEntraDocs(db: any): Promise<ImportResult> {
  const start = Date.now()
  let appsAdded = 0
  let appsUpdated = 0
  const errors: string[] = []
  let skipped = 0

  // 1. Fetch TOC
  const tocContent = await fetchWithTimeout(TOC_URL)
  if (!tocContent) {
    throw new Error('Failed to fetch entra-docs toc.yml')
  }

  const entries = parseToc(tocContent)
  console.log(`entra-docs: found ${entries.length} tutorial entries in toc.yml`)

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

  // 2. Process in batches
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)

    const batchResults = await Promise.all(
      batch.map(async (entry, idx) => {
        // Stagger requests within a batch
        if (idx > 0) await delay(idx * ITEM_DELAY_MS)

        const url = `${RAW_BASE}${entry.href}`
        const content = await fetchWithTimeout(url)
        if (content === null) {
          skipped++
          return null
        }
        const protocols = detectProtocols(content, entry.href)
        return buildApp(entry, protocols)
      })
    )

    const valid = batchResults.filter((a): a is NormalizedApp => a !== null)
    if (valid.length > 0) {
      const { added, updated } = upsertMany(valid)
      appsAdded += added
      appsUpdated += updated
    }

    if (i + BATCH_SIZE < entries.length) {
      await delay(BATCH_DELAY_MS)
    }

    if ((i / BATCH_SIZE + 1) % 10 === 0) {
      console.log(`entra-docs: processed ${Math.min(i + BATCH_SIZE, entries.length)}/${entries.length}`)
    }
  }

  if (skipped > 0) {
    console.log(`entra-docs: skipped ${skipped} apps due to fetch errors`)
    errors.push(`Skipped ${skipped} apps due to fetch errors (404 or timeout)`)
  }

  return {
    source: 'entra-docs',
    appsAdded,
    appsUpdated,
    errors,
    duration: Date.now() - start,
  }
}
