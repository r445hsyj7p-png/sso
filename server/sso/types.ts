export interface SSOApp {
  id: number
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
  restrictions: string | null
  implementation_notes: string | null
  source_urls: string | null
  confidence: number
  updated_at: number
}

export interface SourceUrl {
  title: string
  url: string
}

export interface AnalyzerResult {
  filename: string
  inputType: 'saml_xml' | 'oidc_json' | 'config_file' | 'url' | 'unknown'
  detectedProtocols: Array<{ protocol: string; confidence: number; evidence: string }>
  oidcConfig?: Record<string, unknown>
  samlConfig?: Record<string, unknown>
  oauthFlows?: string[]
  scimConfig?: Record<string, unknown>
  detectedIdP?: string[]
  notes: string[]
}
