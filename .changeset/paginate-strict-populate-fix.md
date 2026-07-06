---
"@syngrisi/syngrisi": patch
---

Fix a 500 (`StrictPopulateError`) on list endpoints when a client sends a
populate path that isn't in the target model's schema. The invalid `groupBy`
URL value `Tests` fell through to the default populate `suite,app,test,...`,
which was sent to the tests resource (no `test` path) and crashed the grouping
panel with "Request failed with status 500". The pagination plugin now skips
populate paths not present in the schema (`strictPopulate: false`) instead of
throwing.
