# SSO Troubleshooting Guide

This guide helps diagnose and resolve common SSO authentication issues in Syngrisi.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [OAuth2/OIDC Errors](#oauth2oidc-errors)
- [SAML Errors](#saml-errors)
- [User and Session Issues](#user-and-session-issues)
- [Configuration Issues](#configuration-issues)
- [Debugging Tools](#debugging-tools)

---

## Quick Diagnostics

### Step 1: Check SSO Status

```bash
# Check if SSO is enabled
curl http://localhost:3000/v1/auth/sso/status
# Expected: {"ssoEnabled":true}

# Check secrets configuration
curl http://localhost:3000/v1/auth/sso/secrets-status
# OAuth2: {"clientSecretConfigured":true,"certConfigured":false}
# SAML:   {"clientSecretConfigured":false,"certConfigured":true}
```

### Step 2: Check Server Logs

Look for SSO-related log entries:
```bash
# Filter logs for SSO messages
grep -i "SSO" logs/syngrisi.log

# Look for specific components
grep "oauth2-provider\|saml-provider\|sso-user-service" logs/syngrisi.log
```

### Step 3: Verify Environment Variables

```bash
# Print SSO configuration (don't expose secrets in production!)
env | grep SSO_
```

---

## OAuth2/OIDC Errors

### Error: `invalid_redirect_uri`

**Symptom:**
```
{"code":"oidc.invalid_redirect_uri","message":"redirect_uri did not match any of the client's registered redirect_uris"}
```

**Cause:** The callback URL sent by Syngrisi doesn't match what's registered in the IdP.

**Solution:**
1. Check `SSO_CALLBACK_URL` environment variable
2. Verify the registered redirect URI in your IdP matches exactly:
   - Protocol (`http` vs `https`)
   - Host (`localhost` vs `127.0.0.1` vs domain)
   - Port number
   - Path (`/v1/auth/sso/oauth/callback`)

**Example Fix:**
```bash
# In IdP, register:
https://syngrisi.example.com/v1/auth/sso/oauth/callback

# In Syngrisi:
export SSO_CALLBACK_URL=/v1/auth/sso/oauth/callback
```

### Error: `invalid_client`

**Symptom:**
```
{"code":"oidc.invalid_client","error_description":"invalid client syngrisi-app"}
```

**Cause:** Client ID doesn't exist or client secret is wrong.

**Solution:**
1. Verify `SSO_CLIENT_ID` matches exactly (case-sensitive)
2. Regenerate client secret in IdP and update `SSO_CLIENT_SECRET`
3. Check if the client is enabled/active in IdP

### Error: `invalid_state`

**Symptom:**
```
Redirected to /auth?error=invalid_state
```

**Cause:** CSRF protection failed. The state parameter in the callback doesn't match what was stored in the session.

**Possible Causes:**
- Session expired during authentication
- Multiple browser tabs initiated SSO
- Session storage issues
- Load balancer without sticky sessions

**Solution:**
1. Clear browser cookies and try again
2. If using multiple instances, ensure session storage is shared:
   ```bash
   export SYNGRISI_SESSION_STORE_KEY=your-fixed-secret-key
   ```
3. Configure load balancer for sticky sessions

### Error: `Failed to fetch user profile`

**Symptom:**
```
Error: Failed to fetch user profile: 401 Unauthorized
```

**Cause:** The access token couldn't be used to fetch user info.

**Solution:**
1. Verify `SSO_USERINFO_URL` is correct
2. Check if the OAuth scope includes `openid`, `profile`, `email`
3. Ensure the token has the right permissions in IdP

### Error: `No userinfo URL configured and no profile in token`

**Symptom:** Authentication fails silently or with generic error.

**Cause:** Neither userinfo endpoint nor embedded profile in ID token available.

**Solution:**
```bash
# Set the userinfo endpoint
export SSO_USERINFO_URL=https://your-idp.com/userinfo
```

---

## SAML Errors

### Error: `Invalid signature`

**Symptom:** SAML assertion signature validation failed.

**Cause:** Certificate mismatch or wrong certificate format.

**Solution:**
1. Re-download the IdP certificate
2. Ensure the certificate format is correct:
   ```bash
   # Can be with or without headers
   export SSO_CERT="MIIDpDCCAoy..."
   # OR
   export SSO_CERT="-----BEGIN CERTIFICATE-----
   MIIDpDCCAoy...
   -----END CERTIFICATE-----"
   ```
3. Check if IdP rotated certificates

### Error: `SAML Response is not valid`

**Symptom:** Generic SAML validation error.

**Common Causes:**
1. Clock skew between Syngrisi and IdP servers
2. Response expired (NotOnOrAfter)
3. Audience mismatch

**Solution:**
1. Sync server clocks with NTP
2. Check `SSO_ISSUER` matches the SP Entity ID configured in IdP
3. Verify ACS URL is correctly configured

### Error: `No email found in SSO profile`

**Symptom:**
```
Error: No email found in SSO profile
```

**Cause:** IdP is not sending email attribute in SAML assertion.

**Solution:**
Configure IdP to send email in one of these attributes:
- `nameID` (with format emailAddress)
- `email`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
- `urn:oid:0.9.2342.19200300.100.1.3`

### Error: `Missing SAML response`

**Symptom:** Callback receives no SAML data.

**Cause:** IdP not posting to correct ACS URL.

**Solution:**
1. Verify ACS URL in IdP: `https://your-syngrisi.com/v1/auth/sso/saml/callback`
2. Check the request is POST (not GET)
3. Ensure IdP sends `SAMLResponse` form field

### Error: `Failed to fetch IdP metadata`

**Symptom:**
```
Error: Failed to fetch IdP metadata: HTTP 404 Not Found
```
or
```
IdP metadata URL failed and no fallback env variables provided
```

**Cause:** The `SSO_IDP_METADATA_URL` is incorrect or the IdP metadata endpoint is unavailable.

**Solution:**
1. Verify the metadata URL is correct and accessible:
   ```bash
   curl https://your-idp.com/saml/metadata
   ```
2. If the URL is temporarily unavailable, provide fallback env variables:
   ```bash
   export SSO_IDP_METADATA_URL=https://your-idp.com/saml/metadata
   # Fallback values used if URL fails:
   export SSO_ENTRY_POINT=https://your-idp.com/saml/sso
   export SSO_CERT="MIIDpDCCAoy..."
   ```
3. Check network connectivity and firewall rules

### Error: `Invalid SAML metadata: EntityDescriptor not found`

**Symptom:** Metadata URL returns XML but parsing fails.

**Cause:** The URL returns invalid or non-SAML XML content.

**Solution:**
1. Verify the URL returns valid SAML metadata XML
2. Check for namespace issues - metadata should contain `EntityDescriptor`
3. Use manual configuration instead:
   ```bash
   unset SSO_IDP_METADATA_URL
   export SSO_ENTRY_POINT=https://...
   export SSO_CERT="..."
   ```

---

## User and Session Issues

### Issue: User Created with Wrong Role

**Symptom:** New SSO users don't have expected role.

**Solution:**
```bash
# Check current setting
echo $SSO_DEFAULT_ROLE

# Set correct role
export SSO_DEFAULT_ROLE=reviewer  # or 'user' or 'admin'
```

**Manual Fix for Existing Users:**
```javascript
// MongoDB shell
db.users.updateOne(
  { username: "user@example.com" },
  { $set: { role: "reviewer" } }
)
```

### Issue: Existing User Not Linked

**Symptom:** SSO creates new user instead of linking to existing account.

**Possible Causes:**
1. `SSO_ALLOW_ACCOUNT_LINKING` is `false`
2. Email mismatch (case sensitivity)
3. Existing user already has different provider

**Solution:**
```bash
# Enable account linking
export SSO_ALLOW_ACCOUNT_LINKING=true
```

**Check User State:**
```javascript
// MongoDB shell
db.users.findOne({ username: "user@example.com" })
// Check 'provider' field - should be 'local' for auto-linking to work
```

### Issue: Session Lost After Login

**Symptom:** User is redirected to login after successful SSO.

**Possible Causes:**
1. Cookie not set (check domain/secure settings)
2. Session store issue
3. HTTPS/HTTP mismatch

**Solution:**
1. Ensure consistent protocol (HTTPS in production)
2. Check `SYNGRISI_SESSION_STORE_KEY` is set
3. Verify cookie domain settings

### Issue: Cannot Log Out

**Symptom:** User remains logged in after clicking logout.

**Solution:**
1. Clear browser cookies
2. Check server logs for logout errors
3. For full SSO logout, may need to configure IdP logout URL

---

## Configuration Issues

### Issue: SSO Button Not Visible

**Symptom:** Login page doesn't show "Login with SSO" button.

**Checklist:**
1. `SSO_ENABLED=true`
2. Server restarted after configuration change
3. `SSO_PROTOCOL` is set (`oauth2` or `saml`)

### Issue: SSO Enabled But Returns Error

**Symptom:** Clicking SSO redirects to `/auth?error=sso_disabled`

**Cause:** SSO is partially configured.

**Solution:**
For OAuth2, ensure:
```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2
export SSO_CLIENT_ID=your-client-id
export SSO_CLIENT_SECRET=your-client-secret
export SSO_AUTHORIZATION_URL=https://...
export SSO_TOKEN_URL=https://...
```

For SAML, ensure:
```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml
export SSO_ENTRY_POINT=https://...
export SSO_ISSUER=https://...
export SSO_CERT="..."
```

### Issue: Wrong Strategy Used

**Symptom:** OAuth2 uses Google when custom IdP expected.

**Cause:** Custom OAuth2 endpoints not set.

**Solution:**
```bash
# Set BOTH authorization and token URLs for custom OAuth2
export SSO_AUTHORIZATION_URL=https://your-idp.com/oauth/authorize
export SSO_TOKEN_URL=https://your-idp.com/oauth/token
```

If only `SSO_CLIENT_ID` and `SSO_CLIENT_SECRET` are set without URLs, Syngrisi falls back to Google OAuth.

---

## Debugging Tools

### Enable Debug Logging

```bash
export SYNGRISI_LOG_LEVEL=debug
# or
export LOGLEVEL=debug
```

### Test OAuth2 Endpoints Manually

```bash
# Test authorization endpoint (should redirect)
curl -v "https://your-idp.com/oauth/authorize?client_id=YOUR_ID&response_type=code&redirect_uri=http://localhost:3000/v1/auth/sso/oauth/callback&scope=openid%20profile%20email"

# Test token endpoint
curl -X POST https://your-idp.com/oauth/token \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE" \
  -d "client_id=YOUR_ID" \
  -d "client_secret=YOUR_SECRET" \
  -d "redirect_uri=http://localhost:3000/v1/auth/sso/oauth/callback"

# Test userinfo endpoint
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  https://your-idp.com/userinfo
```

### Test SAML Configuration

```bash
# Check IdP metadata (if available)
curl https://your-idp.com/saml/metadata

# Verify certificate
echo "$SSO_CERT" | openssl x509 -noout -text
```

### Check Token Store Status

```javascript
// In Syngrisi (test mode only)
// GET /v1/auth/sso/token-stats
// Returns: { total: 5, expired: 1, withRefreshToken: 3 }
```

### Database Queries for Debugging

```javascript
// MongoDB shell

// Find all SSO users
db.users.find({ provider: { $ne: "local" } })

// Find user by email
db.users.findOne({ username: "user@example.com" })

// Check recent logins (if tracking)
db.users.find({}).sort({ lastLogin: -1 }).limit(5)

// Count users by provider
db.users.aggregate([
  { $group: { _id: "$provider", count: { $sum: 1 } } }
])
```

---

## Getting Help

If you're still experiencing issues:

1. **Check Documentation:**
   - [SSO Architecture](./SSO_ARCHITECTURE.md)
   - [SSO Integration Guide](./SSO_INTEGRATION_GUIDE.md)
   - [Environment Variables](../environment_variables.md)

2. **Collect Information:**
   - Server logs with debug level
   - Browser network tab (HAR file)
   - Environment configuration (without secrets)
   - IdP configuration screenshots

3. **Report Issue:**
   - GitHub Issues: Include logs, configuration, and steps to reproduce
   - Ensure no secrets are exposed in reports

---

## Quick Reference: Error to Solution

| Error | Likely Cause | Quick Fix |
|-------|--------------|-----------|
| `invalid_redirect_uri` | URL mismatch | Check `SSO_CALLBACK_URL` |
| `invalid_client` | Wrong credentials | Verify `SSO_CLIENT_ID/SECRET` |
| `invalid_state` | Session issue | Clear cookies, check session config |
| `Invalid signature` | Cert mismatch | Re-download IdP certificate |
| `No email found` | Missing attribute | Configure IdP to send email |
| SSO button missing | Not enabled | Set `SSO_ENABLED=true` |
| Wrong role | Default not set | Set `SSO_DEFAULT_ROLE` |
| `Failed to fetch IdP metadata` | URL unavailable | Verify URL, add fallback env vars |
| `EntityDescriptor not found` | Invalid metadata XML | Use manual config instead |
