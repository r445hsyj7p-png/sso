-- Seed manually curated apps that should always be present
INSERT OR IGNORE INTO sso_apps
  (app_key, app_name, vendor, description, oidc, oauth2, saml2, scim, ldap, kerberos, ws_federation, cas,
   entra_id, okta, ping, keycloak, auth0, onelogin, forgerock,
   license_requirement, implementation_notes, source_urls, confidence, import_source)
VALUES
  ('nextcloud', 'Nextcloud', 'Nextcloud GmbH',
   'Open-source self-hosted file sync, share and collaboration platform.',
   1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
   'standard',
   'SAML 2.0 via the SSO & SAML Authentication app (free, available in Nextcloud App Store). OIDC via the OpenID Connect Login app. LDAP/AD integration built-in via User Auth LDAP app. No SCIM support natively; user provisioning via LDAP or JIT from SAML/OIDC.',
   '[{"title":"Nextcloud SAML SSO App","url":"https://apps.nextcloud.com/apps/user_saml"},{"title":"Nextcloud LDAP Integration","url":"https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_auth_ldap.html"}]',
   90, 'manual'),

  ('cato-networks', 'Cato Networks', 'Cato Networks',
   'Cloud-native SASE platform combining SD-WAN, security, and zero-trust network access.',
   0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0,
   'standard',
   'SAML 2.0 SSO for the Cato Management Application and Client authentication. SCIM provisioning supported for automated user and group sync. Configuration done via Cato Management Application under Access > SSO.',
   '[{"title":"Cato Networks SSO Configuration","url":"https://support.catonetworks.com/hc/en-us/articles/360019531238"},{"title":"Cato SCIM Provisioning","url":"https://support.catonetworks.com/hc/en-us/articles/4413280507409"}]',
   88, 'manual'),

  ('rancher', 'Rancher', 'SUSE',
   'Open-source Kubernetes management platform for deploying and operating clusters.',
   1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
   'standard',
   'Supports multiple auth backends natively: SAML (Okta, PingIdentity, ADFS, Keycloak), OIDC (Keycloak, generic), LDAP/AD, and GitHub. Configuration under Global Settings > Authentication. No SCIM support; users are provisioned on first login (JIT). Group membership from IdP is used for RBAC.',
   '[{"title":"Rancher Authentication Configuration","url":"https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/authentication-permissions-and-global-configuration/authentication-config"}]',
   90, 'manual'),

  ('inuvika', 'Inuvika OVD Enterprise', 'Inuvika',
   'Virtual desktop and application delivery platform for remote and hybrid work environments.',
   1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0,
   'standard',
   'SAML 2.0 and OIDC supported for web portal and native client authentication. LDAP/Active Directory integration for user directory. Kerberos supported for transparent SSO within Windows environments. No SCIM; user provisioning via LDAP sync.',
   '[{"title":"Inuvika OVD SSO Documentation","url":"https://www.inuvika.com/resources/documentation/"}]',
   78, 'manual'),

  ('checkmk', 'Checkmk', 'tribe29 GmbH',
   'IT infrastructure and application monitoring platform.',
   1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
   'standard',
   'SAML 2.0 available in Checkmk 2.0+ (all editions including Free). OIDC supported from Checkmk 2.3+. LDAP/AD user sync built-in for all editions. No SCIM. SSO configured under Setup > Users > SAML Authentication or LDAP connections.',
   '[{"title":"Checkmk SAML SSO","url":"https://docs.checkmk.com/latest/en/saml.html"},{"title":"Checkmk LDAP Integration","url":"https://docs.checkmk.com/latest/en/ldap.html"}]',
   88, 'manual');
