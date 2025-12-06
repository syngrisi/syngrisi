# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Install dependencies
npm install

# Run full E2E suite (parallel + SSO + flaky tests)
npm test

# Run smoke tests
npm run test:smoke

# Run in headed mode (visible browser)
npm run test:headed

# Run demo tests (headed mode, single worker)
npm run test:demo

# Run specific feature file (ALWAYS run bddgen first)
npx bddgen && npx playwright test --project=chromium "features/CHECKS_HANDLING/accept_by_user.feature" --grep "Accept by user" --workers=2

# Run in headed mode with single worker
npx bddgen && npx playwright test --project=chromium "features/path/to/file.feature" --grep "Scenario name" --workers=1 --headed

# Verify test stability after fixing (REQUIRED)
npx bddgen && npx playwright test --project=chromium "features/path/to/file.feature" --grep "Test name" --workers=3 --repeat-each=4

# Run MCP test engine tests
npm run test:mcp
```

## Architecture

### Directory Structure
- `features/` - Gherkin feature files organized by area (AP, AUTH, CHECKS_HANDLING, CP, DEMO, MIXED)
- `steps/` - Step definitions
  - `common/` - Reusable steps (actions, assertions, debug, llm, polling)
  - `domain/` - Syngrisi-specific steps (auth, checks, navigation, server, sso)
  - `helpers/` - Utilities (locators, assertions, template, types)
- `support/` - Framework support files
  - `fixtures/` - Playwright fixtures (app-server, test-data, test-manager, sso-server, test-engine)
  - `utils/` - Utilities (app-server, common, fs, http-client)
  - `lib/` - Logger
  - `mcp/` - MCP test engine integration
  - `sso/` - SSO testing infrastructure (Logto)

### Key Files
- `playwright.config.ts` - Main Playwright config (uses playwright-bdd)
- `playwright-native.config.ts` - Base Playwright configuration
- `config.ts` - Environment variables and test configuration
- `support/fixtures/index.ts` - Merged fixtures export with BDD helpers (Given, When, Then)
- `support/params.ts` - BDD parameter type definitions

### Path Aliases (tsconfig.json)
```
@config → config.ts
@pw-native-config → playwright-native.config.ts
@fixtures → support/fixtures/index
@helpers/* → steps/helpers/*
@utils/* → support/utils/*
@lib/* → support/lib/*
@params → support/params
@sso → support/sso/index
```

### Test Categories & Projects
- **chromium** (default project): All tests except DEMO folder
- **demo** project: Only `features/DEMO/` folder, runs in headed mode

Test tags:
- **Regular tests**: Run with 10 workers in parallel (`--project=chromium`)
- **SSO tests**: Tagged `@saml`, `@sso-external`, `@sso-logto` - run with 1 worker
- **Flaky tests**: Tagged `@flaky` - run separately with 3 workers
- **Demo tests**: Tagged `@demo` - separate project, run with `npm run test:demo` or `--project=demo`
- **Smoke tests**: Tagged `@smoke` - quick validation subset

## Strict Rules for E2E Tests

### NEVER Do
- Modify `playwright.config.ts` timeouts without user consent
- Add `waitForTimeout()` to mask timing issues
- Change assertions to match wrong behavior
- Use CSS/XPath selectors when ARIA roles or labels are available
- Increase timeouts without investigating root cause

### Selector Priority (STRICT ORDER)
1. ARIA roles — `When I click element with locator "button[aria-label='Add New User']"`
2. Labels — `When I fill "email@test.com" into element with label "Email"`
3. Text — `Then the element "[data-check-status-name='CheckName'] span" matches the text "NEW"`
4. TestID (only if above unavailable)
5. CSS/XPath (very rare, only if above unavailable)

### When Tests Fail
1. Capture actual vs expected state
2. Add debug logging
3. Analyze selector, timing, app behavior
4. Report: "STOP: [failure reason]. Options: A) [action1] B) [action2]. Awaiting approval."
5. WAIT for user response

### After Fixing Tests
ALWAYS verify stability with concurrent execution:
```bash
npx bddgen && npx playwright test "features/path/file.feature" --grep "Test name" --workers=3 --repeat-each=4
```

## Environment Variables

Key variables (see `config.ts` for full list):
- `E2E_BASE_URL` - Base URL (default: http://localhost:3002)
- `E2E_BACKEND_HOST` - Backend host (default: localhost)
- `PLAYWRIGHT_HEADED` - Run in headed mode (default: false)
- `PLAYWRIGHT_WORKERS` - Parallel workers (default: 4)
- `E2E_DEBUG` - Pause browser on failure
- `E2E_REUSE_SERVER` - Keep server between tests (default: true)

## Documentation Links

- `../docs/agent/guides/run_test.md` - Running tests
- `../docs/agent/guides/selector_best_practices.md` - Selector patterns
- `../docs/agent/guides/mcp_test_engine_using.md` - MCP test engine
- `../docs/agent/guides/common_steps_cheatsheet.md` - Most-used steps
- `../docs/agent/guides/manage-flaky-tests.md` - Flaky test strategy
