import { XMLParser } from 'fast-xml-parser'
import type { AnalyzerResult } from './types.js'

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

export function analyzeContent(filename: string, content: string): AnalyzerResult {
  const result: AnalyzerResult = {
    filename,
    inputType: 'unknown',
    detectedProtocols: [],
    notes: [],
    detectedIdP: [],
  }

  // Try SAML XML
  if (filename.endsWith('.xml') || content.includes('EntityDescriptor') || content.includes('urn:oasis:names:tc:SAML')) {
    return analyzeSAML(filename, content, result)
  }

  // Try OIDC/OAuth JSON
  if (filename.endsWith('.json') || (content.trim().startsWith('{'))) {
    try {
      const parsed = JSON.parse(content)
      if (parsed.issuer || parsed.authorization_endpoint || parsed.token_endpoint) {
        return analyzeOIDC(filename, parsed, result)
      }
      if (parsed.client_id || parsed.client_secret || parsed.redirect_uri) {
        return analyzeOAuthConfig(filename, parsed, result)
      }
    } catch {}
  }

  // Try config file
  if (filename.endsWith('.env') || filename.endsWith('.ini') ||
      filename.endsWith('.yaml') || filename.endsWith('.yml') ||
      content.includes('OIDC_') || content.includes('SAML_') || content.includes('IDP_')) {
    return analyzeConfigFile(filename, content, result)
  }

  // Try URL
  if (content.trim().startsWith('http://') || content.trim().startsWith('https://')) {
    return analyzeURL(filename, content.trim(), result)
  }

  result.notes.push('Could not determine file type. Supported: SAML XML, OIDC JSON, config files (.env/.yaml/.ini), or a login URL.')
  return result
}

function analyzeSAML(filename: string, content: string, result: AnalyzerResult): AnalyzerResult {
  result.inputType = 'saml_xml'
  result.detectedProtocols.push({ protocol: 'SAML 2.0', confidence: 95, evidence: 'EntityDescriptor found in XML' })

  try {
    const parsed = xmlParser.parse(content)
    const md = parsed['md:EntityDescriptor'] || parsed['EntityDescriptor'] || {}
    const sp = md['md:SPSSODescriptor'] || md['SPSSODescriptor'] || {}
    const idp = md['md:IDPSSODescriptor'] || md['IDPSSODescriptor'] || {}
    const role = Object.keys(sp).length > 0 ? 'Service Provider (SP)' : (Object.keys(idp).length > 0 ? 'Identity Provider (IdP)' : 'Unknown')

    const samlConfig: Record<string, unknown> = {
      entityId: md['@_entityID'] || 'Unknown',
      role,
    }

    // Extract ACS URLs (SP)
    const acs = sp['md:AssertionConsumerService'] || sp['AssertionConsumerService']
    if (acs) {
      const acsList = Array.isArray(acs) ? acs : [acs]
      samlConfig.assertionConsumerServiceUrls = acsList.map((a: any) => ({
        binding: a['@_Binding']?.split(':').pop() || 'Unknown',
        location: a['@_Location'] || 'Unknown',
        index: a['@_index'] || '0',
      }))
    }

    // Extract SSO URLs (IdP)
    const sso = idp['md:SingleSignOnService'] || idp['SingleSignOnService']
    if (sso) {
      const ssoList = Array.isArray(sso) ? sso : [sso]
      samlConfig.singleSignOnUrls = ssoList.map((s: any) => ({
        binding: s['@_Binding']?.split(':').pop() || 'Unknown',
        location: s['@_Location'] || 'Unknown',
      }))
    }

    // Extract SLO URLs
    const slo = sp['md:SingleLogoutService'] || sp['SingleLogoutService'] ||
                 idp['md:SingleLogoutService'] || idp['SingleLogoutService']
    if (slo) {
      const sloList = Array.isArray(slo) ? slo : [slo]
      samlConfig.singleLogoutUrls = sloList.map((s: any) => ({
        binding: s['@_Binding']?.split(':').pop() || 'Unknown',
        location: s['@_Location'] || 'Unknown',
      }))
    }

    // Extract NameID formats
    const nameIdFormats = sp['md:NameIDFormat'] || sp['NameIDFormat'] ||
                           idp['md:NameIDFormat'] || idp['NameIDFormat']
    if (nameIdFormats) {
      samlConfig.nameIdFormats = (Array.isArray(nameIdFormats) ? nameIdFormats : [nameIdFormats])
        .map((f: string) => f.split(':').pop() || f)
    }

    // Signing certs
    const keyDesc = sp['md:KeyDescriptor'] || sp['KeyDescriptor'] ||
                    idp['md:KeyDescriptor'] || idp['KeyDescriptor']
    if (keyDesc) {
      const keys = Array.isArray(keyDesc) ? keyDesc : [keyDesc]
      samlConfig.signingCertificates = keys
        .filter((k: any) => !k['@_use'] || k['@_use'] === 'signing')
        .map((k: any) => ({
          use: k['@_use'] || 'signing/encryption',
          subject: 'Certificate present (details omitted for security)',
        }))
    }

    // Validity period
    const validUntil = md['@_validUntil']
    if (validUntil) {
      samlConfig.validUntil = validUntil
      const expDate = new Date(validUntil)
      if (expDate < new Date()) {
        result.notes.push(`Warning: Metadata expired on ${validUntil}`)
      } else {
        result.notes.push(`Valid: Metadata valid until ${validUntil}`)
      }
    }

    result.samlConfig = samlConfig

    // Detect IdP from entity ID or URLs
    const entityId = String(samlConfig.entityId || '').toLowerCase()
    detectIdPFromString(entityId, result)

  } catch (e) {
    result.notes.push('SAML XML detected but parsing failed: ' + String(e))
  }

  return result
}

function analyzeOIDC(filename: string, parsed: Record<string, unknown>, result: AnalyzerResult): AnalyzerResult {
  result.inputType = 'oidc_json'
  result.detectedProtocols.push({ protocol: 'OpenID Connect (OIDC)', confidence: 97, evidence: 'OIDC Discovery document detected (issuer, endpoints)' })
  result.detectedProtocols.push({ protocol: 'OAuth 2.0', confidence: 97, evidence: 'OAuth 2.0 endpoints present' })

  result.oidcConfig = {
    issuer: parsed.issuer,
    authorizationEndpoint: parsed.authorization_endpoint,
    tokenEndpoint: parsed.token_endpoint,
    userinfoEndpoint: parsed.userinfo_endpoint,
    jwksUri: parsed.jwks_uri,
    endSessionEndpoint: parsed.end_session_endpoint,
    revocationEndpoint: parsed.revocation_endpoint,
    introspectionEndpoint: parsed.introspection_endpoint,
    registrationEndpoint: parsed.registration_endpoint,
    discoveryEndpoint: `${parsed.issuer}/.well-known/openid-configuration`,
    supportedScopes: parsed.scopes_supported,
    supportedResponseTypes: parsed.response_types_supported,
    supportedGrantTypes: parsed.grant_types_supported,
    supportedClaims: parsed.claims_supported,
    pkceSupported: Array.isArray(parsed.code_challenge_methods_supported) &&
                    (parsed.code_challenge_methods_supported as string[]).length > 0,
    pkceCodeChallengeMethods: parsed.code_challenge_methods_supported,
    supportedSigningAlgs: parsed.id_token_signing_alg_values_supported,
    frontchannelLogout: !!parsed.frontchannel_logout_supported,
    backchannelLogout: !!parsed.backchannel_logout_supported,
    dynamicClientRegistration: !!parsed.registration_endpoint,
  }

  // Detect OAuth flows
  const grantTypes = (parsed.grant_types_supported as string[]) || []
  const flows: string[] = []
  if (grantTypes.includes('authorization_code')) flows.push('Authorization Code')
  if (grantTypes.includes('client_credentials')) flows.push('Client Credentials')
  if (grantTypes.includes('refresh_token')) flows.push('Refresh Token')
  if (grantTypes.includes('urn:ietf:params:oauth:grant-type:device_code')) flows.push('Device Code')
  if (grantTypes.includes('implicit')) flows.push('Implicit (legacy)')
  result.oauthFlows = flows

  // Detect IdP from issuer
  detectIdPFromString(String(parsed.issuer || '').toLowerCase(), result)

  return result
}

function analyzeOAuthConfig(filename: string, parsed: Record<string, unknown>, result: AnalyzerResult): AnalyzerResult {
  result.inputType = 'config_file'
  result.detectedProtocols.push({ protocol: 'OAuth 2.0', confidence: 80, evidence: 'OAuth client configuration detected (client_id, client_secret, redirect_uri)' })

  const allValues = JSON.stringify(parsed).toLowerCase()
  if (allValues.includes('openid')) {
    result.detectedProtocols.push({ protocol: 'OpenID Connect (OIDC)', confidence: 75, evidence: 'openid scope or OIDC terms found in config' })
  }

  detectIdPFromString(allValues, result)
  result.notes.push('OAuth 2.0 client configuration detected. For full OIDC analysis, provide the discovery document from: {issuer}/.well-known/openid-configuration')
  return result
}

function analyzeConfigFile(filename: string, content: string, result: AnalyzerResult): AnalyzerResult {
  result.inputType = 'config_file'
  const lower = content.toLowerCase()

  // Detect protocols from config keys/values
  const oidcPatterns = ['oidc_', 'openid', 'issuer', 'authorization_endpoint', 'client_id', 'client_secret', 'redirect_uri']
  const samlPatterns = ['saml_', 'entityid', 'acs_url', 'sso_url', 'idp_metadata', 'sp_entity', 'x509cert', 'saml2']
  const ldapPatterns = ['ldap_', 'ldap://', 'active_directory', 'ad_domain', 'bind_dn']
  const scimPatterns = ['scim_', 'scim2', 'user_endpoint', 'group_endpoint']

  const oidcMatches = oidcPatterns.filter(p => lower.includes(p))
  const samlMatches = samlPatterns.filter(p => lower.includes(p))
  const ldapMatches = ldapPatterns.filter(p => lower.includes(p))
  const scimMatches = scimPatterns.filter(p => lower.includes(p))

  if (oidcMatches.length > 0) {
    result.detectedProtocols.push({
      protocol: 'OpenID Connect / OAuth 2.0',
      confidence: Math.min(60 + oidcMatches.length * 10, 90),
      evidence: `Keys found: ${oidcMatches.join(', ')}`
    })
  }
  if (samlMatches.length > 0) {
    result.detectedProtocols.push({
      protocol: 'SAML 2.0',
      confidence: Math.min(60 + samlMatches.length * 10, 90),
      evidence: `Keys found: ${samlMatches.join(', ')}`
    })
  }
  if (ldapMatches.length > 0) {
    result.detectedProtocols.push({
      protocol: 'LDAP/Active Directory',
      confidence: Math.min(60 + ldapMatches.length * 10, 90),
      evidence: `Keys found: ${ldapMatches.join(', ')}`
    })
  }
  if (scimMatches.length > 0) {
    result.detectedProtocols.push({
      protocol: 'SCIM',
      confidence: Math.min(60 + scimMatches.length * 10, 90),
      evidence: `Keys found: ${scimMatches.join(', ')}`
    })
  }

  // Extract key=value pairs for display
  const extractedConfig: Record<string, string> = {}
  const ssoKeywords = ['oidc', 'saml', 'idp', 'sso', 'auth', 'okta', 'entra', 'azure', 'client_id', 'issuer', 'entity', 'ldap', 'scim']
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^([A-Z_a-z][A-Z_a-z0-9]*)\s*[=:]\s*(.+)/)
    if (match && ssoKeywords.some(k => match[1].toLowerCase().includes(k))) {
      const value = match[2].trim().replace(/["']/g, '')
      extractedConfig[match[1]] = value.length > 100 ? value.substring(0, 100) + '...' : value
    }
  }
  if (Object.keys(extractedConfig).length > 0) {
    result.notes.push(`Extracted ${Object.keys(extractedConfig).length} SSO-related configuration keys`)
    result.oidcConfig = extractedConfig
  }

  detectIdPFromString(lower, result)

  if (result.detectedProtocols.length === 0) {
    result.notes.push('No SSO-related configuration patterns detected in this file.')
  }

  return result
}

function analyzeURL(filename: string, url: string, result: AnalyzerResult): AnalyzerResult {
  result.inputType = 'url'
  const lower = url.toLowerCase()

  // Check for SAML
  if (lower.includes('samlrequest=') || lower.includes('samlresponse=')) {
    result.detectedProtocols.push({ protocol: 'SAML 2.0', confidence: 95, evidence: 'SAMLRequest/SAMLResponse parameter in URL' })
  }

  // Check for OAuth/OIDC
  if (lower.includes('response_type=code') || lower.includes('response_type=token')) {
    result.detectedProtocols.push({ protocol: 'OAuth 2.0 / OIDC', confidence: 92, evidence: 'response_type parameter in URL (Authorization Code/Implicit flow)' })
  }
  if (lower.includes('/.well-known/openid-configuration')) {
    result.detectedProtocols.push({ protocol: 'OpenID Connect (OIDC)', confidence: 99, evidence: 'OIDC Discovery endpoint URL detected' })
  }

  // CAS
  if (lower.includes('ticket=') || lower.includes('/cas/login') || lower.includes('/cas/servicevalidate')) {
    result.detectedProtocols.push({ protocol: 'CAS', confidence: 85, evidence: 'CAS URL patterns detected (ticket parameter or /cas/ path)' })
  }

  // WS-Fed
  if (lower.includes('wsfed') || lower.includes('wa=wsignin') || lower.includes('wreply=')) {
    result.detectedProtocols.push({ protocol: 'WS-Federation', confidence: 90, evidence: 'WS-Federation parameters (wa, wreply) detected' })
  }

  detectIdPFromString(lower, result)

  if (result.detectedProtocols.length === 0) {
    result.notes.push('No SSO protocol patterns detected in URL. For deeper analysis, provide SAML metadata XML or OIDC discovery document.')
  }

  result.notes.push(`Analyzed URL: ${url}`)
  return result
}

function detectIdPFromString(str: string, result: AnalyzerResult): void {
  const idpMap: Record<string, string> = {
    'login.microsoftonline.com': 'Microsoft Entra ID',
    'microsoftonline.com': 'Microsoft Entra ID',
    'sts.windows.net': 'Microsoft Entra ID',
    'entra': 'Microsoft Entra ID',
    'okta.com': 'Okta',
    'oktapreview.com': 'Okta',
    'auth0.com': 'Auth0',
    'ping': 'Ping Identity',
    'pingone': 'Ping Identity',
    'pingfed': 'Ping Identity',
    'accounts.google.com': 'Google Identity',
    'google.com/o/oauth2': 'Google Identity',
    'keycloak': 'Keycloak',
    'onelogin': 'OneLogin',
    'forgerock': 'ForgeRock',
    'adfs': 'Active Directory Federation Services (ADFS)',
  }

  const detected = new Set<string>()
  for (const [pattern, name] of Object.entries(idpMap)) {
    if (str.includes(pattern)) {
      detected.add(name)
    }
  }

  result.detectedIdP = [...detected]
}
