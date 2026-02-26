# @syngrisi/syngrisi

## 3.1.7

### Patch Changes

-   [`64bfad8`](https://github.com/syngrisi/syngrisi/commit/64bfad8c0c3735265995700b288f45a5f98e3a5b) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Update CP header checks, refine table/header behavior in UI, and refresh MCP step metadata for E2E coverage.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.7

## 3.1.6

### Patch Changes

-   [`34aeba6`](https://github.com/syngrisi/syngrisi/commit/34aeba6aac794c4109daada6b310829e80863832) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Add navbar resize stability fixes, panel resizing support improvements, and sync MCP step definitions with updated E2E coverage.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.6

## 3.1.5

### Patch Changes

-   [`def594c`](https://github.com/syngrisi/syngrisi/commit/def594c78cf5949daf1ebdf6305858b34f2fbaae) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Stabilize JWT auth header handling and add M2M end-to-end coverage for client API endpoints.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.5

## 3.1.4

### Patch Changes

-   [#10](https://github.com/syngrisi/syngrisi/pull/10) [`d18453e`](https://github.com/syngrisi/syngrisi/commit/d18453e3020216422c071612af4e7cf1a2eba79a) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Stabilize jwt-auth validation/startup and e2e auth flows.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.4

## 3.1.3

### Patch Changes

-   [`2f215f0`](https://github.com/syngrisi/syngrisi/commit/2f215f09911772bd4afafa37b46c2647118dca57) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Fix RCA tests DOM data collection and HTTP test user creation retry logic

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.3

## 3.1.2

### Patch Changes

-   [`8fcaf5d`](https://github.com/syngrisi/syngrisi/commit/8fcaf5d3f6e3a1533c6a9f949a1cc0924f2c76dd) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Various bug fixes, UI improvements, and documentation updates.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.2

## 3.1.1

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.1

## 3.1.0

### Minor Changes

-   [`82bd4f7`](https://github.com/syngrisi/syngrisi/commit/82bd4f70168e7ac40fdde99c9610567cba179b10) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - feat(sso): add SAML IdP metadata loader and comprehensive documentation

    **SSO Enhancements:**

    -   Add automatic IdP configuration from metadata URL (`SSO_IDP_METADATA_URL`)
    -   Add `/v1/auth/sso/metadata` endpoint for SP metadata export
    -   Add `SSO_IDP_ISSUER` for IdP issuer validation
    -   Add `SSO_AUTO_CREATE_USERS` and `SSO_ALLOW_ACCOUNT_LINKING` options
    -   Add OAuth2 specific variables: `SSO_AUTHORIZATION_URL`, `SSO_TOKEN_URL`, `SSO_USERINFO_URL`, `SSO_CALLBACK_URL`

    **Documentation:**

    -   Add comprehensive SSO docs: architecture, integration guide, troubleshooting
    -   Add Okta SAML Quick Start guide
    -   Add security best practices and migration guides

    **Testing:**

    -   Add E2E tests for SSO metadata functionality

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.1.0

## 3.0.0

### Minor Changes

-   [`bfbd1c8`](https://github.com/syngrisi/syngrisi/commit/bfbd1c8b897cdf0d8806459ef84b8f435ef5be97) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - feat: add Root Cause Analysis (RCA) feature for visual regression debugging

    Server:

    -   Add DomSnapshot model for storing DOM snapshots with gzip compression
    -   Add dom-snapshot.service for DOM snapshot CRUD operations with deduplication
    -   Add new API endpoints: GET /v1/checks/{id}/dom, GET /v1/baselines/{id}/dom
    -   Add x-domdump-compressed header support for compressed DOM data
    -   All DOM operations are non-critical (wrapped in try-catch)

    UI:

    -   Add RCA panel component with DOM diff visualization
    -   Add wireframe overlay for visual element highlighting
    -   Add RCA toggle button in toolbar (keyboard shortcut: D)
    -   Display change statistics: added nodes, removed nodes, style changes
    -   Show detailed property changes (before/after values)
    -   Graceful error handling when DOM data is unavailable

    Configuration:

    -   Add SYNGRISI_DOM_SNAPSHOTS_PATH for custom DOM storage location
    -   Backward compatible: checks without DOM data work as before

### Patch Changes

-   [`11ce3ac`](https://github.com/syngrisi/syngrisi/commit/11ce3acab7660cb9952517acda6604944f8fc013) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - fix(ui): fix RCA panel scrolling behavior to prevent page scroll when panel scroll ends

-   [`e21daff`](https://github.com/syngrisi/syngrisi/commit/e21daffe1ac1c9d4acced4eec668d32dd4b5c6cd) Thanks [@viktor-silakov](https://github.com/viktor-silakov)! - Documented that enabling RCA requires `SYNGRISI_DISABLE_DOM_DATA=false` to send DOM snapshots.

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@3.0.0

## 2.6.1

### Patch Changes

-   Fix filter drawer layout and button visibility on smaller screens:

    -   Fix alignment of buttons in check details filter
    -   Fix filter drawer width to ensure buttons are visible on small screens
    -   Fix table and filter drawer layout to prevent overflow
    -   Increase filter drawer z-index and padding
    -   Remove negative margin from filter scroll area

-   Updated dependencies:
    -   @syngrisi/node-resemble.js@2.6.1

## 2.6.0

### Minor Changes

-   ### Features

    -   Refactor screenshot details and view controls with improved UI/UX

    ### Bug Fixes

    -   Fix race condition in check details canvas rendering
    -   Improve check details canvas performance by updating images on existing canvas instead of re-initializing
    -   Resolve cursor display issues in canvas view
    -   Improve toolbar layout and fix navigation arrow positioning
    -   Improve ActionPopoverIcon click handling and E2E test stability

    ### Improvements

    -   Centralize retry logic in SyngrisiApi (core-api)
    -   Update seed scripts and data

### Patch Changes

-   Updated dependencies []:
    -   @syngrisi/node-resemble.js@2.6.0

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
