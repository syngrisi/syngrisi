---
"@syngrisi/syngrisi": minor
---

feat(sso): add SAML IdP metadata loader and comprehensive documentation

**SSO Enhancements:**
- Add automatic IdP configuration from metadata URL (`SSO_IDP_METADATA_URL`)
- Add `/v1/auth/sso/metadata` endpoint for SP metadata export
- Add `SSO_IDP_ISSUER` for IdP issuer validation
- Add `SSO_AUTO_CREATE_USERS` and `SSO_ALLOW_ACCOUNT_LINKING` options
- Add OAuth2 specific variables: `SSO_AUTHORIZATION_URL`, `SSO_TOKEN_URL`, `SSO_USERINFO_URL`, `SSO_CALLBACK_URL`

**Documentation:**
- Add comprehensive SSO docs: architecture, integration guide, troubleshooting
- Add Okta SAML Quick Start guide
- Add security best practices and migration guides

**Testing:**
- Add E2E tests for SSO metadata functionality
