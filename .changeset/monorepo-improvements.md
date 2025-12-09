---
"@syngrisi/syngrisi": patch
"@syngrisi/core-api": patch
"@syngrisi/wdio-sdk": patch
"wdio-syngrisi-cucumber-service": patch
"wdio-cucumber-viewport-logger-service": patch
"@syngrisi/playwright-sdk": patch
"@syngrisi/node-resemble.js": patch
"create-sy": patch
---

chore: monorepo infrastructure improvements

- Migrate all npm commands to yarn across the repository
- Fix chalk v5 compatibility issue with @wdio/logger (force chalk v4.1.2)
- Add lint-staged and husky pre-commit hooks
- Standardize engines.node (>=22.19.0) across all packages
- Add root tsconfig.json for TypeScript project references
- Add vitest configs and basic tests to SDK packages
- Unify licenses to MIT across all packages
- Add files field to package.json for proper npm publishing
- Update CLAUDE.md and agent documentation with yarn instructions
- Add monorepo improvement plan documentation
