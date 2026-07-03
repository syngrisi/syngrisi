---
"@syngrisi/syngrisi": patch
---

CI no longer runs E2E tests by default. E2E on CI is now opt-in and runs only when the pushed HEAD commit message carries the explicit run-e2e opt-in marker (or via the manual "E2E Tests" workflow). Running E2E locally before merging/releasing is required instead. Documentation updated accordingly.
