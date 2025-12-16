# SSO Test Infrastructure

This module provides utilities for managing Logto SSO infrastructure during E2E testing using Apple's container CLI.

## Overview

The SSO test infrastructure uses:
- **Postgres 14** - Database for Logto
- **Logto** - Open-source identity solution (OIDC provider)
- **Apple Container CLI** - Container runtime for macOS

## Prerequisites

1. **Apple Container CLI** installed:
   ```bash
   # Install via Homebrew (when available) or from source
   # See: https://github.com/apple/containerization
   ```

2. **Node.js v20+** for running the helper scripts

## Quick Start

### Option 1: Automatic via @sso-logto tag (Zero Setup)

Use the `@sso-logto` tag - the fixture will automatically:
1. Start Postgres and Logto containers
2. Run provisioning (create app, user, configure sign-in)
3. Stop containers after test (unless `E2E_REUSE_LOGTO=true`)

```gherkin
@sso-logto @slow
Feature: SSO Authentication with Logto

    Scenario: User logs in via SSO
        When I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"
        Given I start Server
        When I open the app
        And I click SSO login button
        And I login to Logto with username "testuser" and password "Test123!"
        Then I should be redirected back to the app
        Then I should be authenticated via SSO
```

**Note:** First run takes ~60-90 seconds (container startup + provisioning).

### Option 2: External Logto via @sso-external tag (Faster)

For faster iteration during development:

```bash
# 1. Start Logto once (stays running)
./e2e/support/sso/setup-logto.sh

# 2. Run tests (fast, ~25 seconds)
npm run test:e2e -- --grep "@sso-external"

# 3. Stop when done
./e2e/support/sso/stop-containers.sh
```

```gherkin
@sso-external @slow
Feature: SSO Authentication with External Logto
    # Expects Logto to be already running on localhost:3001
```

### Comparison

| Tag | Startup Time | Manual Setup | Best For |
|-----|--------------|--------------|----------|
| `@sso-logto` | ~90 sec | None | CI/CD, one-off runs |
| `@sso-external` | ~25 sec | `setup-logto.sh` | Development, debugging |

### Manual Start (for debugging)

```bash
# Start containers only (no provisioning)
./e2e/support/sso/start-containers.sh

# Run provisioning separately
./e2e/support/sso/provision-logto-api.sh

# Stop containers
./e2e/support/sso/stop-containers.sh
```

## Pre-flight Checklist

**Before running SSO tests**, verify the infrastructure is ready. This helps avoid test failures due to infrastructure issues.

### Automated Health Check (Recommended)

Run the health check script:

```bash
cd packages/syngrisi/e2e/support/sso
./check-health.sh
```

This script verifies all components and provides clear fix instructions if something is wrong.

### Manual Health Check

Alternatively, run these commands from the `e2e/support/sso/` directory:

```bash
# 1. Verify Apple Container service is running
container system info

# 2. Check containers are running
container list | grep syngrisi-test

# 3. Verify Logto is responding
curl -s http://localhost:3001/oidc/.well-known/openid-configuration | head -c 100

# 4. Verify database connection
container exec syngrisi-test-db-sso psql -U logto -d logto -c "SELECT 1;"

# 5. Verify test user exists
container exec syngrisi-test-db-sso psql -U logto -d logto -tAc \
  "SELECT username FROM users WHERE username='testuser';"

# 6. Verify OIDC app is registered
container exec syngrisi-test-db-sso psql -U logto -d logto -tAc \
  "SELECT id FROM applications WHERE id='syngrisi-e2e-app';"
```

### Expected Results

| Check | Expected Output |
|-------|-----------------|
| Container service | No error, shows system info |
| Containers running | `syngrisi-test-sso` and `syngrisi-test-db-sso` listed |
| Logto responding | JSON starting with `{"issuer":"http://localhost:3001/oidc"` |
| Database connection | Returns `1` |
| Test user | Returns `testuser` |
| OIDC app | Returns `syngrisi-e2e-app` |

### If Checks Fail

| Problem | Solution |
|---------|----------|
| Container service not running | `container system start` |
| Containers not running | `./setup-logto.sh` |
| Logto not responding | Wait 30 seconds, check `container logs syngrisi-test-sso` |
| User/app missing | `./provision-logto-api.sh` |

## Running SSO Tests

### Recommended Workflow

```bash
# 1. Navigate to SSO support directory
cd packages/syngrisi/e2e/support/sso

# 2. Start infrastructure (first time or after reboot)
./setup-logto.sh

# 3. Run quick health check
curl -s http://localhost:3001/oidc/.well-known/openid-configuration | head -c 100
# Should show JSON with "issuer"

# 4. Navigate to e2e directory
cd ../../../

# 5. Run SSO tests
npx bddgen && npx playwright test --project=chromium "features/AUTH/SSO" --workers=1

# 6. (Optional) Stop infrastructure when done
cd support/sso && ./stop-containers.sh
```

### Running Specific Test Tags

```bash
# All SSO tests
npx bddgen && npx playwright test --grep "@sso" --workers=1

# Only OAuth2/OIDC tests
npx bddgen && npx playwright test --grep "@sso-external" --workers=1

# Only SAML tests
npx bddgen && npx playwright test --grep "@saml" --workers=1

# Only auto-managed Logto tests (slower, starts own containers)
npx bddgen && npx playwright test --grep "@sso-logto" --workers=1
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOGTO_PORT` | 3001 | Logto main port |
| `LOGTO_ADMIN_PORT` | 3050 | Logto admin console port (3050 to avoid conflict with Syngrisi E2E workers 3002-3020) |
| `LOGTO_POSTGRES_PORT` | 5433 | Postgres port for Logto |
| `E2E_REUSE_LOGTO` | **true** | Keep Logto running between tests (set to `false` in CI for clean state) |

### Syngrisi SSO Environment Variables

When using the `ssoServer.getSSOEnvVars()` helper, the following environment variables are set:

| Variable | Description |
|----------|-------------|
| `SSO_ENABLED` | Enable SSO authentication |
| `SSO_PROTOCOL` | OIDC protocol |
| `SSO_CLIENT_ID` | OIDC client ID |
| `SSO_CLIENT_SECRET` | OIDC client secret |
| `SSO_ISSUER` | OIDC issuer URL |
| `SSO_AUTHORIZATION_ENDPOINT` | Authorization endpoint |
| `SSO_TOKEN_ENDPOINT` | Token endpoint |
| `SSO_USERINFO_ENDPOINT` | User info endpoint |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    E2E Test Process                          │
│                                                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  ssoServerFixture │    │ appServerFixture │              │
│  └────────┬─────────┘    └────────┬─────────┘              │
│           │                       │                         │
│           ▼                       ▼                         │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ logtoTestManager │    │  Syngrisi Server │              │
│  └────────┬─────────┘    └────────┬─────────┘              │
└───────────┼───────────────────────┼─────────────────────────┘
            │                       │
            ▼                       │
    ┌───────────────┐               │
    │ start-containers.sh          │
    └───────┬───────┘               │
            │                       │
            ▼                       │
    ┌───────────────────────────────┼───────────────┐
    │           Apple Container     │               │
    │  ┌─────────────┐  ┌─────────────────┐        │
    │  │  Postgres   │  │     Logto       │        │
    │  │  (5433)     │──│  (3001, 3050)   │←───────┘
    │  └─────────────┘  └─────────────────┘   OIDC Flow
    └───────────────────────────────────────────────┘
```

## Step Definitions

### Infrastructure Management

```gherkin
Given I start Logto SSO infrastructure
Given I stop Logto SSO infrastructure
Then Logto SSO should be available
```

### Configuration

```gherkin
When I configure SSO with client ID "client-id" and secret "secret"
```

### Authentication Flow

```gherkin
When I click SSO login button
When I login to Logto with username "testuser" and password "Test123!"
# Or with email (requires email sign-in configuration):
# When I login to Logto with email "user@test.com" and password "password123"
Then I should be redirected back to the app
Then I should be authenticated via SSO
```

## Pre-seeded Database (Recommended)

For reliable E2E tests, use a pre-seeded Logto database with:
1. A configured OIDC application
2. Test users

To create a seed:

```bash
# 1. Start fresh Logto
./start-containers.sh

# 2. Configure via Admin Console (http://localhost:3002)
#    - Create application with redirect URI: http://localhost:3002/v1/auth/sso/oidc/callback
#    - Create test user

# 3. Dump the database
container exec syngrisi-test-db-sso pg_dump -U logto logto > logto_seed.sql

# 4. Add the dump to the repo
mv logto_seed.sql e2e/support/sso/seeds/
```

Then update `start-containers.sh` to mount the seed:
```bash
container run -d \
  --name syngrisi-test-db-sso \
  -v ./seeds/logto_seed.sql:/docker-entrypoint-initdb.d/seed.sql \
  ...
```

## Troubleshooting

### Container CLI not found

```
[ERROR] Apple container CLI not found. Please install it first.
```

Install Apple container CLI from https://github.com/apple/containerization

### Logto startup timeout

If Logto fails to start within the timeout:
1. Check container logs: `container logs syngrisi-test-sso`
2. Verify Postgres is accessible: `container logs syngrisi-test-db-sso`
3. Increase timeout in `start-containers.sh`

### Port conflicts

If ports are in use:
```bash
export LOGTO_PORT=3003
export LOGTO_ADMIN_PORT=3004
./start-containers.sh
```

### Password authentication fails ("Incorrect account or password")

Logto uses **Argon2id** for password hashing, not bcrypt. Even though `password_encryption_method` may show "Bcrypt", you must use Argon2id hashes.

To generate a valid password hash:
```bash
container exec syngrisi-test-sso node -e "
const { argon2id } = require('/etc/logto/node_modules/.pnpm/hash-wasm@4.11.0/node_modules/hash-wasm');
const crypto = require('crypto');
argon2id({
  password: 'YOUR_PASSWORD',
  salt: crypto.randomBytes(16),
  parallelism: 1,
  iterations: 2,
  memorySize: 19456,
  hashLength: 32,
  outputType: 'encoded'
}).then(console.log);
"
```

Then update the user in the database:
```sql
UPDATE users SET
  password_encrypted = '\$argon2id\$v=19\$m=19456,t=2,p=1\$...',
  password_encryption_method = 'Argon2i'
WHERE primary_email = 'test@syngrisi.test';
```

### Invalid redirect_uri error

```
{"code":"oidc.invalid_redirect_uri","message":"redirect_uri did not match any of the client's registered redirect_uris"}
```

**Cause:** Mismatch between the redirect URI used by the test server and URIs registered in Logto.

The E2E tests use `E2E_BACKEND_HOST` (default: `127.0.0.1`) to construct the callback URL, but Logto might only have `localhost` registered.

**Solution:** The `provision-logto-api.sh` script registers both `localhost` and `127.0.0.1` variants for all worker ports (3002-3011). If you see this error:

1. Re-run provisioning to update redirect URIs:
   ```bash
   ./provision-logto-api.sh
   ```

2. Verify the registered URIs in the database:
   ```bash
   container exec syngrisi-test-db-sso psql -U logto -d logto -c \
     "SELECT oidc_client_metadata FROM applications WHERE id='syngrisi-e2e-app';"
   ```

3. The output should include both variants:
   - `http://localhost:3002/v1/auth/sso/oauth/callback`
   - `http://127.0.0.1:3002/v1/auth/sso/oauth/callback`

**Note:** If you manually configure Logto or use a different provisioning method, ensure both `localhost` and `127.0.0.1` URIs are registered.

### Invalid client error

```
{"code":"oidc.invalid_client","error_description":"invalid client syngrisi-e2e-app"}
```

**Cause:** The OIDC application is not registered in Logto, or the database was reset without re-running provisioning.

**Solution:**
1. Re-run the full setup:
   ```bash
   ./setup-logto.sh
   ```

2. Or just re-provision if containers are running:
   ```bash
   ./provision-logto-api.sh
   ```

### Container CLI connection errors

```
Error: interrupted: "XPC connection error: Connection invalid"
```

**Cause:** Apple Container system service is not running.

**Solution:**
```bash
container system start
```

## Files

| File | Description |
|------|-------------|
| `setup-logto.sh` | Full setup: start containers + provision |
| `start-containers.sh` | Start Postgres and Logto containers |
| `stop-containers.sh` | Stop and remove containers |
| `provision-logto-api.sh` | Provision via Management API |
| `check-health.sh` | **Pre-flight health check** - run before tests |
| `logto-manager.ts` | TypeScript manager with auto-provisioning |
| `sso-server.fixture.ts` | Playwright fixture for SSO tests |
| `index.ts` | Module exports |

## Default Test Credentials

After provisioning:

| User | Username | Email | Password |
|------|----------|-------|----------|
| Test User | `testuser` | `test@syngrisi.test` | `Test123!` |

**Note:** Sign-in is configured for **username** (not email) to avoid email verification requirements.

| App | Client ID | Client Secret |
|-----|-----------|---------------|
| syngrisi-e2e-test | `syngrisi-e2e-app` | `syngrisi-test-secret-12345` |

Credentials are saved to `provisioned-config.json` after provisioning.

### Redirect URIs

The OIDC app is configured with redirect URIs for E2E parallel workers. Both `localhost` and `127.0.0.1` variants are registered to support different `E2E_BACKEND_HOST` configurations:

**OAuth2/OIDC callbacks:**
- `http://localhost:3002/v1/auth/sso/oauth/callback` (worker 0)
- `http://127.0.0.1:3002/v1/auth/sso/oauth/callback` (worker 0, alternative)
- ... up to port 3011 (10 parallel workers × 2 host variants = 20 URIs)

**SAML ACS URL:**
- `http://127.0.0.1:3002/v1/auth/sso/saml/callback`

**Why both variants?** The `E2E_BACKEND_HOST` defaults to `127.0.0.1`, but some configurations use `localhost`. OAuth requires exact URI matching, so both must be registered.
