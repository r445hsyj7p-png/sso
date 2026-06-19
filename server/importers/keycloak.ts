import type { ImportResult } from './types.js'

export async function importKeycloak(db: any): Promise<ImportResult> {
  const start = Date.now()

  // Set keycloak=1 for all apps that support OIDC or SAML 2.0
  // These are open standards - Keycloak supports them natively
  const result = db.prepare(`
    UPDATE sso_apps
    SET keycloak = 1
    WHERE (oidc = 1 OR saml2 = 1) AND keycloak = 0
  `).run()

  // Also set ping=1 with same logic (Ping supports all standard protocols)
  const pingResult = db.prepare(`
    UPDATE sso_apps
    SET ping = 1
    WHERE (oidc = 1 OR saml2 = 1) AND ping = 0
  `).run()

  return {
    source: 'keycloak',
    appsAdded: 0,
    appsUpdated: result.changes + pingResult.changes,
    errors: [],
    duration: Date.now() - start,
  }
}
