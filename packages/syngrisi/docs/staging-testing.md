# Staging Testing Guide

This document describes how to run tests against the staging environment with production data.

## Overview

Staging tests run against a separate Syngrisi instance (port 5252) that uses production data. This allows testing real-world scenarios without affecting the production environment.

## Prerequisites

1. **Staging environment set up**
   ```bash
   npm run staging:setup  # One-time setup
   ```

2. **Production data available**
   - Database dump in `STAGING_PROD_DATA_PATH`
   - Baselines in `STAGING_BASELINES_PATH`

3. **Staging server running**
   ```bash
   npm run staging:start
   ```

## Test Suites

### Smoke Tests (`staging-smoke`)

Quick validation tests for core functionality:
- Login/logout
- Dashboard access
- Basic check operations
- Production data visibility

**Run:**
```bash
npm run staging:test:smoke
```

### Extended Tests (`staging-extended`)

Comprehensive tests:
- Bulk operations (select all, bulk accept)
- Data integrity verification
- Filtering and sorting
- Image loading validation

**Run:**
```bash
npm run staging:test:extended
```

### Maintenance Tests (`staging-maintenance`)

Admin and maintenance task tests:
- Database consistency checks
- Orphan file detection
- Task execution via API

**Run:**
```bash
npm run staging:test:maintenance
```

## Test Workflow

### Standard Workflow

```bash
# 1. Reset staging to clean production state
npm run staging:reset

# 2. Start staging server
npm run staging:start

# 3. Run smoke tests first
npm run staging:test:smoke

# 4. If smoke passes, run extended tests
npm run staging:test:extended

# 5. Run maintenance tests (may modify data)
npm run staging:test:maintenance
```

### Reset Between Test Runs

**Important:** Run `npm run staging:reset` before each test run to ensure consistent starting state.

The reset command:
1. Stops the staging server
2. Drops the staging database
3. Restores database from production dump
4. Restores baselines from backup
5. Does NOT restart the server (run `npm run staging:start` manually)

## Running Tests

### All Suites
```bash
npm run staging:test
```

### Specific Suite
```bash
npm run staging:test:smoke
npm run staging:test:extended
npm run staging:test:maintenance
```

### Headed Mode (Visible Browser)
```bash
bash scripts/staging/run-staging-tests.sh smoke --headed
```

### Debug Mode
```bash
bash scripts/staging/run-staging-tests.sh smoke --debug
```

## Test Configuration

### Playwright Config
- **File:** `e2e/playwright.staging.config.ts`
- **Base URL:** `http://localhost:5252`
- **Workers:** 1 (sequential execution)
- **Retries:** 0 (tests should be stable)

### Credentials

Credentials are read from `.env.staging`:
- `STAGING_REGULAR_USER_EMAIL` - Reviewer user
- `STAGING_REGULAR_USER_PASSWORD`
- `STAGING_ADMIN_USERNAME` - Admin user
- `STAGING_ADMIN_PASSWORD`

## Test Files Structure

```
e2e/
├── playwright.staging.config.ts      # Staging-specific config
├── support/
│   ├── staging-global-setup.ts       # Verifies staging is running
│   └── fixtures/
│       └── staging-server.fixture.ts # Staging server fixture
├── steps/
│   └── staging/
│       └── staging.steps.ts          # Staging-specific steps
└── features/
    └── STAGING/
        ├── smoke/
        │   ├── login.feature
        │   └── check_operations.feature
        ├── extended/
        │   ├── bulk_operations.feature
        │   └── data_integrity.feature
        └── maintenance/
            └── cleanup_tasks.feature
```

## Writing New Staging Tests

### 1. Use `@staging` and `@no-app-start` tags

```gherkin
@staging @smoke @no-app-start
Feature: My Staging Test
```

- `@staging` - Marks test as staging-specific
- `@no-app-start` - Prevents automatic server startup (uses existing staging server)

### 2. Use Staging-Specific Steps

```gherkin
Given I open the staging app
And I am logged in as "reviewer" on staging
```

### 3. Available Steps

| Step | Description |
|------|-------------|
| `I open the staging app` | Navigate to staging URL |
| `I am logged in as "{role}" on staging` | Login as "reviewer" or "admin" |
| `I login to staging with email "{email}" and password "{pass}"` | Login with custom credentials |
| `I should see the main dashboard` | Verify dashboard is visible |
| `I should see production data in the runs list` | Verify runs exist |
| `I navigate to baselines page on staging` | Go to /baselines |
| `I navigate to admin page on staging` | Go to /admin |
| `I logout from staging` | Logout |
| `I run the "{task}" task on staging` | Run admin task via API |
| `there should be at least {n} checks on staging` | Verify check count |

## Troubleshooting

### Staging server not running

```
ERROR: Staging server is not running!
```

**Solution:** Start staging with `npm run staging:start`

### Login fails

Check credentials in `.env.staging` and verify they match production users.

### Tests timeout

1. Check staging server logs
2. Verify database connection
3. Run with `--debug` flag

### Data inconsistency

Run `npm run staging:reset` to restore clean state.

## Reports

Test reports are saved to:
- HTML: `e2e/reports/staging-html/index.html`
- JSON: `e2e/reports/staging-json/results.json`
- Artifacts: `e2e/reports/staging-artifacts/`
