# Monorepo Improvement Plan

> **Current Health Score: 72/100**
>
> Last updated: 2025-12-09

## Executive Summary

This document outlines the improvement plan for the Syngrisi monorepo. Tasks are prioritized by impact and grouped into phases for systematic execution.

---

## Phase 1: Critical Infrastructure (Target: +8 points)

### 1.1 Unify ESLint Configuration
**Impact:** High | **Effort:** Medium

**Problem:** Each package has its own ESLint config (.eslintrc.cjs), making lint-staged ineffective at the root level. ESLint v9 expects flat config.

**Solution:**
```
packages/
├── eslint.config.js          # Shared base config (NEW)
├── core-api/
│   └── eslint.config.js      # Extends base (MIGRATE)
├── syngrisi/
│   └── eslint.config.js      # Extends base (MIGRATE)
└── ...
```

**Tasks:**
- [ ] Create root `eslint.config.js` with shared rules
- [ ] Migrate each package's `.eslintrc.cjs` to flat config
- [ ] Update lint-staged to use the new config
- [ ] Remove `ESLINT_USE_FLAT_CONFIG=false` workaround

**Files to modify:**
- `package.json` (lint-staged config)
- `packages/*/eslint.config.js` (new files)
- Delete `packages/*/.eslintrc.cjs`

---

### 1.2 Fix TypeScript Path Aliases
**Impact:** Medium | **Effort:** Low

**Problem:** Root `tsc --noEmit` fails because e2e package uses path aliases (`@config`, `@fixtures`, etc.) that aren't recognized at root level.

**Solution:**
```json
// tsconfig.json (root) - add project references
{
  "references": [
    { "path": "./packages/core-api" },
    { "path": "./packages/syngrisi" },
    { "path": "./packages/wdio-sdk" }
  ]
}
```

**Tasks:**
- [ ] Update root `tsconfig.json` with project references
- [ ] Add `composite: true` to each package's tsconfig
- [ ] Exclude e2e from root type checking (it has its own tsconfig)

**Files to modify:**
- `tsconfig.json`
- `packages/*/tsconfig.json`

---

## Phase 2: Testing Quality (Target: +12 points)

### 2.1 Add Unit Tests to Core Packages
**Impact:** High | **Effort:** High

**Current coverage:**
| Package | Unit Tests | Coverage |
|---------|------------|----------|
| create-sy | ✅ Yes | ~50% |
| core-api | ✅ Yes | ~13% |
| wdio-sdk | ✅ Yes | ~13% |
| syngrisi | ❌ No | 0% |
| playwright-sdk | ✅ Yes | Low |

**Priority targets:**
1. `packages/syngrisi/src/server/services/` - Business logic
2. `packages/core-api/src/` - API client
3. `packages/syngrisi/src/server/lib/` - Utilities

**Tasks:**
- [ ] Add vitest to syngrisi package
- [ ] Write tests for critical services (check.service, baseline.service)
- [ ] Add coverage thresholds to CI
- [ ] Target: 40% coverage for core packages

---

### 2.2 Stabilize Flaky E2E Tests
**Impact:** Medium | **Effort:** Medium

**Current state:** 10 tests tagged `@flaky`

**Tasks:**
- [ ] Audit each flaky test for root cause
- [ ] Fix timing issues (replace `waitForTimeout` with proper assertions)
- [ ] Fix selector issues (use ARIA roles instead of CSS)
- [ ] Remove `@flaky` tag from stabilized tests
- [ ] Target: Reduce flaky tests to <5

**Files to review:**
- `packages/syngrisi/e2e/features/` - all `@flaky` tagged scenarios

---

## Phase 3: Developer Experience (Target: +5 points)

### 3.1 Improve Pre-commit Hooks
**Impact:** Medium | **Effort:** Low

**Current state:** lint-staged runs but only echoes (no real checks)

**Tasks:**
- [ ] After Phase 1.1: Enable ESLint in lint-staged
- [ ] Add Prettier for consistent formatting
- [ ] Add type checking for staged files

**Target config:**
```json
{
  "lint-staged": {
    "packages/**/*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "packages/**/*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

### 3.2 Add Prettier
**Impact:** Low | **Effort:** Low

**Tasks:**
- [ ] Install prettier as dev dependency
- [ ] Create `.prettierrc` with project settings
- [ ] Create `.prettierignore`
- [ ] Add `format` script to root package.json
- [ ] Run initial formatting pass

---

## Phase 4: Maintenance & Cleanup (Target: +3 points)

### 4.1 Resolve Dependency Warnings
**Impact:** Low | **Effort:** Low

**Current warnings:**
```
Resolution field "chalk@4.1.2" is incompatible with requested version "chalk@^5.1.2"
Resolution field "bson@7.0.0" is incompatible with requested version "bson@^6.10.4"
```

**Tasks:**
- [ ] Document why these resolutions are needed
- [ ] Check if newer versions of @wdio/logger support chalk v4
- [ ] Monitor mongoose updates for bson compatibility

---

### 4.2 Clean Up Legacy Code
**Impact:** Low | **Effort:** Low

**Tasks:**
- [ ] Remove `packages/syngrisi/src/server/server_old.ts`
- [ ] Remove `tests_old/` directories if present
- [ ] Audit and remove unused dependencies
- [ ] Clean up TODO/FIXME comments

---

## Execution Timeline

```
Phase 1 (Infrastructure)     ████████░░░░  Week 1-2
Phase 2 (Testing)            ░░░░████████  Week 2-4
Phase 3 (DX)                 ░░░░░░██████  Week 3-4
Phase 4 (Cleanup)            ░░░░░░░░████  Week 4
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Health Score | 72 | 85+ |
| Build Success | 100% | 100% |
| Unit Test Coverage | ~15% | 40% |
| Flaky E2E Tests | 10 | <5 |
| TypeScript Errors (root) | 15+ | 0 |
| ESLint Configs | 8 separate | 1 shared |

---

## Quick Wins (Can do immediately)

1. **Add Prettier** - 30 min
2. **Document dependency resolutions** - 15 min
3. **Remove server_old.ts** - 5 min
4. **Add coverage badge to README** - 10 min

---

## Notes

- All improvements should be backward compatible
- Each phase can be done in a separate PR
- Run full E2E test suite after each major change
- Update this document as tasks are completed
