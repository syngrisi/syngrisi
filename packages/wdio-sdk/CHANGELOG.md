# @syngrisi/wdio-sdk

## 3.0.0

### Major Changes

-   [`bfbd1c8`](https://github.com/syngrisi/syngrisi/commit/bfbd1c8b897cdf0d8806459ef84b8f435ef5be97) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - BREAKING: update getDomDump() return format for RCA compatibility

    -   Change getDomDump() return format from flat array to DomNode tree structure
    -   New format includes: tagName, attributes, rect, computedStyles, children, text
    -   Add skipDomData parameter to disable DOM data transmission
    -   Respect SYNGRISI_DISABLE_DOM_DATA environment variable

    Migration: If you were parsing getDomDump() output directly, update your code to handle the new tree structure.

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

-   0d66761: Phase 2 "Improvements" release:

    -   **Security**: Update Vite from 3.x to 7.x to fix 10 security vulnerabilities (8 moderate, 2 low)
    -   **Security**: Update @vitejs/plugin-react to 4.x for Vite 7 compatibility
    -   **CI**: Add Playwright browser caching to speed up E2E test runs
    -   **Docs**: Improve wdio-sdk README with corrected code examples and additional API documentation
    -   **Performance**: Image preloading on test row expansion already implemented in codebase

-   Updated dependencies [12f95d0]
    -   @syngrisi/core-api@2.5.0

## 2.4.1

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/core-api@2.4.1
