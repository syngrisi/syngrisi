# Network Request Measurement Checklist

## Purpose

Use this checklist to compare frontend-to-backend request volume before and after request-reduction changes in the main UI.

The goal is not to benchmark the entire product. The goal is to measure the main user-facing flows consistently.

## Scope

Measure only the main UI flows:

- main tests page
- navbar grouping and filtering
- expanding a test row
- opening check details
- navigating inside check details
- accepting a check from details

Do not mix admin pages into this checklist.

## Scenarios

Run the same scenarios every time:

1. Cold app open to the main page with one visible test list.
2. Main page after project selection is already resolved.
3. Unfold one test row.
4. Open the first check in check details.
5. Navigate to the next check inside the same test.
6. Accept a check from details.
7. Close details and verify the list state.
8. Switch navbar grouping between runs and suites.

## What to Record

For every scenario, record:

- total `/v1/**` requests
- total `/snapshoots/**` requests
- duplicated requests by method + path + normalized query
- requests triggered by window-focus refetch
- requests triggered by invalidation after mutation

Recommended split:

- API requests
- screenshot/image requests
- polling requests
- mutation follow-up requests

## Interpretation Rules

Use these rules while reading the numbers:

- treat `/v1/**` reduction as the main target
- track `/snapshoots/**` separately from API reduction
- distinguish legitimate polling from avoidable duplicate fetches
- do not count one-time preload cache warmup as API duplication

## Expected Improvements

After the first optimization pass, the following should improve:

- fewer repeated detail fetches when opening a check from already loaded preview data
- no per-run N+1 `tests` requests in the navbar
- fewer broad invalidation refetches after accept/remove actions
- fewer focus-triggered refetches for stable reference queries
- no unnecessary sibling-check refetch when the current preview list already contains the needed checks

## Verification Notes

When using browser tooling:

- use the same seeded data shape for repeated runs
- keep the browser flow stable across comparisons
- prefer code-level query mapping as the explanation for why a request happened
- use browser traces and logs to validate totals, not as the only source of truth
