# @syngrisi/wdio-sdk

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
