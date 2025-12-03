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

## References
- E2E features: `packages/syngrisi/e2e/features/CHECKS_HANDLING/`
- Env vars: `packages/syngrisi/docs/environment_variables.md`
- Server config: `packages/syngrisi/src/server/config.ts`
- API docs: http://localhost:${STAGING_PORT}/swagger/ (when running)
