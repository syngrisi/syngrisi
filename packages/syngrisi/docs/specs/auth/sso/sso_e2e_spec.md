## SSO (Logto OAuth2 + SAML) — E2E Spec

### 1) System overview
- Identity provider: Logto (OIDC + SAML) running in containers (Postgres + Logto) via Apple Container CLI.
- Manager: `support/sso/logto-manager.ts` starts/stops containers, checks OIDC health, and runs provisioning (`provision-logto-api.sh`).
- Provisioning output: `support/sso/provisioned-config.json` stores OAuth2 and SAML app endpoints, client credentials, IdP certificate, and test user (`testuser` / `Test123!`, email `test@syngrisi.test`).
- Fixtures: `support/fixtures/sso-server.fixture.ts` wires Logto lifecycle into Playwright-BDD (`@sso-logto` auto-starts, `@sso-external` expects running Logto but can auto-start if CLI is present).

### 2) Syngrisi configuration (env)
- Common: `SSO_ENABLED=true`, `SYNGRISI_AUTH=true`, `SYNGRISI_TEST_MODE` toggles DB seeding/shortcuts.
- OAuth2 mode: `SSO_PROTOCOL=oauth2`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_AUTHORIZATION_URL`, `SSO_TOKEN_URL`, `SSO_USERINFO_URL`, `SSO_CALLBACK_URL=/v1/auth/sso/oauth/callback`, helpers `LOGTO_ENDPOINT`, `LOGTO_ADMIN_ENDPOINT`.
- SAML mode: `SSO_PROTOCOL=saml`, `SSO_ENTRY_POINT` (IdP login URL), `SSO_ISSUER` (Syngrisi SP entity ID), optional `SSO_IDP_ISSUER`, required `SSO_CERT` (base64 IdP signing cert).
- Helpers: fixture methods `getSSOEnvVars()` and `getSAMLSSOEnvVars()` apply defaults from `provisioned-config.json` when client secret is `auto-provisioned`.

### 3) Test flows (Gherkin)
- Common (`features/AUTH/sso_common.feature`, tag `@sso-common`, some `@sso-external @slow`):
  - Disabled SSO hides button and redirects `/v1/auth/sso` to `/auth`.
  - Logout clears session (after OAuth login).
  - OAuth account linking (existing user) updates provider to `oauth`.
  - OAuth new user creation sets role `reviewer`.
  - SSO button visibility reflects env.
- OAuth2 Logto (`features/AUTH/sso_logto.feature`, `@sso-external @slow`):
  - Infrastructure availability check.
  - Full OAuth2 login: click SSO, Logto username/password, redirect back, authenticated (`By Runs` title).
  - Local auth fallback still works.
- SAML Logto (`features/AUTH/sso_saml.feature`, `@sso-external @slow @saml`):
  - Full SAML login mirrors OAuth UI; provider set to `saml`.
  - SAML account linking for existing user.
  - SAML new user creation with role `reviewer`.

### 4) Step definitions (`steps/domain/sso.steps.ts`)
- Infra: start/stop Logto, assert availability.
- Config: set OAuth2 creds (auto-provisioned supported), configure SAML (auto or explicit), enforce presence of `SSO_CERT`.
- UI/actions: click SSO button (`a[href*='/v1/auth/sso']`), login to Logto (username/email, two-step aware), generic SAML IdP login, reload session, open app.
- Assertions: redirected back to app, authenticated (title contains `By Runs`), SSO button visibility, redirect to `/auth` with error, Mongo checks for provider and role, session destroyed after logout.

### 5) Running tests
- Full SSO slice: `npm run test:sso` (runs `@saml|@sso-external|@sso-logto`, workers=1).
- Single scenarios: `npx bddgen && yarn playwright test "<feature>" --grep "<name>" --workers=1` (add `--headed` if needed).
- Dev fast path: start Logto once `./support/sso/setup-logto.sh`, then grep `@sso-external` scenarios.

### 6) Troubleshooting quick notes
- If Logto fails to start: ensure Apple container CLI is installed and `container system start` works; check `support/sso/failed-test.md` for common errors.
- SAML runs require `SSO_CERT`; regenerate via `provision-logto-api.sh` if missing or empty.
