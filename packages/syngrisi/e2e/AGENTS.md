# E2E Framework Rules for AI Agents

## E2E Test Agent - Strict Rules

### 🚫 ABSOLUTE PROHIBITIONS

#### 1. Global Timeouts

-   **NEVER** modify `playwright.config.ts` timeouts without user consent
-   **NEVER** change global `timeout`, `actionTimeout`, `navigationTimeout` without user consent
-   **MUST STOP** and ask user: "Action X is timing out. Adjust timeout or investigate why it's slow?"

### 2. Working Around Failures

**FORBIDDEN:**

-   Changing assertions to match wrong behavior
-   Adding `waitForTimeout()` to mask issues
-   Relaxing expectations without understanding why
-   Catching errors without investigation

**REQUIRED:**

-   Investigate WHY test fails
-   Add debug logging
-   Capture actual vs expected state
-   Find root cause before any changes

### 3. Selector Priority (STRICT ORDER)

1. ✅ ARIA roles — `When I click element with locator "button[aria-label='Add New User']"`
2. ✅ Labels — `When I fill "j_doe@gmail.com" into element with label "Email"`
3. ✅ Text — `Then the element "[data-check-status-name='CheckName'] span" matches the text "NEW"`
4. ⚠️ TestID (only if above unavailable) — `Then the element with locator "[data-test='user-add-role']" should be enabled`
5. ❌ CSS/XPath (very rare case, only if above unavailable) — `Then the element with locator "//input[@aria-label='Email']/../../div[contains(@class, 'mantine-InputWrapper-error')]" should have contains text "Invalid email format"`

### 4. Missing Accessibility

If good selectors unavailable change the layout to add accessibility features (`packages/syngrisi/src/ui-app`):

-   Use semantic HTML (`<button>`, `<nav>`)
-   Add ARIA roles/labels
-   Add labels for inputs
-   Add alt text for images

## 📋 MANDATORY WORKFLOW

```
Failure → STOP → Debug → Analyze → Document → ASK USER → WAIT → Proceed
```

---

## When Test Fails

1. **Capture state:** actual vs expected
2. **Add debug:** logging, screenshots
3. **Analyze:** check selector, timing, app behavior, errors
4. **Report:** "STOP: [failure reason]. Options: A) [action1] B) [action2]. Awaiting approval."
5. **WAIT** for user response

## Test Execution

-   The project relies on `npm`, so run commands via the npm scripts inside `packages/syngrisi/e2e`.
-   To execute a single scenario in headless mode, generate steps and run the test:

    ```bash
    npx bddgen && yarn playwright test "features/CHECKS_HANDLING/accept_by_user.feature" --grep "Accept by user" --workers=2
    ```

-   For headed mode, run:

    ```bash
    npx bddgen && yarn playwright test "features/CHECKS_HANDLING/accept_by_user.feature" --grep "Accept by user" --workers=1 --headed
    ```

-   To execute the entire e2e suite, change into `packages/syngrisi/e2e` and run `npm test`.

## After Fixing a Test

After fixing any test, you MUST run it multiple times in a concurrent environment (only after you make sure that it works in one thread) to ensure stability. For example:

```bash
npx bddgen && yarn playwright test "features/CHECKS_HANDLING/accept_by_user.feature" --grep "Accept by user" --workers=3 --repeat-each=4
```

This helps verify that the test works reliably under parallel execution and is not flaky.

## Fixing Multiple Tests

If multiple tests need to be fixed, it is better to do it in bulk by fixing the test code (without breaking the test logic), then run them all together.

Example command:

```bash
npx bddgen && yarn playwright test "features/CP/check_details/regions.feature" "packages/syngrisi/e2e/features/CP/check_details/regions.feature" <add more tests here> --workers=8
```

Then continue working on all failing tests, gradually narrowing down the number of failing tests.

---

## ❌ NEVER Say/Do

-   "I'll increase timeout"
-   "Let me adjust the assertion"
-   "I'll use CSS selector instead"
-   Make changes without explaining WHY
-   Proceed without approval on critical decisions

---

## ✅ ALWAYS Say

-   "STOP: Investigation required"
-   "Root cause: [details]"
-   "Awaiting approval before proceeding"
-   "Should I [A] or [B]?"

---

## ENFORCEMENT

**Any rule violation = immediate STOP + user approval required**

## Documentation quick links
- `packages/syngrisi/docs/agent/guides/run_test.md` — regenerate steps and run tests.
- `packages/syngrisi/docs/agent/guides/test-generate-quick.md` — generate feature files quickly.
- `packages/syngrisi/docs/agent/guides/update-app-layout.md` — add semantics/ARIA for selectors.
- `packages/syngrisi/docs/agent/guides/selector_best_practices.md` — selector priority and patterns.
- `packages/syngrisi/docs/agent/guides/mcp_test_engine_using.md` — MCP test engine and bridge usage.
- `packages/syngrisi/docs/agent/guides/common_steps_cheatsheet.md` — most-used steps with references.
