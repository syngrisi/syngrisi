# @syngrisi/node-resemble.js

## 3.14.1

## 3.14.0

## 3.13.0

## 3.12.0

## 3.11.0

## 3.10.1

## 3.10.0

### Minor Changes

-   9b6729d: Add a true pixel-to-pixel comparison mode and make it the default

    The default comparison mode (`matchType: 'nothing'`, previously labelled **Standard**) now performs an **exact, zero-tolerance** pixel-to-pixel comparison and is labelled **Pixel Perfect** in the UI. The previous behaviour — which tolerated differences up to ±16 per colour channel despite being called "Standard" — is still available as a new **Tolerant** mode (`matchType: 'tolerant'`).

    -   `node-resemble.js` gains an `exact()` method (all tolerances set to 0). `ignoreNothing()` keeps its ±16 behaviour and now backs the Tolerant mode.
    -   Baseline match-type options: `nothing` (Pixel Perfect, exact, default), `tolerant` (allow minor per-pixel differences), `antialiasing`, `colors`.

    ⚠️ **Behaviour change (no data migration):** existing baselines with `matchType: 'nothing'` (or unset) are now compared strictly. Renders that previously passed thanks to the ±16 tolerance may start reporting differences, and reported diff percentages go up (so more checks exceed the 5% ceiling under which the diff-highlight tool is offered). To restore the old leniency for a baseline, switch its match type to **Tolerant**.

## 3.9.2

## 3.9.1

## 3.9.0

## 3.8.0

## 3.7.0

## 3.6.0

## 3.5.1

## 3.5.0

## 3.4.8

## 3.4.7

## 3.4.6

## 3.4.5

## 3.4.4

## 3.4.3

## 3.4.2

## 3.4.1

## 3.4.0

## 3.3.1

## 3.3.0

## 3.2.3

## 3.2.2

## 3.2.1

## 3.2.0

## 3.1.7

## 3.1.6

## 3.1.5

## 3.1.4

## 3.1.3

## 3.1.2

## 3.1.1

## 3.1.0

## 3.0.0

## 2.6.1

## 2.6.0

## 2.5.3

## 2.5.2

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

## 2.5.0

## 2.4.1
