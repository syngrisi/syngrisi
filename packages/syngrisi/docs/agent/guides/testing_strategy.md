# Testing Strategy: From Red to Green

This guide outlines the standard workflow for fixing and verifying tests in the Syngrisi project. Follow these steps to ensure stability and correctness.

## 1. Run Tests Individually (Isolation)

Start by taking a single failing test and running it in isolation. This helps to confirm the failure and analyze the root cause without noise from other tests.

**Command:**

```bash
npx bddgen && yarn playwright test "path/to/feature" --grep "Scenario Name"
```

-   **Analyze:** Check the error logs, screenshots, and traces.
-   **Goal:** Reproduce the failure reliably.

## 2. Repeat Until Green (Iteration)

Focus on the single failing test. Make minimal changes to the test code (if the test is incorrect) or the application code (if it's a bug).

-   **Fix:** Apply a fix.
-   **Verify:** Re-run the specific test using the command above.
-   **Loop:** Repeat this process until the test passes consistently.

## 3. Run Suite in Parallel (Concurrency)

Once individual tests are passing, run the full suite (or a relevant subset) in parallel to check for concurrency issues, shared state problems, or flakiness.

**Command:**

```bash
npx bddgen && yarn playwright test --workers 6
```

-   **Troubleshoot:** If a test fails only in parallel mode, investigate shared resources (e.g., database state, user sessions).
-   **Fix:** Ensure tests are independent and clean up after themselves.

## 4. Final Smoke Run (Verification)

After a successful parallel run, execute a smoke test suite covering key user scenarios to ensure that recent changes haven't broken critical functionality.

**Command:**

```bash
# Example: Running tests tagged with @smoke
npx bddgen && yarn playwright test --grep "@smoke"
```

-   **Goal:** Confirm that the core application flow remains intact.
