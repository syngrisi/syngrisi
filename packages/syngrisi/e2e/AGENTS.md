# E2E Framework Rules for AI Agents

## 🚨 CRITICAL PROTOCOL (Strict Enforcement)

**ANY violation = STOP + Ask User.**

1.  **Prohibitions:**
    -   **NEVER** modify global timeouts (`playwright.config.ts`) or use `waitForTimeout`.
    -   **NEVER** relax assertions or mask failures to make tests pass.
    -   **NEVER** use CSS/XPath unless _all_ other options are exhausted.
2.  **Mandatory Workflow:**
    -   **Failure:** STOP → Capture State (Actual vs Expected) → Debug (Logs) → Analyze Root Cause.
    -   **Report:** "STOP: [Reason]. Root cause: [Details]. Options: A) [Action] B) [Action]. Awaiting approval."
3.  **Flaky Tests:** Tag with `@flaky` (run separately). See `manage-flaky-tests.md`.

## 🎯 Selectors Strategy (STRICT ORDER)

1.  **ARIA Roles:** `role="button", name="..."` (Top Priority)
2.  **Labels:** `label="Email"`
3.  **Text:** `text="Submit"`
4.  **TestID:** `data-test="id"` (Fallback)
5.  **CSS/XPath:** ❌ **Last resort only.**

_If robust selector missing:_ **Modify source code** (`packages/syngrisi/src/ui-app`) to add ARIA roles, labels, semantic HTML (`<nav>`), or alt text.

## 📂 Project Structure & Architecture

-   **Directories**: `features/` (Gherkin), `steps/` (Step Defs), `support/` (Fixtures/Utils).
-   **Test Categories**:
    -   `@chromium` (Default): Runs in parallel (10 workers).
    -   `@flaky`: Unstable tests (run separately with retries).
    -   `@saml` / `@sso-*`: SSO tests (run with 1 worker).
    -   `@smoke`: Critical path validation.
    -   `@demo`: Demo scenarios (headed mode).

## ⚙️ Execution & Commands

_Working directory:_ `packages/syngrisi/e2e`

## Test Request Convention

If a user asks to run "syngrisi tests" or "e2e tests", treat that as running `yarn test` from `/Users/vsilakau/Projects/syngrisi/packages/syngrisi`.

### 🚀 Common Commands

| Command | Description |
| :--- | :--- |
| `yarn test` | **Full Suite** (Parallel + SSO + Flaky) |
| `yarn test:smoke` | Run smoke tests only |

## 🌍 Environment Variables

-   `E2E_BASE_URL`: App URL (default: `http://localhost:3002`)
-   `E2E_BACKEND_HOST`: Backend host (default: `localhost`)
-   `PLAYWRIGHT_HEADED`: Set `true` for visible browser.
-   `E2E_DEBUG`: Pause on failure.
-   `E2E_REUSE_SERVER`: Keep server between tests (`true` by default).

## 📚 Documentation Reference (`packages/syngrisi/docs/agent/guides/`)

-   `run_test.md` (Workflow)
-   `manage-flaky-tests.md` (Flaky Strategy)
-   `test-generate-quick.md` (New Features)
-   `update-app-layout.md` (Accessibility/ARIA)
-   `selector_best_practices.md` (Patterns)
-   `mcp_test_engine_using.md` (MCP Bridge)
-   `common_steps_cheatsheet.md` (Steps)
-   `testing_strategy.md` (General Strategy)
