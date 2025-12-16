# SSO Security Guide

This document outlines security considerations and best practices for SSO authentication in Syngrisi.

## Table of Contents

- [Security Architecture](#security-architecture)
- [OAuth2 Security](#oauth2-security)
- [SAML Security](#saml-security)
- [Secret Management](#secret-management)
- [Session Security](#session-security)
- [Account Linking Security](#account-linking-security)
- [Deployment Checklist](#deployment-checklist)
- [Security Monitoring](#security-monitoring)

---

## Security Architecture

### Defense in Depth

Syngrisi SSO implements multiple layers of security:

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│  1. Transport Security (HTTPS/TLS)                          │
├─────────────────────────────────────────────────────────────┤
│  2. CSRF Protection (OAuth2 state / SAML RelayState)        │
├─────────────────────────────────────────────────────────────┤
│  3. Token Validation (Signature verification)               │
├─────────────────────────────────────────────────────────────┤
│  4. Session Management (Secure cookies, expiration)         │
├─────────────────────────────────────────────────────────────┤
│  5. Rate Limiting (Auth endpoints)                          │
├─────────────────────────────────────────────────────────────┤
│  6. Input Validation (Profile data sanitization)            │
└─────────────────────────────────────────────────────────────┘
```

### Security-Sensitive Components

| Component | Risk | Mitigation |
|-----------|------|------------|
| Client Secret | Credential theft | Environment variables only |
| SAML Certificate | Signature bypass | Environment variables only |
| Session Key | Session hijacking | Secure random generation |
| Access Tokens | Token theft | In-memory storage, expiration |

---

## OAuth2 Security

### CSRF Protection via State Parameter

Syngrisi implements OAuth2 state parameter for CSRF protection:

```
1. User clicks SSO → Generate random state → Store in session
2. Redirect to IdP with state parameter
3. IdP redirects back with same state
4. Syngrisi validates state matches session → Proceed or reject
```

**Implementation Details:**
- State is 16 bytes (128 bits) of cryptographically secure random data
- State is stored server-side in session (not cookie)
- State is single-use and deleted after validation
- Mismatched state results in immediate rejection

### Token Handling

**Best Practices Implemented:**
- Access tokens stored in server memory only
- Tokens never exposed to client-side JavaScript
- Token store cleaned every 5 minutes
- Expired tokens without refresh capability are removed

**What NOT to Do:**
- Never store tokens in browser localStorage
- Never include tokens in URLs
- Never log tokens (even in debug mode)

### Scope Minimization

Syngrisi requests only necessary OAuth2 scopes:
```
openid profile email
```

Do not add additional scopes unless required.

### Redirect URI Validation

The callback URL is strictly validated:
- Must match exactly (no wildcards)
- Protocol, host, port, and path must match
- Configure the most specific URL possible

**Recommendation:**
```bash
# Good - specific path
https://syngrisi.example.com/v1/auth/sso/oauth/callback

# Bad - too broad (never do this in IdP)
https://syngrisi.example.com/*
```

---

## SAML Security

### Signature Validation

Syngrisi validates SAML assertions using the IdP certificate:

```bash
# SSO_CERT must be the IdP's public signing certificate
export SSO_CERT="-----BEGIN CERTIFICATE-----
MIIDpDCCAoygAwIBAgIGAX...
-----END CERTIFICATE-----"
```

**Security Settings:**
```typescript
// Current configuration (in saml.provider.ts)
{
    wantAssertionsSigned: false,    // Set to true for stricter security
    wantAuthnResponseSigned: false, // Set to true for stricter security
}
```

**Recommendation for Production:**
For maximum security, configure your IdP to sign both assertions and responses, then update Syngrisi configuration.

### Certificate Management

| Practice | Description |
|----------|-------------|
| **Rotation** | Monitor IdP certificate expiration, update before expiry |
| **Validation** | Verify certificate fingerprint when configuring |
| **Storage** | Store only in environment variables, never in code |
| **Backup** | Keep secure backup of certificates |

### Issuer Validation

Enable IdP issuer validation for additional security:

```bash
export SSO_ISSUER=https://syngrisi.example.com    # Your SP Entity ID
export SSO_IDP_ISSUER=https://idp.example.com     # IdP Entity ID (optional but recommended)
```

### Assertion Consumer Service (ACS)

- ACS URL must use HTTPS in production
- ACS accepts only POST requests
- Response must contain valid `SAMLResponse` field

---

## Secret Management

### Environment Variables Only

**Critical:** SSO secrets must ONLY be configured via environment variables.

```bash
# Required secrets - NEVER hardcode these
export SSO_CLIENT_SECRET=your-oauth-client-secret
export SSO_CERT="your-saml-certificate"
export SYNGRISI_SESSION_STORE_KEY=your-session-secret
```

### Why Not Database/UI Configuration?

1. **Audit Trail:** Environment changes are tracked in deployment systems
2. **Access Control:** Fewer people have server access than DB access
3. **Encryption at Rest:** Secrets managers encrypt environment variables
4. **No UI Exposure:** Prevents accidental exposure in admin panels

### Secrets Manager Integration

For production, use a secrets manager:

**AWS Secrets Manager:**
```bash
# Retrieve at startup
export SSO_CLIENT_SECRET=$(aws secretsmanager get-secret-value \
  --secret-id syngrisi/sso --query SecretString --output text | jq -r .clientSecret)
```

**HashiCorp Vault:**
```bash
export SSO_CLIENT_SECRET=$(vault kv get -field=clientSecret secret/syngrisi/sso)
```

**Kubernetes Secrets:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: syngrisi-sso
type: Opaque
stringData:
  SSO_CLIENT_SECRET: "your-secret"
```

### Secret Rotation

1. Generate new secret in IdP
2. Update environment variable
3. Restart Syngrisi (brief downtime)
4. Verify login works
5. Revoke old secret in IdP

---

## Session Security

### Session Configuration

```bash
# Use a strong, fixed session key (not random per restart)
export SYNGRISI_SESSION_STORE_KEY=$(openssl rand -hex 64)
```

**Best Practices:**
- Use 64+ bytes of entropy
- Keep consistent across restarts (for session persistence)
- Rotate periodically (will log out all users)

### Cookie Security

Syngrisi sets secure cookie attributes:

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `httpOnly` | `true` | Prevents JavaScript access |
| `secure` | `true` (in production) | HTTPS only |
| `sameSite` | `lax` | CSRF protection |

### Session Storage Considerations

**Single Instance:**
- In-memory session store is sufficient
- Sessions lost on restart

**Multiple Instances:**
- Use Redis or MongoDB session store
- Ensure `SYNGRISI_SESSION_STORE_KEY` is same across all instances
- Configure sticky sessions or shared session storage

---

## Account Linking Security

### Auto-Linking Risks

Auto-linking SSO to existing accounts has risks:

| Risk | Scenario | Mitigation |
|------|----------|------------|
| Account takeover | Attacker controls IdP email | Verify IdP email verification |
| Privilege escalation | Link to admin account | Manual admin account linking |
| Data leakage | Wrong account linked | Email verification in IdP |

### Recommended Configuration

```bash
# For most environments
export SSO_AUTO_CREATE_USERS=true
export SSO_ALLOW_ACCOUNT_LINKING=true

# For high-security environments
export SSO_AUTO_CREATE_USERS=true
export SSO_ALLOW_ACCOUNT_LINKING=false  # Require manual linking
```

### Manual Linking Process

If auto-linking is disabled:

1. User logs in via SSO → New account created
2. Admin verifies user identity
3. Admin merges accounts in database (if needed)

---

## Deployment Checklist

### Pre-Deployment

- [ ] **HTTPS Enabled:** All SSO traffic must use HTTPS
- [ ] **Secrets in Environment:** No secrets in code or config files
- [ ] **Session Key Set:** `SYNGRISI_SESSION_STORE_KEY` is strong and consistent
- [ ] **Redirect URIs Specific:** No wildcard redirect URIs in IdP
- [ ] **Rate Limiting Active:** Auth endpoints have rate limits

### IdP Configuration

- [ ] **Email Verified:** IdP requires email verification
- [ ] **MFA Enabled:** Multi-factor authentication in IdP (recommended)
- [ ] **Session Timeout:** Reasonable IdP session timeout
- [ ] **IP Restrictions:** Restrict IdP access if possible

### Monitoring Setup

- [ ] **Failed Login Alerts:** Monitor for repeated failures
- [ ] **New User Alerts:** Alert on SSO user creation (optional)
- [ ] **Certificate Expiry:** Monitor SAML certificate expiration
- [ ] **Audit Logging:** Enable comprehensive auth logging

### Post-Deployment

- [ ] **Test Login Flow:** Verify complete SSO flow works
- [ ] **Test Logout:** Verify session is properly destroyed
- [ ] **Test Error Handling:** Verify errors don't expose sensitive info
- [ ] **Penetration Test:** Include SSO in security assessments

---

## Security Monitoring

### Events to Monitor

```javascript
// SSO events emitted by Syngrisi
'user.sso.login'    // Successful login
'user.sso.created'  // New user created
'user.sso.linked'   // Account linked
'user.sso.unlinked' // Account unlinked
'user.sso.error'    // Authentication error
```

### Suspicious Activity Indicators

| Indicator | Possible Issue |
|-----------|---------------|
| Many `user.sso.error` events | Brute force or misconfiguration |
| Rapid `user.sso.created` events | Unauthorized IdP access |
| `invalid_state` errors | CSRF attack attempts |
| Geographic anomalies | Account compromise |

### Log Analysis Queries

```bash
# Failed SSO attempts
grep "SSO.*error\|invalid_state\|invalid_client" logs/syngrisi.log

# New user creation spike
grep "user.sso.created" logs/syngrisi.log | cut -d' ' -f1 | uniq -c | sort -rn

# Unusual providers
grep "provider" logs/syngrisi.log | grep -v "oauth\|saml\|local"
```

### Alerting Recommendations

| Metric | Threshold | Action |
|--------|-----------|--------|
| Failed logins | >10/minute | Alert + investigate |
| New users | >50/hour | Alert + review |
| `invalid_state` | >5/minute | Alert + block IP |
| Certificate expiry | <30 days | Alert + rotate |

---

## Security Incident Response

### If Credentials Are Compromised

1. **Immediate:** Rotate `SSO_CLIENT_SECRET` in IdP
2. **Update:** Deploy new secret to Syngrisi
3. **Audit:** Review recent logins for suspicious activity
4. **Notify:** Inform affected users if necessary

### If Session Key Is Compromised

1. **Immediate:** Generate new `SYNGRISI_SESSION_STORE_KEY`
2. **Deploy:** Update and restart Syngrisi
3. **Effect:** All users will be logged out
4. **Audit:** Review session logs for hijacking

### If IdP Is Compromised

1. **Disable SSO:** Set `SSO_ENABLED=false`
2. **Enable local auth:** Ensure local login works
3. **Notify users:** Inform about temporary change
4. **Coordinate:** Work with IdP vendor on remediation
5. **Re-enable:** After IdP confirms security restored

---

## Related Documentation

- [SSO Index](./README.md) - Documentation overview
- [SSO Architecture](./SSO_ARCHITECTURE.md) - Technical architecture
- [SSO Integration Guide](./SSO_INTEGRATION_GUIDE.md) - IdP setup
- [SSO Troubleshooting](./SSO_TROUBLESHOOTING.md) - Common issues
- [Environment Variables](../environment_variables.md) - Configuration reference
