export interface ImportResult {
  source: string
  appsAdded: number
  appsUpdated: number
  errors: string[]
  duration: number
}

export interface NormalizedApp {
  app_key: string
  app_name: string
  vendor: string | null
  description: string | null
  oidc: number
  oauth2: number
  saml2: number
  scim: number
  ldap: number
  kerberos: number
  ws_federation: number
  cas: number
  entra_id: number
  okta: number
  ping: number
  keycloak: number
  auth0: number
  onelogin: number
  forgerock: number
  license_requirement: string
  implementation_notes: string | null
  source_urls: string | null
  confidence: number
  import_source: string
  external_id: string | null
  logo_url: string | null
}
