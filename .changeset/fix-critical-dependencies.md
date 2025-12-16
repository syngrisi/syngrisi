---
"@syngrisi/core-api": patch
"@syngrisi/playwright-sdk": patch
"@syngrisi/wdio-sdk": patch
"wdio-syngrisi-cucumber-service": patch
---

fix(deps): replace @wdio/logger with loglevel and sync dependencies

- Replace @wdio/logger with loglevel in core-api package
- Update playwright-bdd to ^8.4.2
- Update vite to ^7.2.6
- Sync zod, got-cjs, winston versions across packages
- Update @changesets/cli to ^2.29.8
