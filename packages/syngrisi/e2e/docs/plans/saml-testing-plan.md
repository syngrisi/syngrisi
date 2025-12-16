# SAML 2.0 E2E Testing Plan

## Current State

### Server Side (READY)
- `passport-saml` strategy configured in `auth-sso.service.ts:240-262`
- SAML callback route at `/v1/auth/sso/saml/callback` in `auth.route.ts:194-201`
- `processSSOUser()` handles SAML profiles (extracts email from `nameID`)
- Environment variables: `SSO_PROTOCOL=saml`, `SSO_ENTRY_POINT`, `SSO_ISSUER`, `SSO_CERT`

### Logto SAML IdP (READY)
- SAML application created: `yba56ngj6ag9di20uab4f`
- ACS URL configured: `http://localhost:3002/v1/auth/sso/saml/callback`
- Certificate available via `/api/saml-applications/{id}/secrets`
- nameIdFormat: `emailAddress`

### Correct Logto SAML Endpoints
```
SSO URL:      http://localhost:3001/saml-applications/{id}/authn
              http://localhost:3001/saml/{id}/authn
Metadata:     http://localhost:3001/saml-applications/{id}/metadata
              http://localhost:3001/saml/{id}/.well-known/saml-metadata
```

## Tasks

### 1. Update Provisioning Script
**File**: `e2e/support/sso/provision-logto-api.sh`

- [ ] Fix metadata URL format (remove `/api` prefix)
- [ ] Fix SSO URL format (remove `/api` prefix)
- [ ] Extract and save certificate to config
- [ ] Update `provisioned-config.json` with correct URLs

```bash
# Correct URLs:
SAML_METADATA_URL="${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}/metadata"
SAML_SSO_URL="${LOGTO_ENDPOINT}/saml-applications/${SAML_APP_ID}/authn"
```

### 2. Update SSO Server Fixture
**File**: `e2e/support/fixtures/sso-server.fixture.ts`

- [ ] Add `getSAMLCertificate()` method to fetch cert from provisioned config
- [ ] Update `getSAMLSSOEnvVars()` to include `SSO_CERT` from config

### 3. Update SAML Steps
**File**: `e2e/steps/domain/sso.steps.ts`

- [ ] Update `I configure SAML SSO with auto-provisioned settings` to set `SSO_CERT`
- [ ] Verify SAML SSO redirects to Logto login page (same UI as OAuth)

### 4. Enable SAML Tests
**File**: `e2e/features/AUTH/sso_saml.feature`

- [ ] Remove `@skip` tags from scenarios
- [ ] Update step to use `When I login to Logto with username...` (same login page)

### 5. Test SAML Flow

Expected flow:
1. User clicks SSO button on Syngrisi login page
2. Syngrisi redirects to Logto SAML SSO URL with `SAMLRequest`
3. Logto shows login page (same UI as OAuth)
4. User enters credentials
5. Logto posts `SAMLResponse` to Syngrisi ACS URL
6. `passport-saml` validates response and extracts user info
7. `processSSOUser()` creates/links user
8. User redirected to app dashboard

## Implementation Order

1. **Fix provisioning script** - correct URL formats and save certificate
2. **Re-run provisioning** - `./support/sso/provision-logto-api.sh`
3. **Update fixture** - add certificate handling
4. **Update steps** - ensure SSO_CERT is set
5. **Enable tests** - remove @skip tags
6. **Run tests** - `npx playwright test --grep "@saml"`

## Configuration Reference

### Environment Variables for SAML
```bash
SSO_ENABLED=true
SSO_PROTOCOL=saml
SSO_ENTRY_POINT=http://localhost:3001/saml-applications/{id}/authn
SSO_ISSUER=syngrisi-e2e-sp  # SP entity ID
SSO_CERT=<base64 certificate from Logto>
```

### passport-saml Configuration (server)
```typescript
new SamlStrategy({
    entryPoint: process.env.SSO_ENTRY_POINT,
    issuer: process.env.SSO_ISSUER,        // SP entity ID
    cert: process.env.SSO_CERT,            // IdP certificate
    path: '/v1/auth/sso/saml/callback',    // ACS URL path
    passReqToCallback: true
})
```

## Notes

- Logto SAML app uses the same login UI as OAuth2/OIDC
- Certificate is available via Management API, not public metadata
- The `nameIdFormat: emailAddress` ensures email is in SAML response
- Multiple ACS URLs not supported by Logto - use single worker for SAML tests
