# SSO SAML Implementation Report

## Overview

This document describes the SAML 2.0 Single Sign-On implementation in Syngrisi, including architecture decisions, configuration options, and recent enhancements.

---

## What is SAML SSO?

SAML (Security Assertion Markup Language) is an XML-based standard for exchanging authentication data between:
- **Identity Provider (IdP)** — authenticates users (e.g., Okta, Azure AD, Logto)
- **Service Provider (SP)** — the application users want to access (Syngrisi)

### Authentication Flow

```
┌─────────┐      1. Access App       ┌─────────────┐
│  User   │ ─────────────────────────▶│   Syngrisi  │
│ Browser │                           │    (SP)     │
└─────────┘                           └──────┬──────┘
     │                                       │
     │     2. Redirect to IdP               │
     │◀──────────────────────────────────────┘
     │
     │     3. Login at IdP           ┌─────────────┐
     │ ─────────────────────────────▶│    IdP      │
     │                               │  (Logto)    │
     │     4. SAML Assertion         └──────┬──────┘
     │◀──────────────────────────────────────┘
     │
     │     5. POST Assertion to SP   ┌─────────────┐
     │ ─────────────────────────────▶│   Syngrisi  │
     │                               │    (SP)     │
     │     6. Authenticated          └──────┬──────┘
     │◀──────────────────────────────────────┘
```

---

## Implementation Components

### Core Files

| File | Purpose |
|------|---------|
| `src/server/services/sso/saml.provider.ts` | SAML passport strategy initialization |
| `src/server/services/sso/metadata-loader.service.ts` | IdP metadata XML loader |
| `src/server/services/sso/sso-user.service.ts` | User creation and linking |
| `src/server/services/sso/account-linking.service.ts` | Account linking logic |
| `src/server/routes/v1/auth.route.ts` | SSO routes and SP metadata endpoint |
| `src/server/envConfig.ts` | Environment variable definitions |

### Dependencies

- `@node-saml/passport-saml` (v5+) — SAML authentication strategy for Passport.js
- `fast-xml-parser` — XML parsing for IdP metadata

---

## Configuration Parameters

### Required Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `SSO_ENABLED` | Enable SSO authentication | `true` |
| `SSO_PROTOCOL` | Authentication protocol | `saml` |
| `SSO_ISSUER` | SP Entity ID (your Syngrisi URL) | `https://syngrisi.example.com` |

### IdP Configuration (Choose One Method)

#### Method 1: Automatic via Metadata URL (Recommended)

| Parameter | Description | Example |
|-----------|-------------|---------|
| `SSO_IDP_METADATA_URL` | URL to fetch IdP metadata XML | `https://idp.example.com/saml/metadata` |

The metadata URL automatically provides:
- SSO URL (entry point)
- IdP Entity ID
- Signing certificate

#### Method 2: Manual Configuration

| Parameter | Description | Example |
|-----------|-------------|---------|
| `SSO_ENTRY_POINT` | IdP SSO URL | `https://idp.example.com/saml/sso` |
| `SSO_CERT` | IdP signing certificate (PEM format) | `MIIDpDCCAoy...` |
| `SSO_IDP_ISSUER` | IdP Entity ID (optional, for validation) | `https://idp.example.com` |

### User Management Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SSO_DEFAULT_ROLE` | `reviewer` | Role for new SSO users (`user`, `admin`, `reviewer`) |
| `SSO_AUTO_CREATE_USERS` | `true` | Create users on first SSO login |
| `SSO_ALLOW_ACCOUNT_LINKING` | `true` | Link SSO to existing local accounts by email |

---

## Recent Enhancements

### 1. Dynamic IdP Metadata Loading

**Problem:** Manual SAML configuration requires copying entry point, certificate, and entity ID from IdP — error-prone and needs updates when IdP rotates certificates.

**Solution:** `SSO_IDP_METADATA_URL` parameter allows Syngrisi to automatically fetch and parse IdP configuration.

**Implementation:**
```typescript
// metadata-loader.service.ts
async loadFromUrl(metadataUrl: string, cacheTtlMinutes = 60): Promise<ParsedIdPMetadata> {
    // Fetch XML from URL
    const response = await fetch(metadataUrl);
    const xmlText = await response.text();

    // Parse and extract:
    // - entityID (IdP identifier)
    // - ssoUrl (SingleSignOnService location)
    // - certificate (X509Certificate)
    return this.parseMetadataXml(xmlText);
}
```

**Features:**
- 60-minute cache TTL (configurable)
- Graceful fallback to env vars if URL fails
- Supports multiple XML namespace formats

### 2. SP Metadata Endpoint

**Problem:** IdP administrators need SP metadata (Entity ID, ACS URL) to configure trust relationship.

**Solution:** New endpoint `GET /v1/auth/sso/metadata` returns SP metadata as XML.

**Usage:**
```bash
curl https://syngrisi.example.com/v1/auth/sso/metadata
```

**Returns:**
```xml
<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
                  entityID="https://syngrisi.example.com">
  <SPSSODescriptor>
    <AssertionConsumerService
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      Location="https://syngrisi.example.com/v1/auth/sso/saml/callback"/>
  </SPSSODescriptor>
</EntityDescriptor>
```

---

## Setup Guide

### Step 1: Configure IdP (Example: Logto)

1. Create SAML application in Logto
2. Configure:
   - **ACS URL:** `https://syngrisi.example.com/v1/auth/sso/saml/callback`
   - **SP Entity ID:** `https://syngrisi.example.com`
   - **Name ID Format:** Email
3. Note the **Metadata URL** or copy **SSO URL** and **Certificate**

### Step 2: Configure Syngrisi

**Option A: Using Metadata URL**
```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml
export SSO_IDP_METADATA_URL=https://logto.example.com/.well-known/saml-metadata/app-id
export SSO_ISSUER=https://syngrisi.example.com
```

**Option B: Manual Configuration**
```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml
export SSO_ENTRY_POINT=https://logto.example.com/saml/app-id
export SSO_ISSUER=https://syngrisi.example.com
export SSO_CERT="MIIDpDCCAoygAwIBAgIGAX..."
```

### Step 3: Verify

```bash
# Check SSO is enabled
curl https://syngrisi.example.com/v1/auth/sso/status
# {"ssoEnabled":true}

# Check SP metadata (for IdP configuration)
curl https://syngrisi.example.com/v1/auth/sso/metadata
# <EntityDescriptor>...</EntityDescriptor>
```

---

## Security Considerations

| Aspect | Implementation |
|--------|----------------|
| **Certificate validation** | IdP signing certificate validates SAML assertions |
| **Replay protection** | SAML assertions have `NotOnOrAfter` timestamp |
| **CSRF protection** | SAML uses `InResponseTo` and `RelayState` |
| **Secret storage** | `SSO_CERT` must be in environment variables only |
| **Account takeover** | Email-based linking relies on IdP email verification |

---

## Testing

### E2E Tests

Location: `e2e/features/AUTH/SSO/`

| File | Description |
|------|-------------|
| `sso_saml.feature` | Full SAML login flow with Logto |
| `sso_metadata.feature` | SP metadata endpoint tests |
| `sso_common.feature` | Common SSO scenarios |

### Running Tests

```bash
# Unit tests (no external IdP)
cd e2e && npx bddgen && npx playwright test "features/AUTH/SSO/" --grep-invert "@sso-external"

# Full integration tests (requires Logto)
cd e2e/support/sso && ./start-containers.sh
cd e2e && npx bddgen && npx playwright test "features/AUTH/SSO/" --grep "@saml"
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid signature` | Certificate mismatch | Re-download IdP certificate |
| `No email found` | IdP not sending email | Configure IdP to send `nameID` as email |
| `Failed to fetch IdP metadata` | URL unavailable | Verify URL, add fallback env vars |
| `SAML not initialized` | Missing required config | Check `SSO_ENTRY_POINT` and `SSO_CERT` |

See [SSO Troubleshooting Guide](./SSO_TROUBLESHOOTING.md) for detailed solutions.

---

## Related Documentation

- [SSO Architecture](./SSO_ARCHITECTURE.md) — Component diagram and data flows
- [SSO Integration Guide](./SSO_INTEGRATION_GUIDE.md) — IdP-specific setup instructions
- [SSO Security](./SSO_SECURITY.md) — Security best practices
- [Environment Variables](../environment_variables.md) — Full configuration reference
