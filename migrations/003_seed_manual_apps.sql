-- Seed manually curated apps that should always be present
INSERT OR IGNORE INTO sso_apps
  (app_key, app_name, vendor, description, oidc, oauth2, saml2, scim, ldap, kerberos, ws_federation, cas,
   entra_id, okta, ping, keycloak, auth0, onelogin, forgerock,
   license_requirement, implementation_notes, source_urls, confidence, import_source)
VALUES
  ('nextcloud', 'Nextcloud', 'Nextcloud GmbH',
   'Open-source self-hosted file sync, share and collaboration platform.',
   1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
   'standard',
   'SAML 2.0 via the free "SSO & SAML Authentication" app (Nextcloud App Store). OIDC via the "OpenID Connect Login" app. LDAP/AD built-in via User Auth LDAP app. No SCIM; users provisioned via LDAP or JIT from SAML/OIDC. Note: if server-side encryption is enabled, only LDAP is supported.',
   '[{"title":"Nextcloud SAML SSO App","url":"https://apps.nextcloud.com/apps/user_saml"},{"title":"Nextcloud OIDC Configuration","url":"https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/user_auth_oidc.html"},{"title":"Nextcloud LDAP Integration","url":"https://docs.nextcloud.com/server/stable/admin_manual/configuration_user/user_auth_ldap.html"}]',
   90, 'manual'),

  ('cato-networks', 'Cato Networks', 'Cato Networks',
   'Cloud-native SASE platform combining SD-WAN, security, and zero-trust network access.',
   1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0,
   'standard',
   'OIDC-only SSO — SAML is explicitly not supported. SSO covers both the Cato Management Application and Client authentication. Supported IdPs include Okta, Microsoft Entra ID, and Google. Configuration via Cato Management Application under Access > SSO.',
   '[{"title":"Cato SSO Authentication Overview","url":"https://support.catonetworks.com/hc/en-us/articles/12710415750557-SSO-Authentication-for-Users-with-Cato"},{"title":"Supported Identity Providers for SSO","url":"https://support.catonetworks.com/hc/en-us/articles/32111432705821-Supported-Identity-Providers-for-SSO-Authentication"}]',
   88, 'manual'),

  ('rancher', 'Rancher', 'SUSE',
   'Open-source Kubernetes management platform for deploying and operating clusters.',
   1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
   'standard',
   'Supports multiple auth backends natively in the open-source edition: SAML 2.0 (Okta, PingIdentity, ADFS, Keycloak, Shibboleth), OIDC (generic, Keycloak, Auth0, Dex), and LDAP/Active Directory. No SCIM; users provisioned on first login (JIT). Group membership from IdP drives RBAC. Configure under Global Settings > Authentication.',
   '[{"title":"Rancher OIDC Configuration","url":"https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/authentication-permissions-and-global-configuration/authentication-config/configure-generic-oidc"},{"title":"Rancher Okta SAML","url":"https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/authentication-permissions-and-global-configuration/authentication-config/configure-okta-saml"},{"title":"Rancher Active Directory / LDAP","url":"https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/authentication-permissions-and-global-configuration/authentication-config/configure-active-directory"}]',
   90, 'manual'),

  ('inuvika', 'Inuvika OVD Enterprise', 'Inuvika',
   'Virtual desktop and application delivery platform for remote and hybrid work environments.',
   0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0,
   'enterprise',
   'SAML 2.0 for web portal and native client authentication (confirmed: Okta, Entra ID, Duo, Watchguard). LDAP/Active Directory for user directory sync. Kerberos for transparent SSO within Windows AD environments. No OIDC or SCIM support documented. Commercial product — no free community edition.',
   '[{"title":"Inuvika SAML 2.0 Configuration Guide","url":"https://docs.inuvika.com/3.4/saml_2.0_configuration_guide/"},{"title":"Inuvika Active Directory Kerberos SSO","url":"https://docs.inuvika.com/3.3/active_directory_sso_using_kerberos/"},{"title":"Inuvika LDAP Integration Guide","url":"https://docs.inuvika.com/3.5/ldap_integration_guide/"}]',
   85, 'manual'),

  ('checkmk', 'Checkmk', 'tribe29 GmbH / Checkmk GmbH',
   'IT infrastructure and application monitoring platform.',
   0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0,
   'enterprise',
   'SAML 2.0 natively supported in commercial editions (Pro/Ultimate) from Checkmk 2.2+. Community (free) edition requires manual Apache mod_auth_mellon setup — no longer officially supported by Checkmk. LDAP/AD sync available in all editions. Kerberos possible via Apache mod_auth_kerb (manual setup, not officially supported). No OIDC or SCIM.',
   '[{"title":"Checkmk SAML SSO","url":"https://docs.checkmk.com/latest/en/saml.html"},{"title":"Checkmk LDAP/AD Integration","url":"https://docs.checkmk.com/latest/en/ldap.html"},{"title":"Checkmk Kerberos SSO","url":"https://docs.checkmk.com/latest/en/kerberos.html"}]',
   88, 'manual');
