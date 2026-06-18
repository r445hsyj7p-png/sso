export const SEED_APPS = [
  // === ATLASSIAN ===
  {
    app_key: 'jira',
    app_name: 'Jira',
    vendor: 'Atlassian',
    description: 'Issue and project tracking software widely used in software development teams.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 and SCIM require Atlassian Access (now Atlassian Guard) subscription. OIDC available via Atlassian Access. User directory sync via SCIM 2.0. Supports both cloud and Data Center versions.',
    source_urls: JSON.stringify([
      { title: 'Atlassian Access - SAML SSO', url: 'https://support.atlassian.com/security-and-access-policies/docs/configure-saml-single-sign-on-with-an-identity-provider/' },
      { title: 'SCIM provisioning', url: 'https://support.atlassian.com/provisioning-users/docs/configure-user-provisioning-with-an-identity-provider/' }
    ]),
    confidence: 95,
  },
  {
    app_key: 'confluence',
    app_name: 'Confluence',
    vendor: 'Atlassian',
    description: 'Team collaboration and documentation wiki platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'enterprise',
    implementation_notes: 'Same Atlassian Access / Atlassian Guard subscription as Jira covers all Atlassian products. SSO configuration is at the organization level.',
    source_urls: JSON.stringify([
      { title: 'Atlassian Guard SSO docs', url: 'https://support.atlassian.com/security-and-access-policies/docs/configure-saml-single-sign-on-with-an-identity-provider/' }
    ]),
    confidence: 95,
  },
  {
    app_key: 'bitbucket',
    app_name: 'Bitbucket',
    vendor: 'Atlassian',
    description: 'Git-based source code repository hosting service.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'Covered under Atlassian Guard subscription. Bitbucket Data Center supports LDAP natively.',
    source_urls: JSON.stringify([
      { title: 'Bitbucket SSO', url: 'https://support.atlassian.com/bitbucket-cloud/docs/enable-sso-for-a-workspace/' }
    ]),
    confidence: 90,
  },
  // === SERVICENOW ===
  {
    app_key: 'servicenow',
    app_name: 'ServiceNow',
    vendor: 'ServiceNow',
    description: 'Enterprise IT service management (ITSM) and workflow automation platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO included in all ServiceNow instances. Supports multiple IdP configurations simultaneously. SCIM via IntegrationHub or dedicated HRSD connector. Kerberos supported for on-premise.',
    source_urls: JSON.stringify([
      { title: 'ServiceNow SSO docs', url: 'https://docs.servicenow.com/bundle/tokyo-platform-security/page/integrate/single-sign-on/concept/c_SingleSignOn.html' },
      { title: 'SAML 2.0 configuration', url: 'https://docs.servicenow.com/bundle/tokyo-platform-security/page/integrate/single-sign-on/task/t_SetUpSAMLSSO.html' }
    ]),
    confidence: 97,
  },
  // === SALESFORCE ===
  {
    app_key: 'salesforce',
    app_name: 'Salesforce',
    vendor: 'Salesforce',
    description: 'Customer relationship management (CRM) and cloud-based enterprise platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO included in all editions. Salesforce can act as both SP and IdP. OAuth 2.0 built-in for API access. SCIM 2.0 via Identity Connect or third-party. My Domain required for SSO.',
    source_urls: JSON.stringify([
      { title: 'Salesforce SSO overview', url: 'https://help.salesforce.com/s/articleView?id=sf.sso_about.htm' },
      { title: 'SAML SSO for Salesforce', url: 'https://help.salesforce.com/s/articleView?id=sf.sso_saml.htm' }
    ]),
    confidence: 97,
  },
  // === WORKDAY ===
  {
    app_key: 'workday',
    app_name: 'Workday',
    vendor: 'Workday',
    description: 'Enterprise cloud platform for human capital management (HCM) and financial management.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 is primary SSO method. SCIM 2.0 supported for provisioning. Workday Studio needed for advanced integrations. SP-initiated and IdP-initiated SSO both supported.',
    source_urls: JSON.stringify([
      { title: 'Workday SSO overview', url: 'https://doc.workday.com/content/wday/en-us/software/authentication-sso/single-sign-on-overview.html' }
    ]),
    confidence: 93,
  },
  // === GITHUB ===
  {
    app_key: 'github',
    app_name: 'GitHub',
    vendor: 'Microsoft',
    description: 'Web-based platform for version control and collaboration using Git.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO requires GitHub Enterprise Cloud. SCIM provisioning available with SAML SSO. GitHub Actions supports OIDC for cloud provider authentication without secrets.',
    source_urls: JSON.stringify([
      { title: 'GitHub SAML SSO', url: 'https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on' },
      { title: 'GitHub SCIM provisioning', url: 'https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/provisioning-user-accounts-with-scim' }
    ]),
    confidence: 97,
  },
  // === GITLAB ===
  {
    app_key: 'gitlab',
    app_name: 'GitLab',
    vendor: 'GitLab',
    description: 'DevOps platform providing Git repository management, CI/CD, and more.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, cas: 1, ws_federation: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO available on Premium/Ultimate (SaaS) and all tiers (self-managed). SCIM requires Premium+. LDAP available on all self-managed tiers. OmniAuth supports many providers.',
    source_urls: JSON.stringify([
      { title: 'GitLab SSO docs', url: 'https://docs.gitlab.com/ee/administration/auth/' },
      { title: 'SAML SSO for GitLab', url: 'https://docs.gitlab.com/ee/user/group/saml_sso/' }
    ]),
    confidence: 96,
  },
  // === MICROSOFT 365 ===
  {
    app_key: 'microsoft365',
    app_name: 'Microsoft 365',
    vendor: 'Microsoft',
    description: 'Cloud-based productivity suite including Office apps, Teams, Exchange, and SharePoint.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'Microsoft Entra ID (formerly Azure AD) is the native IdP. Federation via WS-Federation or SAML 2.0 with external IdPs. Supports Entra ID Connect for hybrid scenarios.',
    source_urls: JSON.stringify([
      { title: 'Microsoft 365 SSO', url: 'https://learn.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on' }
    ]),
    confidence: 97,
  },
  // === SLACK ===
  {
    app_key: 'slack',
    app_name: 'Slack',
    vendor: 'Salesforce',
    description: 'Business messaging and collaboration platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO requires Business+ or Enterprise Grid plan. SCIM provisioning available on same plans. Slack can use Google Workspace for SSO on lower tiers.',
    source_urls: JSON.stringify([
      { title: 'Slack SSO docs', url: 'https://slack.com/intl/en-gb/help/articles/203772216-SAML-single-sign-on' },
      { title: 'SCIM provisioning', url: 'https://slack.com/intl/en-gb/help/articles/115005770703-Automatically-provision-and-deprovision-users' }
    ]),
    confidence: 96,
  },
  // === ZOOM ===
  {
    app_key: 'zoom',
    app_name: 'Zoom',
    vendor: 'Zoom Video Communications',
    description: 'Video conferencing and online meeting platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO requires Business plan or higher. SCIM provisioning available. Supports Just-in-Time (JIT) provisioning via SAML attributes.',
    source_urls: JSON.stringify([
      { title: 'Zoom SSO docs', url: 'https://support.zoom.us/hc/en-us/articles/115005887566' }
    ]),
    confidence: 93,
  },
  // === DATADOG ===
  {
    app_key: 'datadog',
    app_name: 'Datadog',
    vendor: 'Datadog',
    description: 'Monitoring and analytics platform for cloud applications and infrastructure.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO available on Enterprise plan. SCIM provisioning supported. Role mapping via SAML attributes supported.',
    source_urls: JSON.stringify([
      { title: 'Datadog SAML SSO', url: 'https://docs.datadoghq.com/account_management/saml/' }
    ]),
    confidence: 90,
  },
  // === SAP SUCCESSFACTORS ===
  {
    app_key: 'sap-successfactors',
    app_name: 'SAP SuccessFactors',
    vendor: 'SAP',
    description: 'Cloud-based human capital management (HCM) suite.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 is primary SSO method. Provisioning via SAP Identity Provisioning Service (IPS). Supports OAuth 2.0 for API access.',
    source_urls: JSON.stringify([
      { title: 'SAP SuccessFactors SSO', url: 'https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM/568fdf1f14f14fd089a3cd15194d19cc/b37ad60ad7084f27b2e773b4e4c2a55c.html' }
    ]),
    confidence: 88,
  },
  // === SAP S/4HANA ===
  {
    app_key: 'sap-s4hana',
    app_name: 'SAP S/4HANA',
    vendor: 'SAP',
    description: 'Intelligent ERP suite for enterprise resource planning.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SSO via SAP Identity Authentication Service (IAS). SAML 2.0 and OIDC both supported. Kerberos for Windows-integrated SSO. LDAP for on-premise deployments.',
    source_urls: JSON.stringify([
      { title: 'SAP IAS documentation', url: 'https://help.sap.com/docs/IDENTITY_AUTHENTICATION' }
    ]),
    confidence: 85,
  },
  // === WORKFRONT ===
  {
    app_key: 'workfront',
    app_name: 'Adobe Workfront',
    vendor: 'Adobe',
    description: 'Enterprise project management and work management platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO included. LDAP for user directory integration. SCIM provisioning supported for automated user management.',
    source_urls: JSON.stringify([
      { title: 'Workfront SSO docs', url: 'https://experienceleague.adobe.com/docs/workfront/using/administration-and-setup/add-users/single-sign-on/sso-in-workfront.html' }
    ]),
    confidence: 85,
  },
  // === ADOBE SIGN ===
  {
    app_key: 'adobe-sign',
    app_name: 'Adobe Acrobat Sign',
    vendor: 'Adobe',
    description: 'Electronic signature and document management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 and OIDC SSO available on enterprise plans. Part of Adobe Experience Cloud with unified SSO via Adobe Identity Management System (IMS).',
    source_urls: JSON.stringify([
      { title: 'Adobe Sign SSO', url: 'https://helpx.adobe.com/sign/using/enabling-saml-token-configuration.html' }
    ]),
    confidence: 85,
  },
  // === DOCUSIGN ===
  {
    app_key: 'docusign',
    app_name: 'DocuSign',
    vendor: 'DocuSign',
    description: 'Electronic signature and agreement cloud platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO requires enterprise plan. SCIM provisioning available. OAuth 2.0 used for API integrations. Supports JIT user provisioning.',
    source_urls: JSON.stringify([
      { title: 'DocuSign SSO docs', url: 'https://support.docusign.com/s/document-item?bundleId=pik1583277475390&topicId=blf1578456411274.html' }
    ]),
    confidence: 88,
  },
  // === SNOWFLAKE ===
  {
    app_key: 'snowflake',
    app_name: 'Snowflake',
    vendor: 'Snowflake',
    description: 'Cloud data warehousing and analytics platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and SCIM supported on all editions. OAuth 2.0 for external integrations. Key-pair authentication also available. Kerberos for on-premise data sources.',
    source_urls: JSON.stringify([
      { title: 'Snowflake SSO docs', url: 'https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview.html' }
    ]),
    confidence: 92,
  },
  // === ZENDESK ===
  {
    app_key: 'zendesk',
    app_name: 'Zendesk',
    vendor: 'Zendesk',
    description: 'Customer service and support ticketing platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO available on Suite Growth plan and higher. SCIM provisioning on Enterprise. Supports both agent and end-user SSO configuration separately.',
    source_urls: JSON.stringify([
      { title: 'Zendesk SSO', url: 'https://support.zendesk.com/hc/en-us/articles/203663676' }
    ]),
    confidence: 92,
  },
  // === HUBSPOT ===
  {
    app_key: 'hubspot',
    app_name: 'HubSpot',
    vendor: 'HubSpot',
    description: 'CRM platform with marketing, sales, and customer service tools.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO available on Enterprise tier only. No built-in SCIM; user provisioning via API or third-party tools.',
    source_urls: JSON.stringify([
      { title: 'HubSpot SSO', url: 'https://knowledge.hubspot.com/settings/set-up-single-sign-on-sso' }
    ]),
    confidence: 88,
  },
  // === OKTA (as an app) ===
  {
    app_key: 'okta',
    app_name: 'Okta Workforce Identity',
    vendor: 'Okta',
    description: 'Identity and access management platform providing SSO and MFA for enterprise apps.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Okta is primarily an IdP but also integrates with other IdPs via federation. Supports all major protocols natively. Can be configured as SP for upstream IdP scenarios.',
    source_urls: JSON.stringify([
      { title: 'Okta documentation', url: 'https://developer.okta.com/docs/concepts/saml/' }
    ]),
    confidence: 99,
  },
  // === AUTH0 ===
  {
    app_key: 'auth0',
    app_name: 'Auth0 by Okta',
    vendor: 'Okta',
    description: 'Flexible authentication and authorization platform for developers and enterprises.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Auth0 is primarily an IdP/authorization server. Supports enterprise connections (SAML, OIDC, LDAP, AD) as upstream sources. Social connections and custom databases also supported.',
    source_urls: JSON.stringify([
      { title: 'Auth0 docs', url: 'https://auth0.com/docs/authenticate/protocols' }
    ]),
    confidence: 99,
  },
  // === PING IDENTITY ===
  {
    app_key: 'ping-identity',
    app_name: 'Ping Identity',
    vendor: 'Ping Identity',
    description: 'Enterprise identity security platform (PingFederate, PingOne, PingAccess).',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'PingFederate is a full-featured federation server. PingOne is cloud IdP. Supports all major protocols. Often deployed as enterprise gateway.',
    source_urls: JSON.stringify([
      { title: 'Ping Identity docs', url: 'https://docs.pingidentity.com/r/en-us/solution-guides/htg_use_saml_assertion_attributes_with_pingfederate' }
    ]),
    confidence: 99,
  },
  // === HASHICORP VAULT ===
  {
    app_key: 'hashicorp-vault',
    app_name: 'HashiCorp Vault',
    vendor: 'HashiCorp',
    description: 'Secrets management and data protection platform.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 0, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'OIDC and LDAP auth methods are open source. SAML available in Vault Enterprise. Supports JWT, AppRole, Kubernetes, AWS, and many other auth methods.',
    source_urls: JSON.stringify([
      { title: 'Vault auth methods', url: 'https://developer.hashicorp.com/vault/docs/auth' },
      { title: 'Vault OIDC auth', url: 'https://developer.hashicorp.com/vault/docs/auth/jwt/oidc-providers' }
    ]),
    confidence: 95,
  },
  // === GRAFANA ===
  {
    app_key: 'grafana',
    app_name: 'Grafana',
    vendor: 'Grafana Labs',
    description: 'Open-source observability and data visualization platform.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 0, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'addon',
    implementation_notes: 'SAML SSO requires Grafana Enterprise license. OAuth2/OIDC available in OSS. LDAP available in all versions. GitHub, Google, GitLab OAuth also supported natively.',
    source_urls: JSON.stringify([
      { title: 'Grafana authentication docs', url: 'https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-authentication/' }
    ]),
    confidence: 93,
  },
  // === KIBANA/ELASTIC ===
  {
    app_key: 'elastic-kibana',
    app_name: 'Elastic / Kibana',
    vendor: 'Elastic',
    description: 'Search and observability platform, including Kibana for data visualization.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 1, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML, OIDC, Kerberos, and PKI authentication require Elastic Platinum or Enterprise subscription. LDAP available at Gold tier. Basic auth only in free tier.',
    source_urls: JSON.stringify([
      { title: 'Elastic SSO docs', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/saml-guide-authentication.html' }
    ]),
    confidence: 92,
  },
  // === SPLUNK ===
  {
    app_key: 'splunk',
    app_name: 'Splunk Enterprise / Cloud',
    vendor: 'Splunk (Cisco)',
    description: 'Data analytics and security information and event management (SIEM) platform.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 0, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and LDAP included in Splunk Enterprise. Splunk Cloud supports SAML SSO. ProxySSO available for complex deployments.',
    source_urls: JSON.stringify([
      { title: 'Splunk SAML docs', url: 'https://docs.splunk.com/Documentation/Splunk/latest/Security/HowSAMLSSOworks' }
    ]),
    confidence: 90,
  },
  // === TABLEAU ===
  {
    app_key: 'tableau',
    app_name: 'Tableau',
    vendor: 'Salesforce',
    description: 'Business intelligence and data visualization platform.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 1, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available in Tableau Server (all versions) and Tableau Cloud. OIDC available in newer versions. Kerberos for database connections.',
    source_urls: JSON.stringify([
      { title: 'Tableau SSO', url: 'https://help.tableau.com/current/server/en-us/saml_requ.htm' }
    ]),
    confidence: 90,
  },
  // === POWER BI ===
  {
    app_key: 'power-bi',
    app_name: 'Microsoft Power BI',
    vendor: 'Microsoft',
    description: 'Business analytics and data visualization service.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 0, kerberos: 1, scim: 0, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication managed through Microsoft Entra ID. SSO via Entra ID or federated IdPs. Kerberos for on-premises data gateway. Part of Microsoft 365 ecosystem.',
    source_urls: JSON.stringify([
      { title: 'Power BI authentication', url: 'https://learn.microsoft.com/en-us/power-bi/admin/service-admin-power-bi-security' }
    ]),
    confidence: 88,
  },
  // === AWS ===
  {
    app_key: 'aws-iam-identity-center',
    app_name: 'AWS IAM Identity Center',
    vendor: 'Amazon Web Services',
    description: 'AWS service for centralized access management to AWS accounts and applications.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'AWS IAM Identity Center (formerly SSO) is free. Integrates with external IdPs via SAML 2.0. SCIM for automated user provisioning. Also supports built-in identity store.',
    source_urls: JSON.stringify([
      { title: 'AWS IAM Identity Center docs', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html' }
    ]),
    confidence: 97,
  },
  // === GOOGLE WORKSPACE ===
  {
    app_key: 'google-workspace',
    app_name: 'Google Workspace',
    vendor: 'Google',
    description: 'Cloud-based productivity and collaboration suite (Gmail, Drive, Docs, etc.).',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 1, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'Google Workspace acts as IdP via SAML or OIDC. Also supports third-party IdPs for SSO. LDAP via Google Cloud Directory Sync (GCDS). SCIM for user provisioning.',
    source_urls: JSON.stringify([
      { title: 'Google Workspace SSO', url: 'https://support.google.com/a/answer/60224' }
    ]),
    confidence: 97,
  },
  // === AZURE DEVOPS ===
  {
    app_key: 'azure-devops',
    app_name: 'Azure DevOps',
    vendor: 'Microsoft',
    description: 'Microsoft DevOps platform with repos, pipelines, boards, and test plans.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 0, kerberos: 0, scim: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication via Microsoft Entra ID. Supports SAML-based SSO through Entra ID federation. Azure AD-linked organizations enforce SSO. Service principals use OAuth 2.0.',
    source_urls: JSON.stringify([
      { title: 'Azure DevOps authentication', url: 'https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/access-with-azure-ad' }
    ]),
    confidence: 90,
  },
  // === COUPA ===
  {
    app_key: 'coupa',
    app_name: 'Coupa',
    vendor: 'Coupa Software',
    description: 'Cloud-based business spend management platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available on all Coupa plans. SCIM 2.0 for user provisioning. JIT provisioning supported via SAML attributes.',
    source_urls: JSON.stringify([
      { title: 'Coupa SSO docs', url: 'https://compass.coupa.com/en-US/products/product-documentation/coupa-platform-documentation/coupa-platform-security-documentation/single-sign-on' }
    ]),
    confidence: 85,
  },
  // === SAP ARIBA ===
  {
    app_key: 'sap-ariba',
    app_name: 'SAP Ariba',
    vendor: 'SAP',
    description: 'Cloud-based procurement and supply chain management platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO via SAP Identity Authentication Service (IAS). OAuth 2.0 for API access. Integration with SAP BTP for broader identity management.',
    source_urls: JSON.stringify([
      { title: 'SAP Ariba SSO', url: 'https://help.sap.com/docs/ARIBA_PROCUREMENT/2db03f2ee5d4453bb89f60e83afbdb1a/7b39bbfba36e47c3a7b95a1e5c2afc12.html' }
    ]),
    confidence: 82,
  },
  // === ORACLE CLOUD HCM ===
  {
    app_key: 'oracle-cloud-hcm',
    app_name: 'Oracle Cloud HCM',
    vendor: 'Oracle',
    description: 'Comprehensive human capital management suite in Oracle Cloud.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO via Oracle Identity Cloud Service (IDCS) or OIDC. SCIM 2.0 for provisioning. Integrates with Oracle Access Manager for on-premise deployments.',
    source_urls: JSON.stringify([
      { title: 'Oracle Cloud SSO', url: 'https://docs.oracle.com/en/cloud/paas/identity-cloud/uaids/' }
    ]),
    confidence: 85,
  },
  // === ORACLE FUSION ===
  {
    app_key: 'oracle-fusion',
    app_name: 'Oracle Fusion Cloud ERP',
    vendor: 'Oracle',
    description: 'Enterprise resource planning suite in Oracle Cloud.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication via Oracle Identity Cloud Service (IDCS). Supports SAML 2.0 and OIDC federation. Integration with on-premise Oracle Access Manager possible.',
    source_urls: JSON.stringify([
      { title: 'Oracle Fusion SSO', url: 'https://docs.oracle.com/en/cloud/saas/financials/23c/fafrm/set-up-saml-sso.html' }
    ]),
    confidence: 83,
  },
  // === ORACLE PEOPLESOFT ===
  {
    app_key: 'peoplesoft',
    app_name: 'Oracle PeopleSoft',
    vendor: 'Oracle',
    description: 'Enterprise application suite for HCM, financials, and campus solutions.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 via PeopleSoft Interaction Hub or Oracle Access Manager integration. LDAP for directory integration. Kerberos for Windows integrated authentication. Legacy product with limited modern IdP support.',
    source_urls: JSON.stringify([
      { title: 'PeopleSoft SSO', url: 'https://docs.oracle.com/cd/E92519_02/pt856pbr3/eng/pt/tsec/concept_UnderstandingSingleSignOn.html' }
    ]),
    confidence: 78,
  },
  // === IBM MAXIMO ===
  {
    app_key: 'ibm-maximo',
    app_name: 'IBM Maximo',
    vendor: 'IBM',
    description: 'Enterprise asset management (EAM) platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 1, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Maximo Application Suite uses OIDC/OAuth 2.0 via Red Hat SSO (Keycloak). Traditional Maximo uses LDAP and SAML. IBM Security Verify also supported.',
    source_urls: JSON.stringify([
      { title: 'Maximo Application Suite auth', url: 'https://www.ibm.com/docs/en/maximo-manage/8.3.0?topic=SSLPL8_8.3.0/com.ibm.mam.doc/admin/t_config_saml_sso.htm' }
    ]),
    confidence: 80,
  },
  // === IBM SECURITY VERIFY ===
  {
    app_key: 'ibm-security-verify',
    app_name: 'IBM Security Verify',
    vendor: 'IBM',
    description: 'Cloud-based identity and access management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'IBM Security Verify is a full IAM platform supporting all major protocols. Acts as IdP and can federate with other IdPs.',
    source_urls: JSON.stringify([
      { title: 'IBM Security Verify docs', url: 'https://docs.verify.ibm.com/verify/docs/sso-overview' }
    ]),
    confidence: 90,
  },
  // === MULESOFT ===
  {
    app_key: 'mulesoft',
    app_name: 'MuleSoft Anypoint Platform',
    vendor: 'Salesforce',
    description: 'Integration platform for APIs, integrations, and microservices.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Anypoint Platform supports SAML 2.0 SSO. OAuth 2.0 for API security. External identity providers configured at organization level.',
    source_urls: JSON.stringify([
      { title: 'MuleSoft SSO docs', url: 'https://docs.mulesoft.com/access-management/sso-prerequisites-about' }
    ]),
    confidence: 85,
  },
  // === BOOMI ===
  {
    app_key: 'boomi',
    app_name: 'Boomi AtomSphere',
    vendor: 'Boomi',
    description: 'Integration platform as a service (iPaaS) for connecting cloud and on-premise applications.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and OIDC SSO supported for Boomi platform access. OAuth 2.0 for API connectors.',
    source_urls: JSON.stringify([
      { title: 'Boomi SSO docs', url: 'https://help.boomi.com/bundle/atomsphere_platform/page/r-atm-SAML_SSO_support.html' }
    ]),
    confidence: 82,
  },
  // === SOLARWINDS ===
  {
    app_key: 'solarwinds',
    app_name: 'SolarWinds Orion',
    vendor: 'SolarWinds',
    description: 'IT infrastructure monitoring and management platform.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO supported in SolarWinds Orion Platform. Active Directory/LDAP and Windows authentication (Kerberos) also available.',
    source_urls: JSON.stringify([
      { title: 'SolarWinds SSO', url: 'https://documentation.solarwinds.com/en/success_center/orionplatform/content/core-enabling-saml-sso-sw5074.htm' }
    ]),
    confidence: 80,
  },
  // === QRADAR ===
  {
    app_key: 'qradar',
    app_name: 'IBM QRadar SIEM',
    vendor: 'IBM',
    description: 'Security information and event management (SIEM) platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 0, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO supported. LDAP integration for user authentication. OAuth 2.0 for QRadar API access.',
    source_urls: JSON.stringify([
      { title: 'QRadar SSO', url: 'https://www.ibm.com/docs/en/qradar-on-cloud?topic=authentication-saml-20-overview' }
    ]),
    confidence: 78,
  },
  // === MICROSOFT TEAMS ===
  {
    app_key: 'microsoft-teams',
    app_name: 'Microsoft Teams',
    vendor: 'Microsoft',
    description: 'Team collaboration platform with chat, meetings, and file sharing.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication entirely managed through Microsoft Entra ID. External IdP access via Entra ID B2B. Part of Microsoft 365 ecosystem.',
    source_urls: JSON.stringify([
      { title: 'Teams authentication', url: 'https://learn.microsoft.com/en-us/microsoftteams/teams-sign-in' }
    ]),
    confidence: 92,
  },
  // === WEBEX ===
  {
    app_key: 'webex',
    app_name: 'Cisco Webex',
    vendor: 'Cisco',
    description: 'Video conferencing, messaging, and collaboration platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO and SCIM provisioning available on all paid Webex plans via Cisco Control Hub. JIT provisioning supported.',
    source_urls: JSON.stringify([
      { title: 'Webex SSO docs', url: 'https://help.webex.com/en-us/article/rqfp7v/Configure-SSO-in-Control-Hub' }
    ]),
    confidence: 90,
  },
  // === DROPBOX ===
  {
    app_key: 'dropbox',
    app_name: 'Dropbox Business',
    vendor: 'Dropbox',
    description: 'Cloud file storage and collaboration platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO available on Business Plus and Enterprise plans. SCIM provisioning on same plans. Google Workspace SSO available on Business plans.',
    source_urls: JSON.stringify([
      { title: 'Dropbox SSO docs', url: 'https://help.dropbox.com/security/single-sign-on' }
    ]),
    confidence: 88,
  },
  // === BOX ===
  {
    app_key: 'box',
    app_name: 'Box',
    vendor: 'Box',
    description: 'Cloud content management and file sharing service for enterprises.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SSO available on Business and Enterprise plans. SCIM provisioning on Enterprise. App Center integrations with many IdPs.',
    source_urls: JSON.stringify([
      { title: 'Box SSO docs', url: 'https://support.box.com/hc/en-us/articles/360043696514-Setting-Up-Single-Sign-On-SSO-for-your-Enterprise' }
    ]),
    confidence: 90,
  },
  // === FRESHSERVICE ===
  {
    app_key: 'freshservice',
    app_name: 'Freshservice',
    vendor: 'Freshworks',
    description: 'IT service management and ITSM platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 and OIDC SSO available. SCIM for user provisioning. SSO available on Estate and Forest plans.',
    source_urls: JSON.stringify([
      { title: 'Freshservice SSO', url: 'https://support.freshservice.com/support/solutions/articles/50000003630-setting-up-single-sign-on-using-saml' }
    ]),
    confidence: 83,
  },
  // === FRESHDESK ===
  {
    app_key: 'freshdesk',
    app_name: 'Freshdesk',
    vendor: 'Freshworks',
    description: 'Customer support and helpdesk platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'addon',
    implementation_notes: 'SAML 2.0 SSO available as add-on. Google Workspace and Microsoft SSO available natively. OIDC supported in newer integrations.',
    source_urls: JSON.stringify([
      { title: 'Freshdesk SSO', url: 'https://support.freshdesk.com/support/solutions/articles/37590-using-single-sign-on-for-freshdesk' }
    ]),
    confidence: 80,
  },
  // === MONDAY.COM ===
  {
    app_key: 'monday',
    app_name: 'monday.com',
    vendor: 'monday.com',
    description: 'Work operating system and project management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM provisioning on Enterprise plan. Google Workspace SSO on Pro plan.',
    source_urls: JSON.stringify([
      { title: 'monday.com SSO', url: 'https://support.monday.com/hc/en-us/articles/360000460049-Single-Sign-On-SSO' }
    ]),
    confidence: 85,
  },
  // === ASANA ===
  {
    app_key: 'asana',
    app_name: 'Asana',
    vendor: 'Asana',
    description: 'Project and task management platform for teams.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM available on Business and Enterprise plans.',
    source_urls: JSON.stringify([
      { title: 'Asana SSO', url: 'https://asana.com/guide/help/premium/sso' }
    ]),
    confidence: 85,
  },
  // === NOTION ===
  {
    app_key: 'notion',
    app_name: 'Notion',
    vendor: 'Notion Labs',
    description: 'All-in-one workspace for notes, docs, databases, and project management.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM provisioning require Enterprise plan.',
    source_urls: JSON.stringify([
      { title: 'Notion SSO', url: 'https://www.notion.so/help/saml-sso-for-enterprise' }
    ]),
    confidence: 88,
  },
  // === FIGMA ===
  {
    app_key: 'figma',
    app_name: 'Figma',
    vendor: 'Figma (Adobe)',
    description: 'Collaborative interface design and prototyping tool.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM available on Organization and Enterprise plans. Google Workspace SSO available on all paid plans.',
    source_urls: JSON.stringify([
      { title: 'Figma SSO docs', url: 'https://help.figma.com/hc/en-us/articles/360039456654-Set-up-SSO-for-your-Organization' }
    ]),
    confidence: 90,
  },
  // === MIRO ===
  {
    app_key: 'miro',
    app_name: 'Miro',
    vendor: 'Miro',
    description: 'Online collaborative whiteboarding and visual collaboration platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Business and Enterprise plans.',
    source_urls: JSON.stringify([
      { title: 'Miro SSO', url: 'https://help.miro.com/hc/en-us/articles/360017571534-SAML-SSO' }
    ]),
    confidence: 85,
  },
  // === LUCIDCHART ===
  {
    app_key: 'lucidchart',
    app_name: 'Lucidchart',
    vendor: 'Lucid Software',
    description: 'Diagramming and visual collaboration tool.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Enterprise plan. Google Workspace SSO on Team plan.',
    source_urls: JSON.stringify([
      { title: 'Lucidchart SSO', url: 'https://help.lucid.co/hc/en-us/articles/360001641163-Single-Sign-On-SSO' }
    ]),
    confidence: 83,
  },
  // === CONCUR ===
  {
    app_key: 'sap-concur',
    app_name: 'SAP Concur',
    vendor: 'SAP',
    description: 'Travel, expense, and invoice management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO via SAP Identity Authentication Service (IAS). SCIM via SAP Identity Provisioning Service (IPS). Standard feature.',
    source_urls: JSON.stringify([
      { title: 'Concur SSO docs', url: 'https://www.concurtraining.com/customers/tech_pubs/Docs/ConcurServices/Admin/SSO/Shared_SSO_Admin_Guide.pdf' }
    ]),
    confidence: 83,
  },
  // === BAMBOOHR ===
  {
    app_key: 'bamboohr',
    app_name: 'BambooHR',
    vendor: 'BambooHR',
    description: 'Human resources management system for small and medium businesses.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'addon',
    implementation_notes: 'SAML 2.0 SSO as an add-on module. SCIM for automated provisioning. Supports major IdPs via generic SAML.',
    source_urls: JSON.stringify([
      { title: 'BambooHR SSO', url: 'https://help.bamboohr.com/hc/en-us/articles/1260802013850-SSO-Authentication-with-an-Identity-Provider' }
    ]),
    confidence: 80,
  },
  // === RIPPLING ===
  {
    app_key: 'rippling',
    app_name: 'Rippling',
    vendor: 'Rippling',
    description: 'HR, payroll, IT, and finance management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Rippling acts as both IdP (for app management) and SP. SSO and SCIM built-in. Can push/pull users to 500+ apps.',
    source_urls: JSON.stringify([
      { title: 'Rippling SSO docs', url: 'https://help.rippling.com/s/article/How-does-SSO-work-in-Rippling' }
    ]),
    confidence: 85,
  },
  // === WORKIVA ===
  {
    app_key: 'workiva',
    app_name: 'Workiva Wdesk',
    vendor: 'Workiva',
    description: 'Cloud platform for financial reporting, compliance, and ESG management.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO standard feature. SCIM provisioning supported. Multiple IdP configurations allowed.',
    source_urls: JSON.stringify([
      { title: 'Workiva SSO', url: 'https://support.workiva.com/hc/en-us/articles/360025170532' }
    ]),
    confidence: 80,
  },
  // === NETSUITE ===
  {
    app_key: 'netsuite',
    app_name: 'Oracle NetSuite',
    vendor: 'Oracle',
    description: 'Cloud-based ERP, CRM, and e-commerce platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available. OAuth 2.0 for API access. Token-based authentication also supported.',
    source_urls: JSON.stringify([
      { title: 'NetSuite SSO', url: 'https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4776743816.html' }
    ]),
    confidence: 82,
  },
  // === MARKETO ===
  {
    app_key: 'marketo',
    app_name: 'Adobe Marketo Engage',
    vendor: 'Adobe',
    description: 'Marketing automation and lead management platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available. OAuth 2.0 for Marketo REST API. Part of Adobe Experience Cloud with IMS authentication.',
    source_urls: JSON.stringify([
      { title: 'Marketo SSO', url: 'https://experienceleague.adobe.com/docs/marketo/using/product-docs/administration/additional-integrations/add-single-sign-on-to-a-portal.html' }
    ]),
    confidence: 80,
  },
  // === PAGERDUTY ===
  {
    app_key: 'pagerduty',
    app_name: 'PagerDuty',
    vendor: 'PagerDuty',
    description: 'Digital operations management and incident response platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO and SCIM on Business and Digital Operations plans. OAuth 2.0 for integrations.',
    source_urls: JSON.stringify([
      { title: 'PagerDuty SSO docs', url: 'https://support.pagerduty.com/docs/saml-sso' }
    ]),
    confidence: 88,
  },
  // === OPSGENIE ===
  {
    app_key: 'opsgenie',
    app_name: 'Opsgenie (Atlassian)',
    vendor: 'Atlassian',
    description: 'Incident management and on-call scheduling platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'Uses Atlassian Guard (formerly Access) for SSO. Part of Atlassian platform.',
    source_urls: JSON.stringify([
      { title: 'Opsgenie SSO', url: 'https://support.atlassian.com/opsgenie/docs/single-sign-on-sso/' }
    ]),
    confidence: 83,
  },
  // === NEW RELIC ===
  {
    app_key: 'new-relic',
    app_name: 'New Relic',
    vendor: 'New Relic',
    description: 'Observability platform for monitoring applications and infrastructure.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO and SCIM on Pro and Enterprise plans. Automated user provisioning supported.',
    source_urls: JSON.stringify([
      { title: 'New Relic SSO', url: 'https://docs.newrelic.com/docs/accounts/accounts-billing/new-relic-one-user-management/introduction-saml-scim/' }
    ]),
    confidence: 88,
  },
  // === DYNATRACE ===
  {
    app_key: 'dynatrace',
    app_name: 'Dynatrace',
    vendor: 'Dynatrace',
    description: 'AI-powered observability and application performance management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO supported. SCIM provisioning available. OAuth 2.0 for Dynatrace REST API access.',
    source_urls: JSON.stringify([
      { title: 'Dynatrace SSO docs', url: 'https://www.dynatrace.com/support/help/administration/saml' }
    ]),
    confidence: 85,
  },
  // === SUMO LOGIC ===
  {
    app_key: 'sumo-logic',
    app_name: 'Sumo Logic',
    vendor: 'Sumo Logic',
    description: 'Cloud-native log management and analytics platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Enterprise plans. Role mapping via SAML attributes.',
    source_urls: JSON.stringify([
      { title: 'Sumo Logic SSO', url: 'https://help.sumologic.com/docs/manage/security/saml/set-up-saml/' }
    ]),
    confidence: 83,
  },
  // === TERRAFORM CLOUD ===
  {
    app_key: 'terraform-cloud',
    app_name: 'HCP Terraform (Terraform Cloud)',
    vendor: 'HashiCorp',
    description: 'Infrastructure as code management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO on Business and Plus plans. OIDC for workload identity (linking Terraform runs to cloud providers). No SCIM provisioning.',
    source_urls: JSON.stringify([
      { title: 'Terraform Cloud SSO', url: 'https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/single-sign-on' }
    ]),
    confidence: 88,
  },
  // === CLOUDFLARE ===
  {
    app_key: 'cloudflare-access',
    app_name: 'Cloudflare Access (Zero Trust)',
    vendor: 'Cloudflare',
    description: 'Zero Trust network access solution protecting internal applications.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Cloudflare Access supports SAML 2.0, OIDC, and many social/enterprise IdPs. Acts as a reverse proxy with SSO enforcement.',
    source_urls: JSON.stringify([
      { title: 'Cloudflare Access docs', url: 'https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/' }
    ]),
    confidence: 95,
  },
  // === CROWDSTRIKE ===
  {
    app_key: 'crowdstrike',
    app_name: 'CrowdStrike Falcon',
    vendor: 'CrowdStrike',
    description: 'Cloud-native endpoint protection and cybersecurity platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO and SCIM supported. Multiple IdP configurations allowed per customer.',
    source_urls: JSON.stringify([
      { title: 'CrowdStrike SSO docs', url: 'https://falcon.crowdstrike.com/documentation/20/use-sso-to-authenticate-users' }
    ]),
    confidence: 85,
  },
  // === SENTINELONE ===
  {
    app_key: 'sentinelone',
    app_name: 'SentinelOne',
    vendor: 'SentinelOne',
    description: 'AI-powered endpoint security and extended detection and response (XDR) platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available. OIDC/OAuth 2.0 for API integrations.',
    source_urls: JSON.stringify([
      { title: 'SentinelOne SSO', url: 'https://support.sentinelone.com/hc/en-us/articles/360004326614-Configuring-Single-Sign-On-SSO-' }
    ]),
    confidence: 80,
  },
  // === TENABLE ===
  {
    app_key: 'tenable',
    app_name: 'Tenable.io / Tenable.sc',
    vendor: 'Tenable',
    description: 'Vulnerability management and cyber exposure platform.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO for Tenable.io. LDAP for Tenable.sc (on-premise). Active Directory integration supported.',
    source_urls: JSON.stringify([
      { title: 'Tenable SSO', url: 'https://docs.tenable.com/tenableio/Content/Settings/SAML.htm' }
    ]),
    confidence: 80,
  },
  // === RAPID7 ===
  {
    app_key: 'rapid7-insight',
    app_name: 'Rapid7 Insight Platform',
    vendor: 'Rapid7',
    description: 'Security analytics and vulnerability management platform (InsightVM, InsightIDR).',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO for Insight Platform. LDAP for on-premise components.',
    source_urls: JSON.stringify([
      { title: 'Rapid7 SSO', url: 'https://docs.rapid7.com/insight/configure-single-sign-on/' }
    ]),
    confidence: 78,
  },
  // === GITHUB ENTERPRISE ===
  {
    app_key: 'github-enterprise-server',
    app_name: 'GitHub Enterprise Server',
    vendor: 'Microsoft',
    description: 'Self-hosted GitHub deployment for enterprise environments.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0, LDAP, and CAS supported for authentication. SCIM 2.0 for user provisioning on Enterprise Cloud. LDAP group sync available.',
    source_urls: JSON.stringify([
      { title: 'GHES auth docs', url: 'https://docs.github.com/en/enterprise-server@latest/admin/identity-and-access-management/understanding-iam-for-enterprises' }
    ]),
    confidence: 95,
  },
  // === JENKINS ===
  {
    app_key: 'jenkins',
    app_name: 'Jenkins',
    vendor: 'Jenkins (Open Source)',
    description: 'Open-source automation server for CI/CD pipelines.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 1,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Auth via plugins: SAML Plugin, OpenID Connect Plugin, LDAP Plugin. All free and open source. GitHub OAuth plugin also popular.',
    source_urls: JSON.stringify([
      { title: 'Jenkins SAML plugin', url: 'https://plugins.jenkins.io/saml/' },
      { title: 'Jenkins OIDC plugin', url: 'https://plugins.jenkins.io/oic-auth/' }
    ]),
    confidence: 90,
  },
  // === SONARQUBE ===
  {
    app_key: 'sonarqube',
    app_name: 'SonarQube',
    vendor: 'Sonar',
    description: 'Code quality and security analysis platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 1, auth0: 1, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 available in Developer Edition+. LDAP in Community Edition+. GitHub, GitLab, Bitbucket OAuth supported.',
    source_urls: JSON.stringify([
      { title: 'SonarQube authentication', url: 'https://docs.sonarqube.org/latest/instance-administration/authentication/overview/' }
    ]),
    confidence: 85,
  },
  // === ARTIFACTORY ===
  {
    app_key: 'jfrog-artifactory',
    app_name: 'JFrog Artifactory',
    vendor: 'JFrog',
    description: 'Universal artifact repository manager.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 1, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and OIDC supported. LDAP for directory integration. Kerberos for Windows environments. Available in Pro and Enterprise editions.',
    source_urls: JSON.stringify([
      { title: 'Artifactory SSO', url: 'https://www.jfrog.com/confluence/display/JFROG/SAML+Integration' }
    ]),
    confidence: 85,
  },
  // === KEYCLOAK (as app) ===
  {
    app_key: 'keycloak',
    app_name: 'Keycloak',
    vendor: 'Red Hat (Open Source)',
    description: 'Open-source identity and access management solution.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Keycloak is a full-featured open-source IdP. Supports all major protocols. Can federate with other IdPs including social providers. SCIM via third-party extensions.',
    source_urls: JSON.stringify([
      { title: 'Keycloak documentation', url: 'https://www.keycloak.org/documentation' }
    ]),
    confidence: 99,
  },
  // === ONELOGIN ===
  {
    app_key: 'onelogin',
    app_name: 'OneLogin',
    vendor: 'OneLogin',
    description: 'Identity and access management platform with SSO and MFA capabilities.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'OneLogin is primarily an IdP. Supports SAML, OIDC, SCIM, LDAP. Can integrate with upstream IdPs.',
    source_urls: JSON.stringify([
      { title: 'OneLogin docs', url: 'https://developers.onelogin.com/saml' }
    ]),
    confidence: 97,
  },
  // === FORGEROCK ===
  {
    app_key: 'forgerock',
    app_name: 'ForgeRock Identity Platform',
    vendor: 'Ping Identity (ForgeRock)',
    description: 'Enterprise identity platform (now part of Ping Identity).',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'Full-featured enterprise identity platform. Acquired by Ping Identity in 2023. Supports all major identity protocols.',
    source_urls: JSON.stringify([
      { title: 'ForgeRock documentation', url: 'https://backstage.forgerock.com/docs/' }
    ]),
    confidence: 97,
  },
  // === MICROSOFT ENTRA ID ===
  {
    app_key: 'microsoft-entra-id',
    app_name: 'Microsoft Entra ID',
    vendor: 'Microsoft',
    description: 'Cloud-based identity and access management service (formerly Azure Active Directory).',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Entra ID is Microsoft primary cloud IdP. P1/P2 licenses unlock advanced features like Conditional Access, PIM, and Identity Protection. Free tier available.',
    source_urls: JSON.stringify([
      { title: 'Entra ID documentation', url: 'https://learn.microsoft.com/en-us/entra/identity/' }
    ]),
    confidence: 99,
  },
  // === AZURE AD B2C ===
  {
    app_key: 'azure-ad-b2c',
    app_name: 'Microsoft Entra External ID (B2C)',
    vendor: 'Microsoft',
    description: 'Customer identity and access management service for external-facing applications.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 0, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'OIDC and OAuth 2.0 native. SAML for SP apps. Supports social IdP federation. Custom user journeys via custom policies (XML).',
    source_urls: JSON.stringify([
      { title: 'Entra External ID docs', url: 'https://learn.microsoft.com/en-us/azure/active-directory-b2c/' }
    ]),
    confidence: 97,
  },
  // === JIRA SERVICE MANAGEMENT ===
  {
    app_key: 'jira-service-management',
    app_name: 'Jira Service Management',
    vendor: 'Atlassian',
    description: 'IT service management (ITSM) solution built on Jira.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'Covered under Atlassian Guard subscription. Same SSO setup as Jira at the organization level.',
    source_urls: JSON.stringify([
      { title: 'Atlassian Guard SSO', url: 'https://support.atlassian.com/security-and-access-policies/docs/configure-saml-single-sign-on-with-an-identity-provider/' }
    ]),
    confidence: 93,
  },
  // === TRELLO ===
  {
    app_key: 'trello',
    app_name: 'Trello',
    vendor: 'Atlassian',
    description: 'Visual project management tool using Kanban boards.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SSO via Atlassian Guard. Google Workspace SSO available on Standard plan.',
    source_urls: JSON.stringify([
      { title: 'Trello SSO', url: 'https://support.atlassian.com/trello/docs/enabling-single-sign-on/' }
    ]),
    confidence: 85,
  },
  // === MICROSFT SHAREPOINT ===
  {
    app_key: 'sharepoint',
    app_name: 'Microsoft SharePoint',
    vendor: 'Microsoft',
    description: 'Web-based collaborative platform for document management and intranet.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 1, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication via Microsoft Entra ID. WS-Federation for ADFS integration. SharePoint Online part of Microsoft 365.',
    source_urls: JSON.stringify([
      { title: 'SharePoint authentication', url: 'https://learn.microsoft.com/en-us/sharepoint/authentication' }
    ]),
    confidence: 90,
  },
  // === CROWDIN ===
  {
    app_key: 'crowdin',
    app_name: 'Crowdin',
    vendor: 'Crowdin',
    description: 'Localization management platform for software, docs, and digital content.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO on Enterprise plan. OAuth 2.0 for integrations.',
    source_urls: JSON.stringify([
      { title: 'Crowdin SSO', url: 'https://support.crowdin.com/saml-sso/' }
    ]),
    confidence: 78,
  },
  // === STATUSPAGE ===
  {
    app_key: 'statuspage',
    app_name: 'Atlassian Statuspage',
    vendor: 'Atlassian',
    description: 'Status page and incident communication platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO on Business plan and above.',
    source_urls: JSON.stringify([
      { title: 'Statuspage SSO', url: 'https://support.atlassian.com/statuspage/docs/use-an-identity-provider-for-sso/' }
    ]),
    confidence: 78,
  },
  // === LOGRHYTHM ===
  {
    app_key: 'logrhythm',
    app_name: 'LogRhythm SIEM',
    vendor: 'LogRhythm',
    description: 'Security information and event management platform.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 0, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO and Active Directory/LDAP integration. Windows Authentication available.',
    source_urls: JSON.stringify([
      { title: 'LogRhythm auth docs', url: 'https://docs.logrhythm.com/docs/deploying/authentication-integration' }
    ]),
    confidence: 75,
  },
  // === ATLASSIAN OPSGENIE ===
  {
    app_key: 'opsgenie-atlassian',
    app_name: 'Opsgenie',
    vendor: 'Atlassian',
    description: 'On-call and alert management tool for IT operations.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO on Enterprise plan. Atlassian Guard for organization-level SSO.',
    source_urls: JSON.stringify([
      { title: 'Opsgenie SSO', url: 'https://support.atlassian.com/opsgenie/docs/single-sign-on-sso/' }
    ]),
    confidence: 83,
  },
  // === NAVAN (TRIPACTIONS) ===
  {
    app_key: 'navan',
    app_name: 'Navan (TripActions)',
    vendor: 'Navan',
    description: 'Corporate travel and expense management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO available on all plans. SCIM for user provisioning.',
    source_urls: JSON.stringify([
      { title: 'Navan SSO', url: 'https://help.navan.com/en_US/admin-single-sign-on-sso-' }
    ]),
    confidence: 80,
  },
  // === ORACLE JD EDWARDS ===
  {
    app_key: 'jd-edwards',
    app_name: 'Oracle JD Edwards EnterpriseOne',
    vendor: 'Oracle',
    description: 'ERP software suite for manufacturing, distribution, and financial management.',
    oidc: 0, oauth2: 0, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 0, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO via Oracle Access Manager or third-party federation. LDAP for directory integration. Kerberos for network-level SSO.',
    source_urls: JSON.stringify([
      { title: 'JDE SSO', url: 'https://docs.oracle.com/en/applications/jd-edwards/' }
    ]),
    confidence: 72,
  },
  // === MICROSOFT DYNAMICS 365 ===
  {
    app_key: 'dynamics-365',
    app_name: 'Microsoft Dynamics 365',
    vendor: 'Microsoft',
    description: 'Suite of enterprise resource planning (ERP) and CRM applications.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 1, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication via Microsoft Entra ID. Federation with external IdPs via Entra ID. OAuth 2.0 for API access.',
    source_urls: JSON.stringify([
      { title: 'Dynamics 365 authentication', url: 'https://learn.microsoft.com/en-us/power-platform/admin/configure-claims-based-authentication' }
    ]),
    confidence: 90,
  },
  // === CITRIX ===
  {
    app_key: 'citrix',
    app_name: 'Citrix Workspace / DaaS',
    vendor: 'Citrix (Cloud Software Group)',
    description: 'Desktop virtualization and application delivery platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 1,
    license_requirement: 'standard',
    implementation_notes: 'Extensive IdP support. SAML 2.0 and OIDC for workspace auth. LDAP/AD for back-end resource access. Kerberos for SSO to published apps.',
    source_urls: JSON.stringify([
      { title: 'Citrix Workspace authentication', url: 'https://docs.citrix.com/en-us/citrix-workspace/workspace-configure.html#authentication-and-identity' }
    ]),
    confidence: 90,
  },
  // === VMWARE HORIZON ===
  {
    app_key: 'vmware-horizon',
    app_name: 'VMware Horizon (Omnissa)',
    vendor: 'Omnissa (formerly VMware)',
    description: 'Virtual desktop infrastructure (VDI) and application virtualization platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 for workspace portal access. LDAP/AD for user directory. Kerberos for SSO to virtual desktops. True SSO available for seamless desktop access.',
    source_urls: JSON.stringify([
      { title: 'Horizon authentication', url: 'https://docs.vmware.com/en/VMware-Horizon/services/horizon-8-installation/GUID-9D70FA0A-51AE-45FB-B7C4-3C68FB2E8B55.html' }
    ]),
    confidence: 85,
  },
  // === SERVICENOW ===
  {
    app_key: 'snow-itsm',
    app_name: 'ServiceNow ITSM',
    vendor: 'ServiceNow',
    description: 'IT service management module within the ServiceNow platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 1, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 1, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Part of ServiceNow platform - shares platform SSO configuration. All protocols supported at platform level.',
    source_urls: JSON.stringify([
      { title: 'ServiceNow ITSM', url: 'https://docs.servicenow.com/bundle/tokyo-it-service-management/page/product/incident-management/concept/c_IncidentManagement.html' }
    ]),
    confidence: 95,
  },
  // === CLICKUP ===
  {
    app_key: 'clickup',
    app_name: 'ClickUp',
    vendor: 'ClickUp',
    description: 'Productivity and project management platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Enterprise plan. Google and Microsoft SSO on lower plans.',
    source_urls: JSON.stringify([
      { title: 'ClickUp SSO docs', url: 'https://help.clickup.com/hc/en-us/articles/6305684874135-SSO-SAML-Setup' }
    ]),
    confidence: 83,
  },
  // === LINEAR ===
  {
    app_key: 'linear',
    app_name: 'Linear',
    vendor: 'Linear',
    description: 'Issue tracking and project management tool for software teams.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO and SCIM on Business and Enterprise plans.',
    source_urls: JSON.stringify([
      { title: 'Linear SSO', url: 'https://linear.app/docs/sso' }
    ]),
    confidence: 85,
  },
  // === RETOOL ===
  {
    app_key: 'retool',
    app_name: 'Retool',
    vendor: 'Retool',
    description: 'Low-code platform for building internal tools and admin panels.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Enterprise plan. Google SSO on lower plans.',
    source_urls: JSON.stringify([
      { title: 'Retool SSO', url: 'https://docs.retool.com/docs/saml-sso' }
    ]),
    confidence: 83,
  },
  // === AMPLITUDE ===
  {
    app_key: 'amplitude',
    app_name: 'Amplitude Analytics',
    vendor: 'Amplitude',
    description: 'Product analytics platform for understanding user behavior.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO and SCIM on Enterprise plan.',
    source_urls: JSON.stringify([
      { title: 'Amplitude SSO', url: 'https://help.amplitude.com/hc/en-us/articles/360002215351-Single-Sign-On-SSO' }
    ]),
    confidence: 80,
  },
  // === MIXPANEL ===
  {
    app_key: 'mixpanel',
    app_name: 'Mixpanel',
    vendor: 'Mixpanel',
    description: 'Product analytics and user behavior tracking platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO on Enterprise plan.',
    source_urls: JSON.stringify([
      { title: 'Mixpanel SSO', url: 'https://help.mixpanel.com/hc/en-us/articles/360036493511-SSO-SAML-Configuration' }
    ]),
    confidence: 78,
  },
  // === LOOKER ===
  {
    app_key: 'looker',
    app_name: 'Looker (Google)',
    vendor: 'Google',
    description: 'Business intelligence and data analytics platform.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 0, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 1, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and OIDC SSO supported. LDAP for Looker (original). Part of Google Cloud.',
    source_urls: JSON.stringify([
      { title: 'Looker SSO docs', url: 'https://cloud.google.com/looker/docs/admin-panel-users-sso-configuration' }
    ]),
    confidence: 87,
  },
  // === DOMO ===
  {
    app_key: 'domo',
    app_name: 'Domo',
    vendor: 'Domo',
    description: 'Cloud-based business intelligence and data visualization platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 1, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 SSO and SCIM provisioning supported.',
    source_urls: JSON.stringify([
      { title: 'Domo SSO docs', url: 'https://domo-support.domo.com/s/article/360043438453' }
    ]),
    confidence: 80,
  },
  // === SISENSE ===
  {
    app_key: 'sisense',
    app_name: 'Sisense',
    vendor: 'Sisense',
    description: 'Business intelligence platform with embedded analytics capabilities.',
    oidc: 1, oauth2: 1, saml2: 1, ldap: 1, kerberos: 0, scim: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'SAML 2.0 and OIDC SSO supported. LDAP for Active Directory integration.',
    source_urls: JSON.stringify([
      { title: 'Sisense SSO', url: 'https://docs.sisense.com/main/SisenseLinux/configuring-single-sign-on-sso.htm' }
    ]),
    confidence: 78,
  },
  // === WORKATO ===
  {
    app_key: 'workato',
    app_name: 'Workato',
    vendor: 'Workato',
    description: 'Enterprise automation and integration platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Business and Enterprise plans.',
    source_urls: JSON.stringify([
      { title: 'Workato SSO', url: 'https://docs.workato.com/security/sso.html' }
    ]),
    confidence: 80,
  },
  // === ZAPIER ===
  {
    app_key: 'zapier',
    app_name: 'Zapier',
    vendor: 'Zapier',
    description: 'No-code automation platform for connecting apps and services.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO on Enterprise plan only. Google SSO on all paid plans.',
    source_urls: JSON.stringify([
      { title: 'Zapier SSO', url: 'https://help.zapier.com/hc/en-us/articles/8496264856845-Enable-single-sign-on-SSO-for-teams' }
    ]),
    confidence: 78,
  },
  // === LARK / FEISHU ===
  {
    app_key: 'lark',
    app_name: 'Lark / Feishu',
    vendor: 'ByteDance',
    description: 'Integrated collaboration suite with messaging, docs, and video conferencing.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 1, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO and SCIM on Enterprise plan. LDAP for directory sync.',
    source_urls: JSON.stringify([
      { title: 'Lark SSO docs', url: 'https://www.larksuite.com/en_us/product/enterprise' }
    ]),
    confidence: 75,
  },
  // === WEBEX CONTACT CENTER ===
  {
    app_key: 'webex-contact-center',
    app_name: 'Webex Contact Center',
    vendor: 'Cisco',
    description: 'Cloud contact center platform.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 1, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'standard',
    implementation_notes: 'Authentication via Cisco Control Hub. SAML SSO and SCIM for agent provisioning.',
    source_urls: JSON.stringify([
      { title: 'Webex CC authentication', url: 'https://help.webex.com/en-us/article/n9i8a5/Webex-Contact-Center-Administrator-Guide' }
    ]),
    confidence: 78,
  },
  // === SAMSARA ===
  {
    app_key: 'samsara',
    app_name: 'Samsara',
    vendor: 'Samsara',
    description: 'IoT platform for fleet management and industrial operations.',
    oidc: 1, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 0, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML 2.0 SSO supported on Enterprise plan.',
    source_urls: JSON.stringify([
      { title: 'Samsara SSO', url: 'https://kb.samsara.com/hc/en-us/articles/360041999311-Single-Sign-On-SSO-Setup' }
    ]),
    confidence: 75,
  },
  // === INTERCOM ===
  {
    app_key: 'intercom',
    app_name: 'Intercom',
    vendor: 'Intercom',
    description: 'Customer messaging and support platform.',
    oidc: 0, oauth2: 1, saml2: 1, scim: 0, ldap: 0, kerberos: 0, ws_federation: 0, cas: 0,
    entra_id: 1, okta: 1, ping: 0, keycloak: 0, auth0: 0, onelogin: 1, forgerock: 0,
    license_requirement: 'enterprise',
    implementation_notes: 'SAML SSO on Expert plan and above. Google SSO on all plans.',
    source_urls: JSON.stringify([
      { title: 'Intercom SSO', url: 'https://www.intercom.com/help/en/articles/2443961-single-sign-on-google-sso-saml' }
    ]),
    confidence: 80,
  },
]
