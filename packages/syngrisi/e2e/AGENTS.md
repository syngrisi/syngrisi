# E2E Framework Rules for AI Agents

## CRITICAL RULE: Test Fidelity

**NEVER modify test assertions or add normalization logic that changes the actual behavior being tested.**

- Tests MUST exactly replicate the logic from `packages/syngrisi/tests/features/`
- DO NOT add color normalization, case-insensitive text matching, or any other "helpful" transformations
- If a test fails, investigate WHY it fails - don't work around it by changing the assertion logic
- Use exact string matching: `expect(actual).toBe(expected)` - no regex, no normalization
- For CSS properties, use Playwright's `toHaveCSS()` directly - it handles browser differences correctly
- If there's a mismatch between expected and actual values, debug the root cause:
  - Check if the application behavior changed
  - Verify selectors are correct
  - Add debug logging to understand what's happening
  - Fix the application or test data, not the assertion

## Step Definitions

- Step definitions MUST match the original WebdriverIO/Cucumber step definitions exactly
- Use the same comparison logic as the original tests
- Preserve all original test behavior and expectations
- Keep all environment management steps (database cleanup, server/driver start, storage reset) identical to the original feature backgrounds. If the legacy scenario started with `Given I clear Database and stop Server`, you MUST provide the same guarantees via Playwright fixtures/steps (e.g. `Given the database is cleared` plus server start). Never skip or reorder these setup steps.
- Ensure API helpers mirror legacy behavior: reuse the same hashing algorithms, default payload values, wait timings, and file resolution logic so that created entities are byte-for-byte compatible with the original tests.
- Maintain the exact feature structure: scenario titles, tags, comments, and data tables should remain unchanged unless the original files are updated.

## Debugging

- When tests fail, add detailed logging to understand the issue
- Use Playwright's built-in debugging tools (screenshots, traces, console logs)
- Never "fix" a test by changing what it's testing - fix the underlying issue
- Validate cross-scenario isolation explicitly: double-check that data created in one scenario cannot leak into the next. If the legacy suite depended on a fresh DB per background, replicate that behavior in the new stack.

## Known Differences: WebdriverIO vs Playwright

- **Text matching**: WebdriverIO's `getText()` returns visible text (like `innerText`), which respects CSS `text-transform`. Use `innerText()` in Playwright to match this behavior.
- **CSS Colors**: WebdriverIO's `getCSSProperty()` for color properties returns `rgba(r,g,b,1)` format without spaces. Browsers return `rgb(r, g, b)` format. To match WebdriverIO behavior exactly, normalize `rgb(r, g, b)` to `rgba(r,g,b,1)` format (no spaces) in step definitions for color properties. This normalization is REQUIRED to replicate WebdriverIO's exact behavior.
