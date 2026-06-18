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

// Seed data
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
