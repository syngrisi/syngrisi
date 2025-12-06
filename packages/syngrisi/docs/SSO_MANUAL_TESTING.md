# Manual SSO Infrastructure & Testing Guide

This guide describes how to manually start the SSO infrastructure (Logto), configure Syngrisi, and perform manual testing of the Single Sign-On flow.

## 1. Prerequisites

*   **Docker** running.
*   **Apple Container CLI** (if on macOS) or standard Docker CLI.
*   **Node.js v20+**.

## 2. Start SSO Infrastructure

We use **Logto** as our local Identity Provider (IdP). It runs in Docker containers.

To start and automatically provision Logto (create app, user, etc.):

```bash
# Run from packages/syngrisi directory
./e2e/support/sso/setup-logto.sh
```

**What this does:**
1.  Starts Postgres and Logto containers.
2.  Waits for Logto to be ready.
3.  Runs a provisioning script to create:
    *   OIDC Application (`syngrisi-e2e-test`)
    *   Test User (`testuser`)
    *   SAML Configuration

**Verify it's running:**
*   **Logto Admin Console:** [http://localhost:3050](http://localhost:3050)
*   **Username:** `admin`
*   **Password:** `adpass`

## 3. Configure Syngrisi

To enable SSO in your local Syngrisi instance, you need to set specific environment variables.

### Option A: OAuth2 (OIDC) Configuration

Add these to your `.env` file or export them in your terminal:

```bash
# Enable SSO
export SSO_ENABLED=true
export SSO_PROTOCOL=oauth2

# Client Credentials (from provisioned-config.json)
export SSO_CLIENT_ID=syngrisi-e2e-app
export SSO_CLIENT_SECRET=syngrisi-test-secret-12345

# Logto Endpoints
export SSO_AUTHORIZATION_URL=http://localhost:3001/oidc/auth
export SSO_TOKEN_URL=http://localhost:3001/oidc/token
export SSO_USERINFO_URL=http://localhost:3001/oidc/me

# App Config
export SSO_CALLBACK_URL=/v1/auth/sso/oauth/callback
export SSO_DEFAULT_ROLE=reviewer
```

### Option B: SAML Configuration

```bash
# Enable SSO
export SSO_ENABLED=true
export SSO_PROTOCOL=saml

# SAML Config (from provisioned-config.json)
export SSO_ENTRY_POINT=http://localhost:3001/api/saml/yfole0mc7clyngw2t89ty/authn
export SSO_ISSUER=syngrisi-e2e-sp
export SSO_IDP_ISSUER=http://localhost:3001/saml/yfole0mc7clyngw2t89ty
# Note: SSO_CERT is also required, copy it from e2e/support/sso/provisioned-config.json
```

## 4. Test Credentials

Use these credentials to log in on the Logto page:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| **Test User** | `testuser` | `Test123!` | `test@syngrisi.test` |

**Note:** The sign-in form is configured to accept **Username**, not Email.

## 5. Testing Flow

1.  Start Syngrisi: `npm run start:dev` (ensure env vars from Step 3 are set).
2.  Open Syngrisi: [http://localhost:3000](http://localhost:3000).
3.  You should see the **"Login with SSO"** button.
4.  Click it. You will be redirected to Logto (`localhost:3001`).
5.  Enter credentials:
    *   Username: `testuser`
    *   Password: `Test123!`
6.  You should be redirected back to Syngrisi and logged in.
7.  Verify your role is `reviewer` (default) or whatever you set in `SSO_DEFAULT_ROLE`.

## 6. Cleanup

To stop the Logto containers and clean up resources:

```bash
./e2e/support/sso/stop-containers.sh
```
