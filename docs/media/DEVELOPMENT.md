# Development Guide

## Architecture Reference

For a detailed explanation of how the main UI and backend exchange data, how the tests grid works, how check details are structured, how frontend polling and queues behave, and how state is stored, see:

- [UI and Backend Data Flow Architecture](./ARCHITECTURE_UI_BACKEND_DATA_FLOW.md)
- [Network Request Measurement Checklist](./NETWORK_REQUEST_MEASUREMENT_CHECKLIST.md)

## Starting the Server

To start the server in development mode with **Authentication enabled**, **Auto-rebuild**, and **Test Users seeded**, run:

```bash
yarn start:dev
```

This script executes:
```bash
cross-env SYNGRISI_AUTH=true SYNGRISI_TEST_MODE=true SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE=true npx tsup --watch --onSuccess "node ./dist/server/server.js"
```

### Features of `yarn start:dev`
*   **Incremental Build**: Uses `tsup --watch` to recompile only changed files.
*   **Auto Restart**: Automatically restarts the server (via `--onSuccess`) when compilation completes.
*   **Authentication**: Enabled via `SYNGRISI_AUTH=true`.
*   **Test Mode**: Enabled via `SYNGRISI_TEST_MODE=true`. This triggers the creation of test users from `src/seeds/testUsers.json`.
*   **Schedulers**: Enabled via `SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE=true` (normally disabled in test mode).

---

## User Seeding & Credentials

When running in **Test Mode** (`SYNGRISI_TEST_MODE=true`), the server automatically seeds the database with users defined in `src/seeds/testUsers.json` if they do not already exist.

### Default Test Users

Use these credentials to log in during development:

| Role | Username | Password | API Key |
| :--- | :--- | :--- | :--- |
| **Admin** | `Test` | `123456aA-` | `3c9909afec...` |
| **Admin** | `testadmin@test.com` | `Test-123` | `db6e323f7f...` |
| **Reviewer** | `testreviewer@test.com` | `Test-123` | `9aa20a336f...` |
| **User** | `testuser@test.com` | `Test-123` | `c45d0a87c4...` |

> **Note**: Passwords for `*.test.com` users default to `Test-123` unless specified otherwise in the seed file. The `Test` admin user has a specific password set in the seed file.

### Basic Users

The system also creates two default users if they don't exist (configured in `src/server/lib/startup/createBasicUsers.ts`):

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `Administrator` | `Administrator` (or `ADMIN_PASSWORD` env) |
| **Guest** | `Guest` | `Guest` (or `GUEST_PASSWORD` env) |

---

## Modifying Seed Data

To add or modify test users, edit:
`packages/syngrisi/src/seeds/testUsers.json`

The server will create new users from this file upon restart if they don't exist in the database.

---

## Baseline Tolerance Threshold

Syngrisi supports `toleranceThreshold` as a percent value on a specific baseline.

### Behavior

- `0` means disabled.
- Allowed range: `0..100`.
- If `rawMisMatchPercentage <= toleranceThreshold`, the check is stored as `passed`.
- `wrong_dimensions` still forces `failed`, even if the threshold is high.
- The real mismatch value is still stored in `check.result`.
- When a new baseline is accepted for the same ident, the previous baseline's `toleranceThreshold` is inherited.

### UI

In Check Details, open the same dropdown that contains `Auto-ignore Mode`.

From there you can:

- edit `Tolerance threshold (%)` manually
- use `Auto-calc` to set `threshold = currentDiff + 0.01`
- save and immediately re-compare the current check

If a threshold is active, the check header shows a dedicated tolerance indicator.
If a check passed because of tolerance, the status tooltip shows `passed by tolerance`.

### API

#### Update a baseline threshold

```bash
curl -X PUT http://localhost:3000/v1/baselines/<baselineId> \
  -H 'Content-Type: application/json' \
  -H 'apikey: <apiKey>' \
  -d '{"toleranceThreshold":0.6}'
```

#### Re-compare a check with current baseline settings

```bash
curl -X POST http://localhost:3000/v1/checks/<checkId>/recompare \
  -H 'apikey: <apiKey>'
```

This reuses the current baseline settings, including:

- `matchType`
- `ignoreRegions`
- `toleranceThreshold`

#### Set threshold while creating a check via client API

```bash
curl -X POST http://localhost:3000/v1/client/createCheck \
  -H 'Content-Type: application/json' \
  -H 'apikey: <apiKey>' \
  -d '{
    "testid":"<testId>",
    "name":"Login page",
    "appName":"My App",
    "branch":"main",
    "suitename":"Smoke",
    "viewport":"1366x768",
    "browserName":"chrome",
    "browserVersion":"125",
    "browserFullVersion":"125.0.6422.142",
    "os":"macOS",
    "hashcode":"<snapshotHash>",
    "toleranceThreshold":0.6
  }'
```

If a baseline already exists for the same ident, this request applies the threshold to that baseline before comparison.
