# SSO Documentation

Single Sign-On (SSO) documentation for Syngrisi.

## Overview

Syngrisi supports Single Sign-On authentication via:
- **OAuth2/OIDC** - For modern identity providers (Okta, Azure AD, Keycloak, Google, Auth0)
- **SAML 2.0** - For enterprise identity providers

## Documentation Index

### Getting Started

| Document | Description |
|----------|-------------|
| [User Flow](./SSO_USER_FLOW.md) | How SSO works for end users, default roles, API key retrieval |
| [Integration Guide](./SSO_INTEGRATION_GUIDE.md) | Step-by-step setup for popular IdPs (Okta, Azure AD, Keycloak, Google, Auth0) |

### Reference

| Document | Description |
|----------|-------------|
| [Architecture](./SSO_ARCHITECTURE.md) | Technical architecture, components, data flows |
| [Environment Variables](../environment_variables.md#sso-single-sign-on-configuration) | All SSO configuration options |

### Operations

| Document | Description |
|----------|-------------|
| [Migration Guide](./SSO_MIGRATION.md) | Migrating from local auth to SSO, switching providers |
| [Troubleshooting](./SSO_TROUBLESHOOTING.md) | Common errors and solutions |
| [Security](./SSO_SECURITY.md) | Security best practices, deployment checklist |

### Testing

| Document | Description |
|----------|-------------|
| [Manual Testing](./SSO_MANUAL_TESTING.md) | How to test SSO locally with Logto |

## Quick Start

### 1. Choose Your Protocol

- **OAuth2/OIDC** - Recommended for most modern IdPs
- **SAML 2.0** - Required by some enterprise IdPs

### 2. Configure Environment

```bash
# Enable SSO
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2  # or 'saml'

# For OAuth2
export SSO_CLIENT_ID=your-client-id
export SSO_CLIENT_SECRET=your-secret
export SSO_AUTHORIZATION_URL=https://your-idp.com/oauth/authorize
export SSO_TOKEN_URL=https://your-idp.com/oauth/token
export SSO_USERINFO_URL=https://your-idp.com/oauth/userinfo

# For SAML (manual configuration)
export SSO_ENTRY_POINT=https://your-idp.com/saml/sso
export SSO_ISSUER=https://your-syngrisi.com
export SSO_CERT="-----BEGIN CERTIFICATE-----..."

# For SAML (automatic via metadata URL)
export SSO_IDP_METADATA_URL=https://your-idp.com/saml/metadata
export SSO_ISSUER=https://your-syngrisi.com
```

### 3. Test

1. Restart Syngrisi
2. Navigate to login page
3. Click "Login with SSO"
4. Authenticate with your IdP

## SAML SP Metadata

When using SAML, Syngrisi provides an endpoint to retrieve Service Provider (SP) metadata:

```
GET /v1/auth/sso/metadata
```

This returns an XML document that can be used to configure your IdP. The metadata includes:
- Entity ID (SP identifier)
- Assertion Consumer Service (ACS) URL
- Supported bindings

## Common Tasks

| Task | Document |
|------|----------|
| Set up Okta SSO | [Integration Guide - Okta](./SSO_INTEGRATION_GUIDE.md#okta-oauth2oidc) |
| Set up Azure AD SSO | [Integration Guide - Azure AD](./SSO_INTEGRATION_GUIDE.md#azure-ad--microsoft-entra-id) |
| Debug login errors | [Troubleshooting](./SSO_TROUBLESHOOTING.md) |
| Migrate existing users to SSO | [Migration Guide](./SSO_MIGRATION.md) |
| Secure SSO deployment | [Security Guide](./SSO_SECURITY.md#deployment-checklist) |

## Support

If you encounter issues not covered in [Troubleshooting](./SSO_TROUBLESHOOTING.md):

1. Check server logs for SSO-related errors
2. Enable debug logging: `export SYNGRISI_LOG_LEVEL=debug`
3. Report issues with logs and configuration (without secrets)
