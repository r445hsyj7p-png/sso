-- SSO Checker schema
CREATE TABLE IF NOT EXISTS sso_apps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_key TEXT NOT NULL UNIQUE,
  app_name TEXT NOT NULL,
  vendor TEXT,
  description TEXT,
  oidc INTEGER DEFAULT 0,
  oauth2 INTEGER DEFAULT 0,
  saml2 INTEGER DEFAULT 0,
  scim INTEGER DEFAULT 0,
  ldap INTEGER DEFAULT 0,
  kerberos INTEGER DEFAULT 0,
  ws_federation INTEGER DEFAULT 0,
  cas INTEGER DEFAULT 0,
  entra_id INTEGER DEFAULT 0,
  okta INTEGER DEFAULT 0,
  ping INTEGER DEFAULT 0,
  keycloak INTEGER DEFAULT 0,
  auth0 INTEGER DEFAULT 0,
  onelogin INTEGER DEFAULT 0,
  forgerock INTEGER DEFAULT 0,
  license_requirement TEXT DEFAULT 'unclear',
  restrictions TEXT,
  implementation_notes TEXT,
  source_urls TEXT,
  confidence INTEGER DEFAULT 80,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS sso_search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  searched_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS sso_analyzer_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT,
  result_json TEXT NOT NULL,
  analyzed_at INTEGER NOT NULL DEFAULT (unixepoch())
);
