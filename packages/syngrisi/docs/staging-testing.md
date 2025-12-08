# Staging Testing Guide

This document describes how to run tests against the staging environment with production data.

## Overview

Staging tests run against a separate Syngrisi instance (port 5252) that uses production data. This allows testing real-world scenarios without affecting the production environment.

**Staging tests are located in a separate folder:** `e2e-staging/` (not in `e2e/`)

## Environment Variables

Staging configuration is stored in `.env.staging`:

```bash
STAGING_WORKTREE_PATH=/Users/a1/Projects/SYNGRISI_STAGE
STAGING_PORT=5252
```

## Quick Start Commands

All commands should be run from the staging worktree:

```bash
# Path to e2e-staging
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging
```

### Install Dependencies (first time)
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm install
```

### Run All Tests
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm test
```

### Run Smoke Tests
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:smoke
```

### Run Extended Tests
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:extended
```

### Run Demo Tests (Debug Mode)
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:demo:debug
```

### Run Demo Tests (Full Mode with Announcements)
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:demo
```

## Demo Tests - Individual Scenarios

### Demo: Preview Visibility Problem
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project demo --grep "preview"
```

### Demo: Database Pollution
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project demo --grep "pollution"
```

### Demo: API Check Creation
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && export SKIP_DEMO_TESTS=true && npx bddgen && npx playwright test --project demo --grep "api-creation"
```

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

### Smoke Tests (`smoke`)

Quick validation tests for core functionality:
- Login/logout
- Dashboard access
- Basic check operations
- Production data visibility

### Extended Tests (`extended`)

Comprehensive tests:
- Bulk operations (select all, bulk accept)
- Data integrity verification
- Filtering and sorting
- Check lifecycle (create, accept, delete via API)

### Demo Tests (`demo`)

Demonstration tests showing staging problems:
- Preview visibility issues with E2E test data
- Database pollution from E2E tests
- API check creation workflow

### Maintenance Tests (`maintenance`)

Admin and maintenance task tests:
- Database consistency checks
- Orphan file detection
- Task execution via API

## Test Workflow

### Standard Workflow

```bash
# 1. Reset staging to clean production state
npm run staging:reset

# 2. Start staging server
npm run staging:start

# 3. Run smoke tests first
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:smoke

# 4. If smoke passes, run extended tests
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:extended
```

### Reset Between Test Runs

**Important:** Run `npm run staging:reset` before each test run to ensure consistent starting state.

## Test Files Structure

```
e2e-staging/
├── playwright.config.ts          # Staging config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── support/
│   ├── fixtures.ts               # BDD fixtures
│   ├── logger.ts                 # Simple logger
│   ├── demo.steps.ts             # Demo announcement steps
│   └── staging-global-setup.ts   # Verifies staging is running
├── steps/
│   └── staging/
│       └── staging.steps.ts      # All staging steps
└── features/
    ├── smoke/
    │   ├── login.feature
    │   └── check_operations.feature
    ├── extended/
    │   ├── advanced_navigation.feature
    │   ├── bulk_operations.feature
    │   ├── check_lifecycle.feature
    │   └── data_integrity.feature
    ├── demo/
    │   └── staging_problems_demo.feature
    └── maintenance/
        └── cleanup_tasks.feature
```

## Writing New Staging Tests

### 1. Create feature file in appropriate folder

```gherkin
@smoke
Feature: My Staging Test

  Background:
    Given I open the staging app
    And I am logged in as "reviewer" on staging

  Scenario: Test something
    Given I should see the main dashboard
    ...
```

### 2. Available Steps

| Step | Description |
|------|-------------|
| `I open the staging app` | Navigate to staging URL |
| `I am logged in as "{role}" on staging` | Login as "reviewer" or "admin" |
| `I should see the main dashboard` | Verify dashboard is visible |
| `I should see production data in the runs list` | Verify runs exist |
| `I click on the first test row on staging` | Expand test row |
| `I should see check previews` | Verify previews visible |
| `I search for "{text}" in the quick filter on staging` | Filter by text |
| `I clear the quick filter on staging` | Clear filter |
| `I create a test check on staging with name "{name}"` | Create check via API |
| `I accept the created check on staging` | Accept check |
| `I cleanup staging test data` | Delete test data |
| `I navigate to baselines page on staging` | Go to /baselines |
| `I navigate to admin page on staging` | Go to /admin |
| `I logout from staging` | Logout |

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
3. Run with headed mode: `PLAYWRIGHT_HEADED=true npm test`

### Data inconsistency

Run `npm run staging:reset` to restore clean state.

## Reports

Test reports are saved to:
- HTML: `e2e-staging/reports/html/index.html`
- Artifacts: `e2e-staging/reports/artifacts/`
