---
"@syngrisi/syngrisi": minor
"@syngrisi/core-api": minor
"@syngrisi/playwright-sdk": minor
"@syngrisi/wdio-sdk": minor
---

Add per-check tolerance threshold via API. Tolerance can now be passed as `toleranceThreshold` (0-100%) in check params, overriding baseline tolerance for that specific check. Includes UI indicator showing tolerance source (API vs baseline), coercion fixes for form-data, and e2e test coverage.
