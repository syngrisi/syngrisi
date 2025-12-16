# SSO Integration Guide

This guide provides step-by-step instructions for integrating Syngrisi with popular Identity Providers (IdP).

## Table of Contents

- [Okta (OAuth2/OIDC)](#okta-oauth2oidc)
- [Azure AD / Microsoft Entra ID](#azure-ad--microsoft-entra-id)
- [Keycloak](#keycloak)
- [Google Workspace](#google-workspace)
- [Auth0](#auth0)
- [Generic SAML 2.0](#generic-saml-20)

---

## Okta (OAuth2/OIDC)

### Step 1: Create Application in Okta

1. Log in to your Okta Admin Console
2. Navigate to **Applications** → **Applications**
3. Click **Create App Integration**
4. Select:
   - Sign-in method: **OIDC - OpenID Connect**
   - Application type: **Web Application**
5. Click **Next**

### Step 2: Configure Application

| Setting | Value |
|---------|-------|
| App integration name | `Syngrisi` |
| Grant type | ✓ Authorization Code |
| Sign-in redirect URIs | `https://your-syngrisi.com/v1/auth/sso/oauth/callback` |
| Sign-out redirect URIs | `https://your-syngrisi.com/auth` |
| Controlled access | Assign to groups as needed |

### Step 3: Get Credentials

After creating the app:
1. Copy **Client ID**
2. Copy **Client Secret**
3. Note your Okta domain (e.g., `dev-123456.okta.com`)

### Step 4: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Okta credentials
export SSO_CLIENT_ID=0oa1234567890abcdef
export SSO_CLIENT_SECRET=your-client-secret

# Okta endpoints (replace YOUR_OKTA_DOMAIN)
export SSO_AUTHORIZATION_URL=https://YOUR_OKTA_DOMAIN/oauth2/default/v1/authorize
export SSO_TOKEN_URL=https://YOUR_OKTA_DOMAIN/oauth2/default/v1/token
export SSO_USERINFO_URL=https://YOUR_OKTA_DOMAIN/oauth2/default/v1/userinfo

# User settings
export SSO_DEFAULT_ROLE=reviewer
```

### Step 5: Verify

1. Restart Syngrisi
2. Navigate to login page
3. Click "Login with SSO"
4. You should be redirected to Okta

---

## Azure AD / Microsoft Entra ID

### Option A: OAuth2/OIDC (Recommended)

#### Step 1: Register Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** → **App registrations**
3. Click **New registration**

| Setting | Value |
|---------|-------|
| Name | `Syngrisi` |
| Supported account types | Select based on your needs |
| Redirect URI | Web: `https://your-syngrisi.com/v1/auth/sso/oauth/callback` |

#### Step 2: Configure Authentication

1. Go to **Authentication**
2. Add redirect URI if not set
3. Under **Implicit grant and hybrid flows**, leave unchecked (we use authorization code flow)

#### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Set description and expiry
4. **Copy the secret value immediately** (shown only once)

#### Step 4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add:
   - `openid`
   - `profile`
   - `email`
4. Click **Grant admin consent** (if required)

#### Step 5: Get Endpoints

1. Go to **Overview**
2. Click **Endpoints**
3. Note:
   - OAuth 2.0 authorization endpoint (v2)
   - OAuth 2.0 token endpoint (v2)

#### Step 6: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Azure AD credentials
export SSO_CLIENT_ID=your-application-client-id
export SSO_CLIENT_SECRET=your-client-secret

# Azure AD endpoints (replace TENANT_ID)
export SSO_AUTHORIZATION_URL=https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/authorize
export SSO_TOKEN_URL=https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/token
export SSO_USERINFO_URL=https://graph.microsoft.com/oidc/userinfo

export SSO_DEFAULT_ROLE=reviewer
```

### Option B: SAML 2.0

#### Step 1: Create Enterprise Application

1. Go to **Microsoft Entra ID** → **Enterprise applications**
2. Click **New application** → **Create your own application**
3. Name: `Syngrisi`
4. Select: **Integrate any other application you don't find in the gallery (Non-gallery)**

#### Step 2: Configure SAML

1. Go to **Single sign-on** → **SAML**
2. Edit **Basic SAML Configuration**:

| Setting | Value |
|---------|-------|
| Identifier (Entity ID) | `https://your-syngrisi.com` |
| Reply URL (ACS URL) | `https://your-syngrisi.com/v1/auth/sso/saml/callback` |
| Sign on URL | `https://your-syngrisi.com` |

3. Edit **Attributes & Claims** to ensure email is sent:
   - `emailaddress` → `user.mail`

#### Step 3: Download Certificate

1. In **SAML Certificates** section
2. Download **Certificate (Base64)**
3. Copy the certificate content (without BEGIN/END lines, or with them)

#### Step 4: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml

# From Azure AD SAML configuration
export SSO_ENTRY_POINT=https://login.microsoftonline.com/TENANT_ID/saml2
export SSO_ISSUER=https://your-syngrisi.com

# Certificate (can be multiline or single line)
export SSO_CERT="MIIDpDCCAoygAwIBAgIGAX..."

export SSO_DEFAULT_ROLE=reviewer
```

---

## Keycloak

### OAuth2/OIDC Setup

#### Step 1: Create Client

1. Log in to Keycloak Admin Console
2. Select your realm
3. Go to **Clients** → **Create client**

| Setting | Value |
|---------|-------|
| Client type | OpenID Connect |
| Client ID | `syngrisi` |

#### Step 2: Configure Client

| Setting | Value |
|---------|-------|
| Client authentication | ON |
| Authorization | OFF |
| Authentication flow | ✓ Standard flow |
| Valid redirect URIs | `https://your-syngrisi.com/v1/auth/sso/oauth/callback` |
| Valid post logout redirect URIs | `https://your-syngrisi.com/auth` |
| Web origins | `https://your-syngrisi.com` |

#### Step 3: Get Credentials

1. Go to **Credentials** tab
2. Copy **Client secret**

#### Step 4: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Keycloak credentials
export SSO_CLIENT_ID=syngrisi
export SSO_CLIENT_SECRET=your-client-secret

# Keycloak endpoints (replace KEYCLOAK_URL and REALM)
export SSO_AUTHORIZATION_URL=https://KEYCLOAK_URL/realms/REALM/protocol/openid-connect/auth
export SSO_TOKEN_URL=https://KEYCLOAK_URL/realms/REALM/protocol/openid-connect/token
export SSO_USERINFO_URL=https://KEYCLOAK_URL/realms/REALM/protocol/openid-connect/userinfo

export SSO_DEFAULT_ROLE=reviewer
```

### SAML Setup

#### Step 1: Create SAML Client

1. Go to **Clients** → **Create client**
2. Select **SAML** as client type
3. Set Client ID: `https://your-syngrisi.com` (this becomes the SP Entity ID)

#### Step 2: Configure SAML Client

| Setting | Value |
|---------|-------|
| Valid redirect URIs | `https://your-syngrisi.com/*` |
| Master SAML Processing URL | `https://your-syngrisi.com/v1/auth/sso/saml/callback` |
| Name ID Format | email |

#### Step 3: Get IdP Metadata

1. Go to **Realm Settings** → **Keys**
2. Copy the RS256 certificate
3. Note the SAML endpoint: `https://KEYCLOAK_URL/realms/REALM/protocol/saml`

#### Step 4: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml

export SSO_ENTRY_POINT=https://KEYCLOAK_URL/realms/REALM/protocol/saml
export SSO_ISSUER=https://your-syngrisi.com
export SSO_IDP_ISSUER=https://KEYCLOAK_URL/realms/REALM
export SSO_CERT="MIICnTCCAYUCBgF..."

export SSO_DEFAULT_ROLE=reviewer
```

---

## Google Workspace

### Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select or create a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**

### Step 2: Configure OAuth Consent Screen

If not configured:
1. Go to **OAuth consent screen**
2. Select **Internal** (for Workspace) or **External**
3. Fill in app information
4. Add scopes: `email`, `profile`, `openid`

### Step 3: Create OAuth Client

| Setting | Value |
|---------|-------|
| Application type | Web application |
| Name | `Syngrisi` |
| Authorized redirect URIs | `https://your-syngrisi.com/v1/auth/sso/oauth/callback` |

### Step 4: Configure Syngrisi

For Google, you don't need to specify endpoints (uses Google's defaults):

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Google credentials
export SSO_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
export SSO_CLIENT_SECRET=GOCSPX-your-secret

# No need to set SSO_AUTHORIZATION_URL, SSO_TOKEN_URL, SSO_USERINFO_URL
# Syngrisi will use Google's default endpoints

export SSO_DEFAULT_ROLE=reviewer
```

---

## Auth0

### Step 1: Create Application

1. Log in to [Auth0 Dashboard](https://manage.auth0.com)
2. Go to **Applications** → **Applications**
3. Click **Create Application**
4. Name: `Syngrisi`
5. Type: **Regular Web Applications**

### Step 2: Configure Application

Go to **Settings** tab:

| Setting | Value |
|---------|-------|
| Allowed Callback URLs | `https://your-syngrisi.com/v1/auth/sso/oauth/callback` |
| Allowed Logout URLs | `https://your-syngrisi.com/auth` |
| Allowed Web Origins | `https://your-syngrisi.com` |

### Step 3: Get Credentials

From the **Settings** tab, copy:
- Domain
- Client ID
- Client Secret

### Step 4: Configure Syngrisi

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Auth0 credentials
export SSO_CLIENT_ID=your-client-id
export SSO_CLIENT_SECRET=your-client-secret

# Auth0 endpoints (replace YOUR_DOMAIN)
export SSO_AUTHORIZATION_URL=https://YOUR_DOMAIN.auth0.com/authorize
export SSO_TOKEN_URL=https://YOUR_DOMAIN.auth0.com/oauth/token
export SSO_USERINFO_URL=https://YOUR_DOMAIN.auth0.com/userinfo

export SSO_DEFAULT_ROLE=reviewer
```

---

## Generic SAML 2.0

For any SAML 2.0 compatible IdP:

### Required Information from IdP

| Item | Description |
|------|-------------|
| SSO URL / Entry Point | The IdP's login URL |
| Entity ID / Issuer | The IdP's identifier |
| X.509 Certificate | IdP's signing certificate |

### Syngrisi Configuration for IdP

Provide to your IdP administrator:

| Item | Value |
|------|-------|
| SP Entity ID | `https://your-syngrisi.com` (or your chosen identifier) |
| ACS URL | `https://your-syngrisi.com/v1/auth/sso/saml/callback` |
| NameID Format | `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress` |

### Required Attributes

Ensure your IdP sends these attributes:

| Attribute | Purpose |
|-----------|---------|
| `nameID` or `email` | User's email address (required) |
| `firstName` or `givenName` | User's first name (optional) |
| `lastName` or `surname` | User's last name (optional) |

### Syngrisi Configuration

#### Option 1: Automatic via Metadata URL (Recommended)

If your IdP provides a metadata URL, you can let Syngrisi automatically configure SSO:

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml

# Automatic configuration via metadata URL
export SSO_IDP_METADATA_URL=https://idp.example.com/saml/metadata
export SSO_ISSUER=https://your-syngrisi.com

export SSO_DEFAULT_ROLE=reviewer
```

Syngrisi will automatically fetch:
- SSO URL (entry point)
- IdP Entity ID
- Signing certificate

**Note:** If the metadata URL is unavailable at startup, Syngrisi falls back to environment variables (`SSO_ENTRY_POINT`, `SSO_CERT`).

#### Option 2: Manual Configuration

```bash
export SSO_ENABLED=true
export SSO_PROTOCOL=saml

# From your IdP
export SSO_ENTRY_POINT=https://idp.example.com/sso/saml
export SSO_ISSUER=https://your-syngrisi.com
export SSO_IDP_ISSUER=https://idp.example.com  # Optional, for validation

# Certificate (PEM format, can include BEGIN/END markers)
export SSO_CERT="-----BEGIN CERTIFICATE-----
MIIDpDCCAoygAwIBAgIGAX...
-----END CERTIFICATE-----"

export SSO_DEFAULT_ROLE=reviewer
```

### Get SP Metadata for IdP Configuration

Once SAML is configured, you can retrieve Syngrisi's SP metadata to configure your IdP:

```bash
curl https://your-syngrisi.com/v1/auth/sso/metadata
```

This returns an XML document containing:
- SP Entity ID
- Assertion Consumer Service (ACS) URL
- Supported bindings

---

## Testing Your Configuration

### 1. Check SSO Status

```bash
curl https://your-syngrisi.com/v1/auth/sso/status
# Should return: {"ssoEnabled":true}
```

### 2. Check Secrets Status

```bash
curl https://your-syngrisi.com/v1/auth/sso/secrets-status
# For OAuth2: {"clientSecretConfigured":true,"certConfigured":false}
# For SAML: {"clientSecretConfigured":false,"certConfigured":true}
```

### 3. Check SP Metadata (SAML only)

```bash
curl https://your-syngrisi.com/v1/auth/sso/metadata
# Returns XML SP metadata document
```

### 4. Test Login Flow

1. Open Syngrisi in incognito/private window
2. Click "Login with SSO"
3. Complete authentication at IdP
4. Verify redirect back to Syngrisi
5. Check user was created with correct role

### 5. Verify User in Database

```javascript
// In MongoDB shell
db.users.findOne({ username: "user@example.com" })
// Should show: provider: "oauth" or "saml"
```

---

## Common Issues

See [SSO Troubleshooting Guide](./SSO_TROUBLESHOOTING.md) for solutions to common problems:

- Redirect URI mismatch
- Invalid client errors
- Certificate validation failures
- Missing user attributes

---

## Related Documentation

- [SSO Index](./README.md) - Documentation overview
- [SSO Architecture](./SSO_ARCHITECTURE.md) - Technical architecture
- [SSO User Flow](./SSO_USER_FLOW.md) - User workflow
- [SSO Troubleshooting](./SSO_TROUBLESHOOTING.md) - Common issues
- [SSO Security](./SSO_SECURITY.md) - Security recommendations
- [Environment Variables](../environment_variables.md) - Full configuration reference
