# @syngrisi/syngrisi

## 2.5.3

### Patch Changes

-   [`246ba5e`](https://github.com/syngrisi/syngrisi/commit/246ba5e5a038d319f6dfc6d4118512f031268dc9) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - fix: improve ActionPopoverIcon click handling and E2E test stability

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@2.5.3

## 2.5.2

### Patch Changes

-   [`b1bff19`](https://github.com/syngrisi/syngrisi/commit/b1bff196f04216abe1c8ca7ed67e15928e5572e0) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - feat(scripts): add log streaming and background process handling to staging TUI

-   [`ab44149`](https://github.com/syngrisi/syngrisi/commit/ab4414998da764c906db7704141eec669c2fc360) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - fix(ui): replace duplicate IconWand with IconAdjustments in CheckDetails toolbar

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@2.5.2

## 2.5.1

### Patch Changes

-   [`e51dcd5`](https://github.com/syngrisi/syngrisi/commit/e51dcd51badbd12145916793e3ecc7e2ac004fe7) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - chore: monorepo infrastructure improvements

    -   Migrate all npm commands to yarn across the repository
    -   Fix chalk v5 compatibility issue with @wdio/logger (force chalk v4.1.2)
    -   Add lint-staged and husky pre-commit hooks
    -   Standardize engines.node (>=22.19.0) across all packages
    -   Add root tsconfig.json for TypeScript project references
    -   Add vitest configs and basic tests to SDK packages
    -   Unify licenses to MIT across all packages
    -   Add files field to package.json for proper npm publishing
    -   Update CLAUDE.md and agent documentation with yarn instructions
    -   Add monorepo improvement plan documentation

-   Updated dependencies [[`e51dcd5`](https://github.com/syngrisi/syngrisi/commit/e51dcd51badbd12145916793e3ecc7e2ac004fe7)]:
    -   @syngrisi/node-resemble.js@2.5.1

## 2.5.0

### Minor Changes

-   12f95d0: Phase 3 "SDK & UI Features" release:

    -   **SDK (WDIO & Playwright)**: Add `autoAccept` option to automatically accept new baselines (driver-level and check-level)
    -   **SDK (WDIO & Playwright)**: Add `setIgnoreRegions()` method to set ignore regions on baselines programmatically
    -   **SDK (WDIO & Playwright)**: Add `Driver.Region` helper class for creating region objects
    -   **API**: Add `updateBaseline()` method to core-api for updating baseline properties
    -   **UI**: Add "Checked area only" button (bound region) to regions toolbar with keyboard shortcut (B)
    -   **UI**: Add "Auto-ignore mode" selector for choosing comparison type (Standard, Anti-aliasing, Colors)
    -   **UI**: Add keyboard shortcut (A) for adding ignore regions
    -   **Schema**: Add `ignoreRegions`, `boundRegions`, and `matchType` to baseline PUT schema

-   7694f15: feat(share): implement check sharing for anonymous read-only access

    Add ability to share check details via unique URL that allows anonymous users to view check information in read-only mode without authentication.

    **Features:**

    -   Share button in Check Details menu creates shareable links
    -   Share links provide read-only access (Accept, Remove, menu hidden)
    -   Share modal with create/copy/revoke functionality
    -   No expiration - links must be manually revoked
    -   Tokens are hashed before storage for security

    **API Endpoints:**

    -   POST /api/v1/checks/:checkId/share - Create share token
    -   GET /api/v1/checks/:checkId/share - List share tokens
    -   GET /api/v1/checks/:checkId/share/validate - Validate token (public)
    -   DELETE /api/v1/share/:tokenId - Revoke share token

### Patch Changes

-   54cc35f: Phase 1 "Quick Wins" release:

    -   **UI**: Replace navigation arrows with chevron icons for consistent toolbar styling
    -   **UI**: Add loading indicator while images are loading in CheckDetails modal
    -   **Dependencies**: Update frontend packages within semver constraints
    -   **Docs**: Fix typos in SDK documentation (singrisi -> syngrisi)
    -   **Docs**: Fix incorrect class name in wdio-sdk README (SyngrisiDriver -> WDIODriver)
    -   **Docs**: Update documentation links and license information in SDK READMEs

-   0d66761: Phase 2 "Improvements" release:

    -   **Security**: Update Vite from 3.x to 7.x to fix 10 security vulnerabilities (8 moderate, 2 low)
    -   **Security**: Update @vitejs/plugin-react to 4.x for Vite 7 compatibility
    -   **CI**: Add Playwright browser caching to speed up E2E test runs
    -   **Docs**: Improve wdio-sdk README with corrected code examples and additional API documentation
    -   **Performance**: Image preloading on test row expansion already implemented in codebase
    -   @syngrisi/node-resemble.js@2.5.0

## 2.4.1

### Patch Changes

-   [`7bd73c3`](https://github.com/syngrisi/syngrisi/commit/7bd73c374cd098258d33da453fca352ccd6aeeee) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - ### CI/E2E Improvements

    -   Add yarn and Playwright browser caching for faster CI runs
    -   Stabilize flaky E2E tests with proper waits and API synchronization
    -   Add JSON/HTML reporters and comprehensive artifact uploads
    -   Add manual E2E test workflow

    ### Docker/MongoDB

    -   Upgrade MongoDB to 8.0 with configurable version via MONGODB_VERSION env
    -   Fix healthcheck to work with auth enabled
    -   Remove obsolete docker-compose version attribute

    ### Documentation

    -   Update system requirements: Node.js v22.19.0, MongoDB 8.0

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@2.4.1
