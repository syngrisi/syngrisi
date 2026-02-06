# @syngrisi/playwright-sdk

## 3.1.5

### Patch Changes

-   Updated dependencies [[`def594c`](https://github.com/syngrisi/syngrisi/commit/def594c78cf5949daf1ebdf6305858b34f2fbaae)]:
    -   @syngrisi/core-api@3.1.5

## 3.1.4

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@3.1.4

## 3.1.3

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@3.1.3

## 3.1.2

### Patch Changes

-   [`8fcaf5d`](https://github.com/syngrisi/syngrisi/commit/8fcaf5d3f6e3a1533c6a9f949a1cc0924f2c76dd) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Various bug fixes, UI improvements, and documentation updates.

-   Updated dependencies [[`8fcaf5d`](https://github.com/syngrisi/syngrisi/commit/8fcaf5d3f6e3a1533c6a9f949a1cc0924f2c76dd)]:
    -   @syngrisi/core-api@3.1.2

## 3.1.1

### Patch Changes

-   [`3ebe869`](https://github.com/syngrisi/syngrisi/commit/3ebe869da9c9ef67176f00e374d9da7b7139d01d) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - fix(deps): replace @wdio/logger with loglevel and sync dependencies

    -   Replace @wdio/logger with loglevel in core-api package
    -   Update playwright-bdd to ^8.4.2
    -   Update vite to ^7.2.6
    -   Sync zod, got-cjs, winston versions across packages
    -   Update @changesets/cli to ^2.29.8

-   Updated dependencies [[`3ebe869`](https://github.com/syngrisi/syngrisi/commit/3ebe869da9c9ef67176f00e374d9da7b7139d01d)]:
    -   @syngrisi/core-api@3.1.1

## 3.1.0

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@3.1.0

## 3.0.0

### Minor Changes

-   [`bfbd1c8`](https://github.com/syngrisi/syngrisi/commit/bfbd1c8b897cdf0d8806459ef84b8f435ef5be97) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - feat: add DOM collection capabilities for RCA (Root Cause Analysis)

    -   Add collectDomDump() method for automatic DOM tree collection
    -   Add optional collectDom parameter in check() method
    -   Add skipDomData parameter to disable DOM data transmission
    -   Respect SYNGRISI_DISABLE_DOM_DATA environment variable
    -   Improve TypeScript typing for domDump parameter (DomNode instead of any)

### Patch Changes

-   Updated dependencies [[`bfbd1c8`](https://github.com/syngrisi/syngrisi/commit/bfbd1c8b897cdf0d8806459ef84b8f435ef5be97)]:
    -   @syngrisi/core-api@3.0.0

## 2.6.1

### Patch Changes

-   @syngrisi/core-api@2.6.1

## 2.6.0

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@2.6.0

## 2.5.3

### Patch Changes

-   Updated dependencies [[`05fa851`](https://github.com/syngrisi/syngrisi/commit/05fa851c544a6098e1da45e4ff2df9a35ed95c27)]:
    -   @syngrisi/core-api@2.5.3

## 2.5.2

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@2.5.2

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
    -   @syngrisi/core-api@2.5.1

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

### Patch Changes

-   54cc35f: Phase 1 "Quick Wins" release:

    -   **UI**: Replace navigation arrows with chevron icons for consistent toolbar styling
    -   **UI**: Add loading indicator while images are loading in CheckDetails modal
    -   **Dependencies**: Update frontend packages within semver constraints
    -   **Docs**: Fix typos in SDK documentation (singrisi -> syngrisi)
    -   **Docs**: Fix incorrect class name in wdio-sdk README (SyngrisiDriver -> WDIODriver)
    -   **Docs**: Update documentation links and license information in SDK READMEs

-   Updated dependencies [12f95d0]
    -   @syngrisi/core-api@2.5.0

## 2.4.1

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@2.4.1
