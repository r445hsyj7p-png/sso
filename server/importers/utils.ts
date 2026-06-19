import type { NormalizedApp } from './types.js'

// Normalize app name to a consistent key: lowercase, replace spaces/special chars with hyphens
export function toAppKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

// Upsert app into DB - if app_key exists, update; otherwise insert
// Returns { added: boolean, updated: boolean }
export function upsertApp(db: any, app: NormalizedApp): { added: boolean; updated: boolean } {
  const existing = db.prepare('SELECT id, import_source FROM sso_apps WHERE app_key = ?').get(app.app_key)

  if (existing) {
    // Only update if current source is same or manual (don't overwrite verified manual data with imports)
    // But DO update if it's same source (refresh)
    if (existing.import_source === 'manual' && app.import_source !== 'manual') {
      // Manual data takes priority - only update import metadata
      db.prepare('UPDATE sso_apps SET external_id = ?, logo_url = ?, entra_id = MAX(entra_id, ?), okta = MAX(okta, ?), ping = MAX(ping, ?), keycloak = MAX(keycloak, ?) WHERE app_key = ?')
        .run(app.external_id, app.logo_url, app.entra_id, app.okta, app.ping, app.keycloak, app.app_key)
      return { added: false, updated: true }
    }

    db.prepare(`UPDATE sso_apps SET
      app_name = ?, vendor = ?, description = ?,
      oidc = ?, oauth2 = ?, saml2 = ?, scim = ?, ldap = ?,
      kerberos = ?, ws_federation = ?, cas = ?,
      entra_id = ?, okta = ?, ping = ?, keycloak = ?,
      auth0 = ?, onelogin = ?, forgerock = ?,
      license_requirement = ?, implementation_notes = ?,
      source_urls = ?, confidence = ?,
      import_source = ?, external_id = ?, logo_url = ?,
      updated_at = unixepoch()
    WHERE app_key = ?`).run(
      app.app_name, app.vendor, app.description,
      app.oidc, app.oauth2, app.saml2, app.scim, app.ldap,
      app.kerberos, app.ws_federation, app.cas,
      app.entra_id, app.okta, app.ping, app.keycloak,
      app.auth0, app.onelogin, app.forgerock,
      app.license_requirement, app.implementation_notes,
      app.source_urls, app.confidence,
      app.import_source, app.external_id, app.logo_url,
      app.app_key
    )
    return { added: false, updated: true }
  }

  db.prepare(`INSERT INTO sso_apps (
    app_key, app_name, vendor, description,
    oidc, oauth2, saml2, scim, ldap, kerberos, ws_federation, cas,
    entra_id, okta, ping, keycloak, auth0, onelogin, forgerock,
    license_requirement, implementation_notes, source_urls, confidence,
    import_source, external_id, logo_url
  ) VALUES (
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?
  )`).run(
    app.app_key, app.app_name, app.vendor, app.description,
    app.oidc, app.oauth2, app.saml2, app.scim, app.ldap, app.kerberos, app.ws_federation, app.cas,
    app.entra_id, app.okta, app.ping, app.keycloak, app.auth0, app.onelogin, app.forgerock,
    app.license_requirement, app.implementation_notes, app.source_urls, app.confidence,
    app.import_source, app.external_id, app.logo_url
  )
  return { added: true, updated: false }
}
