# Running E2E Tests (Syngrisi)

Target: `packages/syngrisi/e2e` Playwright BDD suite. Always regenerate step glue before each run.

## Quick commands
- Prep: `cd packages/syngrisi/e2e`
- Regenerate steps: `npm run bddgen` (or `npx bddgen`)
- Single feature/scenario (headless, 1 worker):
  ```bash
  npx bddgen && yarn playwright test "features/<PATH>.feature" --grep "<Scenario name>" --workers=1
  ```
- Parallel run:
  ```bash
  npx bddgen && yarn playwright test "features/<PATH>.feature" --grep "<Scenario name>" --workers=2
  ```
- Smoke suite:
  ```bash
  npm run test:smoke
  ```
- Headed debug:
  ```bash
  npx bddgen && yarn playwright test "features/<PATH>.feature" --grep "<Scenario name>" --workers=1 --headed
  ```

## Notes
- Use supported local steps, e.g., `I click element with label "<Text>"`, `I fill "<value>" into element with label "<Field>"`, `I fill "<value>" into textbox "<Name>"`, `the button "<Name>" should be visible/enabled`, `the element with locator "<css>" should be visible`, `I wait for "<N>" seconds`.
- Use semantic selectors; if missing, fix UI (see `update-app-layout.md`).
- Keep logs/screenshots under `packages/syngrisi/e2e/test-results` or `reports/`.
- If steps change, restart MCP sessions to refresh catalogs.
