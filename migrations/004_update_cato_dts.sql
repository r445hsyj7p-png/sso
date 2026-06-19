-- Update Cato Networks entry: add DTS Identity integration, correct SCIM support
UPDATE sso_apps SET
  scim = 1,
  implementation_notes = 'OIDC-only SSO — SAML is explicitly not supported. SSO covers both the Cato Management Application and Client authentication. Natively supported IdPs include Okta, Microsoft Entra ID, Google, and DTS Identity (German IAM/CIAM platform by DTS Systeme, added May 2026). User provisioning via SCIM for automated sync from the IdP. Configuration via Cato Management Application under Access > SSO.',
  source_urls = '[{"title":"Cato SSO Authentication Overview","url":"https://support.catonetworks.com/hc/en-us/articles/12710415750557-SSO-Authentication-for-Users-with-Cato"},{"title":"Supported Identity Providers for SSO","url":"https://support.catonetworks.com/hc/en-us/articles/32111432705821-Supported-Identity-Providers-for-SSO-Authentication"},{"title":"Configuring DTS Identity SSO for Cato","url":"https://support.catonetworks.com/hc/en-us/articles/36170741510045-Configuring-DTS-Identity-SSO-for-your-Account"},{"title":"Provisioning Users with SCIM","url":"https://support.catonetworks.com/hc/en-us/articles/13651160092701-Provisioning-Users-with-SCIM"},{"title":"DTS Identity Platform","url":"https://www.dts.de/en/security-software-by-dts/solutions-services/dts-identity"}]',
  updated_at = unixepoch()
WHERE app_key = 'cato-networks';
