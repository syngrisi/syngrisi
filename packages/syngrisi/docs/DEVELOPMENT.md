# Development Guide

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
