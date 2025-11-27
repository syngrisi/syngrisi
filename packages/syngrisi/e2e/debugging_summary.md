# Debugging Flaky SSO Tests - Resolution Summary

## Objective
The goal was to resolve flaky and failed SSO tests (`SAML Account Linking`, `SAML User Creation`) and "Ident flow" tests (`wrong API key provided`), and to improve test robustness.

## Resolutions

### 1. "Ident flow" Failures (Wrong API Key)
*   **Issue:** Tests running in "Fast Server Mode" (`@fast-server`) were failing with `401 Unauthorized` despite `SYNGRISI_AUTH='false'`.
*   **Root Cause:** The `AppSettings` class was not strictly adhering to the `SYNGRISI_AUTH` environment variable override when checking authentication status.
*   **Fix:** Modified `packages/syngrisi/src/server/lib/AppSettings/AppSettings.ts` to explicitly return `false` if `process.env.SYNGRISI_AUTH === 'false'`, ensuring authentication is disabled when requested.

### 2. SAML Test Failures (Timeout / Flakiness)
*   **Issue:** SAML tests were failing with `TimeoutError: page.waitForURL` or flakiness during the redirect phase.
*   **Root Cause:** Running SAML tests in parallel (`--workers=10`) caused conflicts because Logto (the IdP) was configured with a single ACS URL.
*   **Fix:** Split the test execution in `packages/syngrisi/e2e/package.json`:
    *   `test:parallel`: Runs non-SAML tests with multiple workers.
    *   `test:sso`: Runs SAML tests (`@saml`) sequentially with `--workers=1`.

### 3. Robust User Verification
*   **Issue:** SAML tests relied on UI placeholders (`console.log`) for verifying user creation and role assignment.
*   **Fix:** Implemented actual verification in `packages/syngrisi/e2e/steps/domain/sso.steps.ts` using `MongoClient` to query the `vrsusers` collection directly.
    *   Verified `provider` type and `role` assignment.
    *   Corrected the query to use `username` field (which stores email in Syngrisi) and `vrsusers` collection name.

### 4. Refining Playwright Steps
*   **Issue:** Usage of `page.waitForTimeout(100)` in SSO login steps was a potential source of flakiness and bad practice.
*   **Fix:** Replaced `waitForTimeout` calls in `packages/syngrisi/e2e/steps/domain/sso.steps.ts` with explicit assertions `expect(locator).toHaveValue(value)`, which implicitly wait for the input to be registered.

### 5. Debugging Improvements
*   **Action:** Added `log.info` in `packages/syngrisi/src/server/server.ts` to print the MongoDB connection string on startup, aiding in debugging connection issues during tests.

## Verification
*   **Ident Flow:** All 4 tests passed successfully.
*   **SAML Tests:** All 3 tests passed successfully with robust verification and refined steps.

## Next Steps
*   Monitor CI for stability.
*   Consider enhancing Logto configuration to support dynamic ACS URLs if parallel SAML testing is desired in the future.
