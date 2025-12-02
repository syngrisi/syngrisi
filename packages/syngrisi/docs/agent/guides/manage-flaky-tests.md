# Managing Flaky Tests

Keep flaky scenarios isolated so the main suite stays fast and stable.

## Tagging
Add `@flaky` to any unstable scenario.

## Execution
- Main run: skip `@flaky`, high parallelism (12 workers).
- Flaky run: only `@flaky`, low parallelism (3 workers) to curb flakiness.

## Reporting
Main and flaky runs write to `reports/blob-parallel` and `reports/blob-flaky`; merge them to preserve all results.

## Fix workflow
1) Find the flaky test. 2) Tag with `@flaky`. 3) It moves to the flaky run. 4) Debug and fix the cause. 5) Remove the tag once stable.
