# Syngrisi E2E Test Framework

This directory contains the Playwright BDD e2e test framework for Syngrisi.

## Structure

-   `features/` - Gherkin feature files
-   `steps/` - Step definitions
    -   `common/` - Common step definitions (actions, assertions, debug, llm)
    -   `domain/` - Domain-specific step definitions for Syngrisi
    -   `helpers/` - Helper utilities (locators, assertions, template, types)
-   `support/` - Support files
    -   `fixtures/` - Playwright fixtures (app-server, test-data, test-manager, log-attachment)
    -   `utils/` - Utility functions (app-server, common, fs)
    -   `lib/` - Libraries (logger)
    -   `params.ts` - BDD parameter type definitions
    -   `global-setup.ts` - Global test setup

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the Syngrisi server (if not already built):

```bash
cd ../..
npm run build
```

## Running Tests

```bash
# Run all e2e tests
npm run test:e2e

# Run smoke tests
npm run test:e2e:smoke

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## Configuration

Environment variables can be set in `.env` file or passed directly:

-   `E2E_BASE_URL` - Base URL for tests (default: http://localhost:5100)
-   `E2E_BACKEND_HOST` - Backend host (default: localhost)
-   `SYNGRISI_DISABLE_FIRST_RUN` - Disable first run setup (default: true)
-   `SYNGRISI_AUTH` - Enable authentication (default: false)
-   `SYNGRISI_COVERAGE` - Enable coverage collection (default: false)
-   `DOCKER` - Run in Docker mode (default: 0)
-   `PLAYWRIGHT_HEADED` - Run in headed mode (default: false)
-   `PLAYWRIGHT_WORKERS` - Number of parallel workers (default: 1)
