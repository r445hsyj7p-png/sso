import { Router } from 'express'
import multer from 'multer'
import { searchApps } from './discovery.js'
import { analyzeContent } from './analyzer.js'
import db from '../db.js'

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

export default router
