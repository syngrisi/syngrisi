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

## ⚙️ Execution & Commands

_Working directory:_ `packages/syngrisi/e2e`

**Base Command:**

```bash
npx bddgen && yarn playwright test "features/CP/check_details/regions.feature" "packages/syngrisi/e2e/features/CP/check_details/regions.feature" <add more tests here> --workers=8
```

**Adjust flags for specific goals:**

| Goal                       | Flags to append/modify                                        |
| :------------------------- | :------------------------------------------------------------ |
| **Filter by Scenario**     | `--grep "Scenario Name"`                                      |
| **Debug Mode**             | `--headed --workers=1`                                        |
| **Verify Fix (Stability)** | `--workers=3 --repeat-each=4` (Mandatory after fixing a test) |
| **Full Suite**             | Run `npm test` instead of specific files                      |

## 📚 Documentation Reference (`packages/syngrisi/docs/agent/guides/`)

-   `run_test.md` (Workflow)
-   `test-generate-quick.md` (New Features)
-   `update-app-layout.md` (Accessibility/ARIA)
-   `selector_best_practices.md` (Patterns)
-   `mcp_test_engine_using.md` (MCP Bridge)
-   `common_steps_cheatsheet.md` (Steps)
-   `testing_strategy.md` (General Strategy)
