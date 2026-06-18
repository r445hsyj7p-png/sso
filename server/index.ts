import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = parseInt(process.env.PORT || '3001')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
const { default: ssoRouter } = await import('./sso/index.js')
app.use('/api/sso', ssoRouter)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Serve static files in production
const distPath = join(__dirname, '../dist')
try {
  const { existsSync } = await import('fs')
  if (existsSync(distPath)) {
    const { default: serveStatic } = await import('serve-static')
    app.use(serveStatic(distPath))
    app.get('*', (_req, res) => {
      res.sendFile(join(distPath, 'index.html'))
    })
  }
} catch {}

app.listen(PORT, () => {
  console.log(`SSO Checker server running on http://localhost:${PORT}`)
})
