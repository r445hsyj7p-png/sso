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

// Import status
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
