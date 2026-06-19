import { Router } from 'express'
import multer from 'multer'
import { searchApps } from './discovery.js'
import { analyzeContent } from './analyzer.js'
import { lookupUrl } from './url-lookup.js'
import db from '../db.js'
import { runImport, getImportStatus } from '../importers/index.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

// Search apps
router.get('/apps', (req, res) => {
  const q = String(req.query.q || '').trim()
  if (!q) {
    return res.json([])
  }

  // Log search
  db.prepare('INSERT INTO sso_search_history (query, result_count) VALUES (?, ?)').run(q, 0)

  const apps = searchApps(q)

  // Update result count
  db.prepare('UPDATE sso_search_history SET result_count = ? WHERE id = last_insert_rowid()').run(apps.length)

  res.json(apps)
})

// Get single app
router.get('/apps/:key', (req, res) => {
  const app = db.prepare('SELECT * FROM sso_apps WHERE app_key = ?').get(req.params.key)
  if (!app) {
    return res.status(404).json({ error: 'App not found' })
  }
  res.json(app)
})

// Stats
router.get('/stats', (_req, res) => {
  const total = (db.prepare('SELECT COUNT(*) as c FROM sso_apps').get() as { c: number }).c
  const byProtocol = {
    oidc: (db.prepare('SELECT COUNT(*) as c FROM sso_apps WHERE oidc = 1').get() as { c: number }).c,
    oauth2: (db.prepare('SELECT COUNT(*) as c FROM sso_apps WHERE oauth2 = 1').get() as { c: number }).c,
    saml2: (db.prepare('SELECT COUNT(*) as c FROM sso_apps WHERE saml2 = 1').get() as { c: number }).c,
    scim: (db.prepare('SELECT COUNT(*) as c FROM sso_apps WHERE scim = 1').get() as { c: number }).c,
    ldap: (db.prepare('SELECT COUNT(*) as c FROM sso_apps WHERE ldap = 1').get() as { c: number }).c,
  }
  res.json({ total, byProtocol })
})

// Analyze file or URL
router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    let filename = 'input'
    let content = ''

    if (req.file) {
      filename = req.file.originalname
      content = req.file.buffer.toString('utf-8')
    } else if (req.body?.url) {
      filename = 'url-input'
      content = req.body.url
    } else if (req.body?.content) {
      filename = req.body.filename || 'pasted-content'
      content = req.body.content
    } else {
      return res.status(400).json({ error: 'No file, URL, or content provided' })
    }

    const result = analyzeContent(filename, content)

    // Save result
    db.prepare('INSERT INTO sso_analyzer_results (filename, result_json) VALUES (?, ?)').run(filename, JSON.stringify(result))

    res.json(result)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// URL Lookup — fetch a vendor support page and extract SSO hints
router.post('/lookup-url', async (req, res) => {
  const url = String(req.body?.url || '').trim()
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid URL is required' })
  }
  try {
    const result = await lookupUrl(url)
    res.json(result)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// Save a lookup result as a verified app entry
router.post('/lookup-url/save', async (req, res) => {
  const { appName, url, protocols, idps } = req.body || {}
  if (!appName || typeof appName !== 'string' || appName.trim().length < 2) {
    return res.status(400).json({ error: 'appName is required' })
  }
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' })
  }

  const { toAppKey, upsertApp } = await import('../importers/utils.js')
  const p = protocols || {}

  const idpNames: string[] = Array.isArray(idps) ? idps.map(String) : []
  const hasEntra = idpNames.some(i => /entra|azure/i.test(i))
  const hasOkta  = idpNames.some(i => /okta/i.test(i))
  const hasPing  = idpNames.some(i => /ping/i.test(i))
  const hasKeycloak = idpNames.some(i => /keycloak/i.test(i))
  const hasAuth0 = idpNames.some(i => /auth0/i.test(i))
  const hasOneLogin = idpNames.some(i => /onelogin/i.test(i))

  const hasSaml = p.saml2 ? 1 : 0
  const hasOidc = p.oidc  ? 1 : 0
  const standardIdP = hasSaml || hasOidc ? 1 : 0

  const app = {
    app_key: toAppKey(appName.trim()),
    app_name: appName.trim(),
    vendor: null,
    description: null,
    oidc:         hasOidc,
    oauth2:       p.oauth2 ? 1 : hasOidc,
    saml2:        hasSaml,
    scim:         p.scim   ? 1 : 0,
    ldap:         p.ldap   ? 1 : 0,
    kerberos:     p.kerberos ? 1 : 0,
    ws_federation: p.ws_federation ? 1 : 0,
    cas:          p.cas    ? 1 : 0,
    entra_id:     hasEntra ? 1 : standardIdP,
    okta:         hasOkta  ? 1 : standardIdP,
    ping:         hasPing  ? 1 : standardIdP,
    keycloak:     hasKeycloak ? 1 : standardIdP,
    auth0:        hasAuth0 ? 1 : 0,
    onelogin:     hasOneLogin ? 1 : standardIdP,
    forgerock:    0,
    license_requirement: 'unclear',
    implementation_notes: `Verified from vendor support page: ${url}`,
    source_urls: JSON.stringify([{ title: `${appName.trim()} SSO Documentation`, url }]),
    confidence: 80,
    import_source: 'manual',
    external_id: null,
    logo_url: null,
  }

  try {
    const result = upsertApp(db, app)
    res.json({ success: true, app_key: app.app_key, ...result })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// Edit app — only manual entries allowed
router.patch('/apps/:key', (req, res) => {
  const app = db.prepare('SELECT app_key, import_source FROM sso_apps WHERE app_key = ?').get(req.params.key) as { app_key: string; import_source: string } | undefined
  if (!app) return res.status(404).json({ error: 'App not found' })
  if (app.import_source !== 'manual') return res.status(403).json({ error: 'Only manually created apps can be edited' })

  const { app_name, vendor, description, oidc, oauth2, saml2, scim, ldap, kerberos, ws_federation, cas, license_requirement, implementation_notes, confidence } = req.body || {}
  if (!app_name || typeof app_name !== 'string' || app_name.trim().length < 1) {
    return res.status(400).json({ error: 'app_name is required' })
  }

  db.prepare(`UPDATE sso_apps SET
    app_name = ?, vendor = ?, description = ?,
    oidc = ?, oauth2 = ?, saml2 = ?, scim = ?, ldap = ?,
    kerberos = ?, ws_federation = ?, cas = ?,
    license_requirement = ?, implementation_notes = ?,
    confidence = ?, updated_at = unixepoch()
    WHERE app_key = ?`).run(
    app_name.trim(), vendor || null, description || null,
    oidc ? 1 : 0, oauth2 ? 1 : 0, saml2 ? 1 : 0, scim ? 1 : 0, ldap ? 1 : 0,
    kerberos ? 1 : 0, ws_federation ? 1 : 0, cas ? 1 : 0,
    license_requirement || 'unclear', implementation_notes || null,
    Math.min(100, Math.max(0, Number(confidence) || 80)),
    req.params.key
  )
  res.json({ success: true })
})

// Delete app — only manual entries allowed
router.delete('/apps/:key', (req, res) => {
  const app = db.prepare('SELECT app_key, import_source FROM sso_apps WHERE app_key = ?').get(req.params.key) as { app_key: string; import_source: string } | undefined
  if (!app) return res.status(404).json({ error: 'App not found' })
  if (app.import_source !== 'manual') return res.status(403).json({ error: 'Only manually created apps can be deleted' })
  db.prepare('DELETE FROM sso_apps WHERE app_key = ?').run(req.params.key)
  res.json({ success: true })
})

// List all apps for admin (paginated)
router.get('/admin/apps', (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1')))
  const limit = 50
  const offset = (page - 1) * limit
  const source = String(req.query.source || '')
  const q = String(req.query.q || '').trim()

  let where = 'WHERE 1=1'
  const params: any[] = []
  if (source) { where += ' AND import_source = ?'; params.push(source) }
  if (q) { where += ' AND (lower(app_name) LIKE ? OR lower(app_key) LIKE ?)'; params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`) }

  const total = (db.prepare(`SELECT COUNT(*) as c FROM sso_apps ${where}`).get(...params) as { c: number }).c
  const apps = db.prepare(`SELECT app_key, app_name, vendor, import_source, confidence, saml2, oidc, scim, updated_at FROM sso_apps ${where} ORDER BY updated_at DESC, app_name ASC LIMIT ? OFFSET ?`).all(...params, limit, offset)

  res.json({ apps, total, page, pages: Math.ceil(total / limit) })
})


router.get('/import/status', (_req, res) => {
  const status = getImportStatus()
  res.json(status)
})

// Trigger import (protected by API key in production)
router.post('/import/run', async (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.body?.apiKey
  const configuredKey = process.env.IMPORT_API_KEY

  if (configuredKey && apiKey !== configuredKey) {
    return res.status(401).json({ error: 'Invalid API key' })
  }

  const source = (req.body?.source || 'all') as 'entra' | 'keycloak' | 'entra-docs' | 'all'

  // Run async, return immediately
  res.json({ message: `Import started for source: ${source}`, source })

  try {
    await runImport(source)
  } catch (e) {
    console.error('Background import error:', e)
  }
})

export default router
