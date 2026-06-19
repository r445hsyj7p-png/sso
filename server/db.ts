import Database from 'better-sqlite3'
import { readFileSync, readdirSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || './data/sso.db'

mkdirSync(dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Run migrations
const migrationsDir = join(__dirname, '../migrations')
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
for (const file of files) {
  const sql = readFileSync(join(migrationsDir, file), 'utf-8')
  db.exec(sql)
}

// Seed manual data (runs only when DB is empty)
const count = (db.prepare('SELECT COUNT(*) as c FROM sso_apps').get() as { c: number }).c
if (count === 0) {
  const { SEED_APPS } = await import('./sso/seed-data.js')
  const insert = db.prepare(`
    INSERT OR IGNORE INTO sso_apps
    (app_key, app_name, vendor, description, oidc, oauth2, saml2, scim, ldap, kerberos, ws_federation, cas,
     entra_id, okta, ping, keycloak, auth0, onelogin, forgerock, license_requirement,
     implementation_notes, source_urls, confidence)
    VALUES (@app_key, @app_name, @vendor, @description, @oidc, @oauth2, @saml2, @scim, @ldap,
            @kerberos, @ws_federation, @cas, @entra_id, @okta, @ping, @keycloak, @auth0,
            @onelogin, @forgerock, @license_requirement, @implementation_notes, @source_urls, @confidence)
  `)
  const insertMany = db.transaction((apps: any[]) => {
    for (const app of apps) insert.run(app)
  })
  insertMany(SEED_APPS)
  console.log(`Seeded ${SEED_APPS.length} SSO apps`)
}

export default db

// Auto-import on startup (runs async, does not block server start)
export async function runAutoImport() {
  const { runImport } = await import('./importers/runner.js')
  const { importKeycloak } = await import('./importers/keycloak.js')
  const WEEK_IN_SECONDS = 7 * 24 * 60 * 60

  function lastImportAge(source: string): number {
    const row = db.prepare(`
      SELECT finished_at FROM sso_import_log
      WHERE source = ? AND status IN ('done', 'done_with_errors')
      ORDER BY finished_at DESC LIMIT 1
    `).get(source) as { finished_at: number } | undefined
    if (!row?.finished_at) return Infinity
    return Math.floor(Date.now() / 1000) - row.finished_at
  }

  // Always apply Keycloak/Ping rules (no credentials needed, fast)
  const keycloakAge = lastImportAge('keycloak')
  if (keycloakAge > WEEK_IN_SECONDS) {
    console.log('Auto-import: applying Keycloak/Ping compatibility rules...')
    await importKeycloak(db)
  }

  // Validate that credential looks real (not a placeholder like "your-tenant-id")
  function isPlaceholder(val: string): boolean {
    return !val || val.startsWith('your-') || val === 'undefined' || val === 'null' || val.length < 8
  }

  // Entra import — only if credentials look real
  const hasEntraCreds = !!(
    process.env.ENTRA_TENANT_ID && process.env.ENTRA_CLIENT_ID && process.env.ENTRA_CLIENT_SECRET &&
    !isPlaceholder(process.env.ENTRA_TENANT_ID) &&
    !isPlaceholder(process.env.ENTRA_CLIENT_ID) &&
    !isPlaceholder(process.env.ENTRA_CLIENT_SECRET)
  )
  if (hasEntraCreds && lastImportAge('entra') > WEEK_IN_SECONDS) {
    console.log('Auto-import: starting Microsoft Entra App Gallery import...')
    runImport('entra').then(results => {
      const r = results[0]
      console.log(`Auto-import Entra done: +${r.appsAdded} added, ~${r.appsUpdated} updated`)
    }).catch(e => console.error('Auto-import Entra failed:', e))
  } else if (!hasEntraCreds) {
    console.log('Auto-import: Entra skipped (ENTRA_TENANT_ID/CLIENT_ID/CLIENT_SECRET not set)')
  }

  // Okta import — only if credentials look real
  const hasOktaCreds = !!(
    process.env.OKTA_DOMAIN && process.env.OKTA_API_TOKEN &&
    !isPlaceholder(process.env.OKTA_DOMAIN) &&
    !isPlaceholder(process.env.OKTA_API_TOKEN)
  )
  if (hasOktaCreds && lastImportAge('okta') > WEEK_IN_SECONDS) {
    console.log('Auto-import: starting Okta OIN import...')
    runImport('okta').then(results => {
      const r = results[0]
      console.log(`Auto-import Okta done: +${r.appsAdded} added, ~${r.appsUpdated} updated`)
    }).catch(e => console.error('Auto-import Okta failed:', e))
  } else if (!hasOktaCreds) {
    console.log('Auto-import: Okta skipped (OKTA_DOMAIN/OKTA_API_TOKEN not set)')
  }
}
