# Staging Testing Guide

Russian version: `packages/syngrisi/docs/staging-testing-guide.md`.

## Overview
Staging is a separate Syngrisi instance with production-like data. It runs from a git worktree, its own DB, port, and shared read-only baselines.

## Config file
- Create `packages/syngrisi/.env.staging` from `.env.staging.example`.
- Do not commit this file. Scripts read it and copy it to the staging worktree, generating the app `.env`.
- Key variables: `STAGING_WORKTREE_PATH`, `STAGING_DB_NAME`, `STAGING_PORT`, `STAGING_MONGODB_URI`, `STAGING_PROD_DATA_PATH`, `STAGING_BASELINES_PATH`, `STAGING_DATA_REPO_PATH`, `STAGING_HOSTNAME`, `STAGING_AUTH_ENABLED`, `STAGING_LOG_LEVEL`, `STAGING_TMP_DIR`, `STAGING_REGULAR_USER_EMAIL`, `STAGING_REGULAR_USER_PASSWORD`, `STAGING_ADMIN_USERNAME`, `STAGING_ADMIN_PASSWORD`, `STAGING_GUEST_PASSWORD`.

## Environment details
- Isolation: git worktree + dedicated DB + dedicated port.
- Worktree: `STAGING_WORKTREE_PATH`.
- DB: `STAGING_DB_NAME` at `STAGING_MONGODB_URI`.
- Port: `STAGING_PORT`.
- Baselines: `STAGING_BASELINES_PATH` (read-only).
- Data source: dump at `STAGING_PROD_DATA_PATH`; baselines repo `STAGING_DATA_REPO_PATH` (commit `init`).

### Dev vs Staging
| Aspect | Dev | Staging |
| --- | --- | --- |
| Port | 3000 | `STAGING_PORT` |
| DB | SyngrisiDb | `STAGING_DB_NAME` |
| Data | Mock/test | Production dump |
| Images | `./.snapshots-images` | `STAGING_BASELINES_PATH` |
| Env | NODE_ENV=development | NODE_ENV=production |

## Quick start
1) Copy and fill `packages/syngrisi/.env.staging`.
2) From `packages/syngrisi`: `./scripts/staging-control.sh setup`
   - Creates worktree at `STAGING_WORKTREE_PATH`
   - Installs deps, builds app
   - Copies `.env.staging` into worktree and builds `.env`
   - Restores DB to `STAGING_DB_NAME`
3) Start: `./scripts/staging-control.sh start` (URL `http://localhost:${STAGING_PORT}`)
4) Stop: `./scripts/staging-control.sh stop`
5) Reset: `./scripts/staging-control.sh reset` (drops DB, resets baselines repo, cleans temp/logs)
6) Status: `./scripts/staging-control.sh status`
7) Logs: `./scripts/staging-control.sh logs`

## Test accounts
- Regular: `STAGING_REGULAR_USER_EMAIL` / `STAGING_REGULAR_USER_PASSWORD`
- Admin: `STAGING_ADMIN_USERNAME` / `STAGING_ADMIN_PASSWORD`
- Guest password: `STAGING_GUEST_PASSWORD`

## MCP Test Engine Integration

### test_engine vs staging_test_engine

| Aspect | test_engine | staging_test_engine |
|--------|-------------|---------------------|
| Directory | `/packages/syngrisi` | `STAGING_WORKTREE_PATH` |
| Database | `SyngrisiDbTest{N}` (isolated) | `VRSdb_stage` (production data) |
| Auth | Disabled (for speed) | Enabled (`SYNGRISI_AUTH=true`) |
| Data | Empty/minimal | Production data |
| Port | 3002+ | `STAGING_PORT` (5252) |

### Key variable: E2E_USE_ENV_CONFIG

For staging MCP, set `E2E_USE_ENV_CONFIG=true` which:
- Disables forced override of DB to test database
- Uses `SYNGRISI_DB_URI` and `SYNGRISI_IMAGES_PATH` from staging `.env`
- Preserves `SYNGRISI_AUTH=true` from config

This variable is automatically set when using `start-claude-with-staging-mcp.sh` or when configured in `.mcp.json`.

### .mcp.json config for staging

```json
{
    "mcpServers": {
        "staging_test_engine": {
            "type": "stdio",
            "command": "npx",
            "args": ["tsx", "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e/support/mcp/bridge-cli.ts"],
            "env": {
                "SYNGRISI_ROOT": "${STAGING_WORKTREE_PATH}/packages/syngrisi/e2e",
                "E2E_USE_ENV_CONFIG": "true"
            }
        }
    }
}
```

### Launch Claude Code with staging MCP

Recommended: `./scripts/staging/start-claude-with-staging-mcp.sh`

This script verifies staging server is running, generates temp `.mcp.json`, and launches Claude Code.

### Auth flow samples (Gherkin)
```gherkin
Given I navigate to "http://localhost:${STAGING_PORT}"
When I fill in "email" with "<STAGING_REGULAR_USER_EMAIL>"
And I fill in "password" with "<STAGING_REGULAR_USER_PASSWORD>"
And I click on button with text "Login"
Then I should see "Dashboard"
```

```gherkin
When I click on user menu
And I click on "Logout"
Then I should see login page
When I fill in "email" with "<STAGING_ADMIN_USERNAME>"
And I fill in "password" with "<STAGING_ADMIN_PASSWORD>"
And I click on button with text "Login"
Then I should see admin navigation
```

## Logs and monitoring
- Server logs: `./scripts/staging-control.sh logs`
- Browser: look for clean Console; Network calls to `http://localhost:${STAGING_PORT}/api/v1/*` without 404/500; images under `/snapshoots/*`.
- Expect server logs to show DB `STAGING_DB_NAME`, images `STAGING_BASELINES_PATH`, port `STAGING_PORT`.

## Data management
- Reset when DB is dirty, baselines change, or config drifts.
- Staging keeps changes until reset (DB records, accepted baselines, logs, temp files).
- Disk checks:
  - `mongosh "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}" --eval "db.stats().dataSize"`
  - `du -sh "${STAGING_BASELINES_PATH}"`
  - `du -sh "${STAGING_TMP_DIR:-${STAGING_WORKTREE_PATH}/packages/syngrisi/.tmp-stage}"`
  - `du -sh "${STAGING_WORKTREE_PATH}/packages/syngrisi/logs"`

## Troubleshooting
- **nvm/fnm conflict (exit code 11)**: Scripts exit with code 11 silently when both fnm and nvm are installed. Run `unset npm_config_prefix` before executing scripts: `unset npm_config_prefix && ./scripts/staging-control.sh setup`. Scripts include this fix internally, but it may not work if the variable is set in the parent shell.
- Port busy: `lsof -i :"${STAGING_PORT}"` → stop server or kill the PID.
- DB connection fails: ensure MongoDB at `STAGING_MONGODB_URI`.
- Worktree missing: `./scripts/staging-control.sh setup` or `git worktree add "${STAGING_WORKTREE_PATH}" <branch/commit>`.
- Images missing: `ls -la "${STAGING_BASELINES_PATH}"`; check `.env` in worktree for `SYNGRISI_IMAGES_PATH`.
- Build fails: `cd "${STAGING_WORKTREE_PATH}/packages/syngrisi" && rm -rf node_modules dist && npm run install:all && npm run build`.
- Performance: `mongosh "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}" --eval "db.stats()"`, `db.checks.getIndexes()`, tail logs for slow queries.

## Cleanup
```bash
./scripts/staging-control.sh stop
git worktree remove "${STAGING_WORKTREE_PATH}" --force
mongosh "${STAGING_MONGODB_URI}/${STAGING_DB_NAME}" --eval "db.dropDatabase()"
cd "${STAGING_DATA_REPO_PATH}" && git reset --hard init && git clean -fd
```

## Demo Scenarios

Demo scenarios are used for interactive demonstration of application functionality with visual hints and annotations.

### Demo Scenario Naming Rules

⚠️ **IMPORTANT**: You **CANNOT** use a colon after the word "Demo" in demo scenario names.

**Correct** ✅:
```gherkin
Scenario: Demo - Database pollution with E2E data
Scenario: Demo - Creating check via API
Scenario: Demo - Image preview visibility
```

**Incorrect** ❌:
```gherkin
Scenario: Demo: Database pollution with E2E data
Scenario: Demo: Creating check via API
```

**Reason**: Colon in Gherkin is used to separate the keyword (Scenario) from the name. Using an additional colon can cause parsing issues and confusion when reading reports.

### Demo Scenario Structure

Demo scenarios typically contain:
- 🎤 **Announce steps** - voice/text announcements for the viewer
- 🔦 **Highlight steps** - visual highlighting of elements
- ⏸️ **Pause steps** - pauses to emphasize attention
- 🧹 **Cleanup steps** - cleaning up test data

### File Locations

Demo scenarios are located in:
- `packages/syngrisi/e2e/features/demo/` - main demos
- `packages/syngrisi/e2e-staging/features/demo/` - staging demos

## E2E Staging Tests

Staging tests are categorized by their impact on data:

### Test Categories

| Category | Tag | Description | Count |
|----------|-----|-------------|-------|
| Read-only | `@readonly` | Only read data, no modifications | 22 |
| Read-write | `@readwrite` | Modify data but cleanup after | 3 |
| Polluting | `@polluting` | Demo tests that leave data (run last) | 3 |

### Running Tests

**Bash scripts** (from `packages/syngrisi`):
```bash
# Individual categories
./scripts/staging/run-readonly-tests.sh
./scripts/staging/run-readwrite-tests.sh
./scripts/staging/run-polluting-tests.sh

# Full cycle (correct order: readonly → readwrite → polluting)
./scripts/staging/run-all-staging-tests.sh
```

**npm scripts**:
```bash
npm run staging:test:readonly
npm run staging:test:readwrite
npm run staging:test:polluting
npm run staging:test:all
```

**Manual execution** (from e2e-staging folder):
```bash
cd /path/to/SYNGRISI_STAGE/packages/syngrisi/e2e-staging
export SKIP_DEMO_TESTS=true
npx bddgen
npx playwright test --grep "@readonly"
```

### Test Accounts
- Regular user 1: `STAGING_REGULAR_USER_EMAIL` / `STAGING_REGULAR_USER_PASSWORD`
- Regular user 2: `STAGING_REGULAR_USER_2_EMAIL` / `STAGING_REGULAR_USER_2_PASSWORD`
- Admin: `STAGING_ADMIN_USERNAME` / `STAGING_ADMIN_PASSWORD`
- API Key: `STAGING_API_KEY` (for SDK operations)

### Claude Code TUI Commands
- `/staging-readonly` — run read-only tests
- `/staging-readwrite` — run read-write tests
- `/staging-polluting` — run polluting tests
- `/staging-demo` — interactive demo mode

## References
- E2E features: `packages/syngrisi/e2e/features/CHECKS_HANDLING/`
- E2E staging: `packages/syngrisi/e2e-staging/features/`
- Env vars: `packages/syngrisi/docs/environment_variables.md`
- Server config: `packages/syngrisi/src/server/config.ts`
- API docs: http://localhost:${STAGING_PORT}/swagger/ (when running)
- Investigation report: `packages/syngrisi/docs/investigations/staging-e2e-report-2024-12-05.md`
