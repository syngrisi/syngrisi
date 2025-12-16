# SSO Architecture

This document describes the internal architecture of Syngrisi's Single Sign-On (SSO) system.

## Overview

Syngrisi SSO supports two authentication protocols:
- **OAuth2/OIDC** - For modern identity providers (Okta, Azure AD, Keycloak, Google, etc.)
- **SAML 2.0** - For enterprise identity providers

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Syngrisi Server                                 │
│                                                                             │
│  ┌─────────────────┐     ┌─────────────────────────────────────────────┐   │
│  │  auth.route.ts  │     │           services/sso/                      │   │
│  │                 │     │                                              │   │
│  │  /v1/auth/sso   │────▶│  ┌─────────────────┐  ┌─────────────────┐   │   │
│  │  /sso/oauth/cb  │     │  │ oauth2.provider │  │  saml.provider  │   │   │
│  │  /sso/saml/cb   │     │  │                 │  │                 │   │   │
│  │  /sso/metadata  │     │  │  - OAuth2Strategy│  │  - SamlStrategy │   │   │
│  └─────────────────┘     │  │  - GoogleStrategy│  │  - SAML 2.0     │   │   │
│           │              │  └────────┬────────┘  └────────┬────────┘   │   │
│           │              │           │                    │            │   │
│           │              │           │           ┌────────▼────────┐   │   │
│           │              │           │           │ metadata-loader │   │   │
│           │              │           │           │                 │   │   │
│           │              │           │           │ - loadFromUrl() │   │   │
│           │              │           │           │ - parseXML()    │   │   │
│           │              │           │           └─────────────────┘   │   │
│           │              │           │                    │            │   │
│           │              │           └──────────┬─────────┘            │   │
│           │              │                      ▼                      │   │
│           │              │  ┌─────────────────────────────────────┐   │   │
│           │              │  │        sso-user.service             │   │   │
│           │              │  │                                     │   │   │
│           │              │  │  - normalizeProfile()               │   │   │
│           │              │  │  - processUser()                    │   │   │
│           │              │  │  - Create/Find/Link users           │   │   │
│           │              │  └──────────────┬──────────────────────┘   │   │
│           │              │                 │                          │   │
│           │              │                 ▼                          │   │
│           │              │  ┌─────────────────────────────────────┐   │   │
│           │              │  │     account-linking.service         │   │   │
│           │              │  │                                     │   │   │
│           │              │  │  - canAutoLink()                    │   │   │
│           │              │  │  - autoLink()                       │   │   │
│           │              │  │  - linkAccount() / unlinkAccount()  │   │   │
│           │              │  └─────────────────────────────────────┘   │   │
│           │              │                                            │   │
│           │              │  ┌─────────────┐  ┌─────────────────────┐  │   │
│           │              │  │ token-store │  │       events        │  │   │
│           │              │  │             │  │                     │  │   │
│           │              │  │ OAuth tokens│  │ user.sso.login      │  │   │
│           │              │  │ for refresh │  │ user.sso.created    │  │   │
│           │              │  │ and logout  │  │ user.sso.linked     │  │   │
│           │              │  └─────────────┘  └─────────────────────┘  │   │
│           │              └─────────────────────────────────────────────┘   │
│           │                                                                │
│           ▼                                                                │
│  ┌─────────────────┐                                                       │
│  │  auth-sso.service │ ◀── Main entry point                               │
│  │                   │     - initSSOStrategies()                          │
│  │                   │     - getSSOConfig()                               │
│  │                   │     - handleSSOLogout()                            │
│  └───────────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Identity Provider  │
         │   (Okta, Azure AD,   │
         │    Keycloak, etc.)   │
         └─────────────────────┘
```

## Core Components

### 1. Providers (`services/sso/`)

#### OAuth2 Provider (`oauth2.provider.ts`)
Handles OAuth2/OIDC authentication flow:
- Supports custom OAuth2 endpoints (Logto, Keycloak, Okta)
- Falls back to Google OAuth if no custom endpoints configured
- Fetches user profile from userinfo endpoint
- Stores tokens for refresh and logout capabilities

```typescript
// Key methods
oauth2Provider.initialize(passport)  // Register passport strategy
oauth2Provider.isConfigured()        // Check if properly configured
oauth2Provider.getStrategyName()     // Returns 'oauth2' or 'google'
```

#### SAML Provider (`saml.provider.ts`)
Handles SAML 2.0 authentication:
- Uses `@node-saml/passport-saml` (v5+)
- Normalizes various SAML attribute formats
- Supports IdP issuer validation
- Can load configuration automatically from IdP metadata URL

```typescript
// Key methods
samlProvider.initialize(passport)    // Register passport strategy
samlProvider.isConfigured()          // Check if properly configured
samlProvider.generateMetadata()      // Generate SP metadata for IdP
```

#### Metadata Loader Service (`metadata-loader.service.ts`)
Handles automatic IdP configuration via SAML metadata:
- Fetches and parses SAML IdP metadata XML from URL
- Extracts SSO URL, Entity ID, and signing certificate
- Caches metadata with configurable TTL (default: 60 minutes)
- Supports multiple XML namespace formats

```typescript
// Key methods
metadataLoaderService.loadFromUrl(url, cacheTtlMinutes)  // Fetch and parse metadata
metadataLoaderService.clearCache()                        // Clear cached metadata
```

**Metadata Loading Flow:**
1. On SAML initialization, check if `SSO_IDP_METADATA_URL` is set
2. Fetch XML from URL → Parse EntityDescriptor
3. Extract: `entityID`, `SingleSignOnService/@Location`, `X509Certificate`
4. Use extracted values (env vars override if set)
5. If URL fails → Graceful fallback to env vars (`SSO_ENTRY_POINT`, `SSO_CERT`)

### 2. User Service (`sso-user.service.ts`)

Central service for user management during SSO:

```typescript
// Profile normalization - handles different IdP formats
normalizeProfile(rawProfile, provider) → NormalizedProfile

// Main user processing flow
processUser(profile, provider) → { user, isNewUser, wasLinked }
```

**User Processing Flow:**
1. Find user by `providerId` → Return if found
2. Find user by email → Auto-link if allowed
3. Create new user if `SSO_AUTO_CREATE_USERS=true`

### 3. Account Linking Service (`account-linking.service.ts`)

Manages the relationship between local accounts and SSO identities:

| Method | Description |
|--------|-------------|
| `canAutoLink(email, provider)` | Check if auto-linking is possible |
| `autoLink(user, provider, providerId)` | Link during SSO login |
| `linkAccount(request)` | Explicit user-initiated linking |
| `unlinkAccount(userId)` | Revert to local authentication |

### 4. Token Store (`token-store.ts`)

In-memory store for OAuth2 tokens:

```typescript
// Token lifecycle
store(sessionId, userId, tokens)  // Save after auth
get(sessionId)                     // Retrieve for API calls
update(sessionId, tokens)          // After refresh
remove(sessionId)                  // On logout
removeByUserId(userId)             // On password change
```

Features:
- Automatic cleanup of expired tokens (every 5 minutes)
- Preserves tokens with refresh capability
- Statistics for monitoring (`getStats()`)

### 5. Event System (`events.ts`)

Event-driven architecture for auditing and extensibility:

| Event | Trigger |
|-------|---------|
| `user.sso.login` | Successful SSO authentication |
| `user.sso.created` | New user created via SSO |
| `user.sso.linked` | Account linked to SSO |
| `user.sso.unlinked` | Account unlinked from SSO |
| `user.sso.error` | Authentication error |

```typescript
// Subscribe to events
ssoEvents.onEvent('user.sso.login', (event) => {
    console.log(`User ${event.email} logged in via ${event.provider}`);
});

// Subscribe to all events
ssoEvents.onEvent('*', (event) => {
    auditLog.write(event);
});
```

## Authentication Flows

### OAuth2/OIDC Flow

```
┌──────┐          ┌──────────┐          ┌─────┐          ┌──────────┐
│ User │          │ Syngrisi │          │ IdP │          │ Database │
└──┬───┘          └────┬─────┘          └──┬──┘          └────┬─────┘
   │                   │                   │                  │
   │ 1. Click SSO      │                   │                  │
   │──────────────────▶│                   │                  │
   │                   │                   │                  │
   │                   │ 2. Generate state │                  │
   │                   │    Store in session                  │
   │                   │                   │                  │
   │ 3. Redirect to IdP│                   │                  │
   │◀──────────────────│                   │                  │
   │                   │                   │                  │
   │ 4. Login at IdP   │                   │                  │
   │──────────────────────────────────────▶│                  │
   │                   │                   │                  │
   │ 5. Redirect with code + state         │                  │
   │◀──────────────────────────────────────│                  │
   │                   │                   │                  │
   │ 6. Callback       │                   │                  │
   │──────────────────▶│                   │                  │
   │                   │                   │                  │
   │                   │ 7. Validate state │                  │
   │                   │                   │                  │
   │                   │ 8. Exchange code  │                  │
   │                   │──────────────────▶│                  │
   │                   │                   │                  │
   │                   │ 9. Access token   │                  │
   │                   │◀──────────────────│                  │
   │                   │                   │                  │
   │                   │ 10. Fetch userinfo│                  │
   │                   │──────────────────▶│                  │
   │                   │                   │                  │
   │                   │ 11. User profile  │                  │
   │                   │◀──────────────────│                  │
   │                   │                   │                  │
   │                   │ 12. Find/Create user                 │
   │                   │─────────────────────────────────────▶│
   │                   │                   │                  │
   │                   │ 13. Store tokens  │                  │
   │                   │                   │                  │
   │ 14. Set session   │                   │                  │
   │◀──────────────────│                   │                  │
   │                   │                   │                  │
   │ 15. Redirect to / │                   │                  │
   │◀──────────────────│                   │                  │
```

### SAML Flow

```
┌──────┐          ┌──────────┐          ┌─────┐          ┌──────────┐
│ User │          │ Syngrisi │          │ IdP │          │ Database │
└──┬───┘          └────┬─────┘          └──┬──┘          └────┬─────┘
   │                   │                   │                  │
   │ 1. Click SSO      │                   │                  │
   │──────────────────▶│                   │                  │
   │                   │                   │                  │
   │ 2. SAML AuthnRequest (redirect)       │                  │
   │◀──────────────────│                   │                  │
   │                   │                   │                  │
   │ 3. Login at IdP   │                   │                  │
   │──────────────────────────────────────▶│                  │
   │                   │                   │                  │
   │ 4. SAML Response (POST to ACS)        │                  │
   │◀──────────────────────────────────────│                  │
   │                   │                   │                  │
   │ 5. POST Assertion │                   │                  │
   │──────────────────▶│                   │                  │
   │                   │                   │                  │
   │                   │ 6. Validate signature                │
   │                   │    Parse attributes                  │
   │                   │                   │                  │
   │                   │ 7. Find/Create user                  │
   │                   │─────────────────────────────────────▶│
   │                   │                   │                  │
   │ 8. Set session    │                   │                  │
   │◀──────────────────│                   │                  │
   │                   │                   │                  │
   │ 9. Redirect to /  │                   │                  │
   │◀──────────────────│                   │                  │
```

## Data Model

### User Model (SSO fields)

```typescript
interface User {
    username: string;      // Email from IdP
    firstName: string;     // From IdP profile
    lastName: string;      // From IdP profile
    role: 'user' | 'admin' | 'reviewer';  // SSO_DEFAULT_ROLE
    provider: 'local' | 'oauth' | 'saml';
    providerId?: string;   // IdP-specific user ID
    password: string;      // Random UUID for SSO users
    apiKey: string;        // Generated for CI/CD usage
}
```

### Normalized Profile

All IdP responses are normalized to this format:

```typescript
interface NormalizedProfile {
    id: string;            // Provider-specific user ID
    email?: string;        // User's email
    name?: {
        givenName?: string;
        familyName?: string;
    };
    displayName?: string;
    provider?: string;
    _json?: any;           // Raw response for debugging
}
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SSO_ENABLED` | Yes | Enable SSO (`true`/`false`) |
| `SSO_PROTOCOL` | Yes | `oauth2` or `saml` |
| **OAuth2** | | |
| `SSO_CLIENT_ID` | Yes | OAuth client ID |
| `SSO_CLIENT_SECRET` | Yes | OAuth client secret |
| `SSO_AUTHORIZATION_URL` | Yes* | Auth endpoint |
| `SSO_TOKEN_URL` | Yes* | Token endpoint |
| `SSO_USERINFO_URL` | No | Userinfo endpoint |
| `SSO_CALLBACK_URL` | No | Callback path (default: `/v1/auth/sso/oauth/callback`) |
| **SAML** | | |
| `SSO_ENTRY_POINT` | Yes | IdP SSO URL |
| `SSO_ISSUER` | Yes | SP Entity ID |
| `SSO_CERT` | Yes | IdP signing certificate |
| `SSO_IDP_ISSUER` | No | IdP Entity ID (for validation) |
| **User Settings** | | |
| `SSO_DEFAULT_ROLE` | No | Default role (default: `reviewer`) |
| `SSO_AUTO_CREATE_USERS` | No | Auto-create users (default: `true`) |
| `SSO_ALLOW_ACCOUNT_LINKING` | No | Allow linking (default: `true`) |

*Required for custom OAuth2 providers. If not set, falls back to Google OAuth.

## File Structure

```
src/server/
├── services/
│   ├── auth-sso.service.ts    # Main entry point
│   └── sso/
│       ├── index.ts           # Module exports
│       ├── types.ts           # TypeScript interfaces
│       ├── oauth2.provider.ts # OAuth2/OIDC implementation
│       ├── saml.provider.ts   # SAML 2.0 implementation
│       ├── sso-user.service.ts    # User management
│       ├── account-linking.service.ts  # Account linking
│       ├── token-store.ts     # OAuth token storage
│       └── events.ts          # Event emitter
├── routes/v1/
│   └── auth.route.ts          # SSO endpoints
└── envConfig.ts               # Environment configuration
```

## Related Documentation

- [SSO Index](./README.md) - Documentation overview
- [SSO User Flow](./SSO_USER_FLOW.md) - User workflow and setup
- [SSO Integration Guide](./SSO_INTEGRATION_GUIDE.md) - IdP setup guides
- [SSO Troubleshooting](./SSO_TROUBLESHOOTING.md) - Common issues
- [SSO Security](./SSO_SECURITY.md) - Security recommendations
- [Environment Variables](../environment_variables.md) - Full configuration reference
