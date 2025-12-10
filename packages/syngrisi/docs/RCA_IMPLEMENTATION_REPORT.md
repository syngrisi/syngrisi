# RCA Implementation Report

**Date:** 2025-12-09
**Branch:** `root_cause_analysys`

---

## Executive Summary

Implemented Root Cause Analysis (RCA) feature for Syngrisi - a visual regression testing system. RCA allows not only seeing **what** changed (diff pixels), but also understanding **why** (which DOM elements were added/removed, which styles changed).

**Status:** MVP is ready and working. Demo test passes successfully.

---

## Completed Work

### Phase 1: SDK (Core API + Playwright/WDIO SDK)

| Component | File | Status |
|-----------|------|--------|
| DomNode schema | `packages/core-api/schemas/DomNode.schema.ts` | ✅ |
| Compression utilities | `packages/core-api/src/compression.ts` | ✅ |
| DOM Collector script | `packages/core-api/src/domCollector.ts` | ✅ |
| Playwright SDK | `packages/playwright-sdk/src/PlaywrightDriver.ts` | ✅ |
| WDIO SDK | `packages/wdio-sdk/src/lib/getDomDump.ts` | ✅ |

### Phase 2: Server

| Component | File | Status |
|-----------|------|--------|
| DomSnapshot Model | `packages/syngrisi/src/server/models/DomSnapshot.model.ts` | ✅ |
| DomSnapshot Service | `packages/syngrisi/src/server/services/dom-snapshot.service.ts` | ✅ |
| API: GET /checks/:id/dom | `packages/syngrisi/src/server/routes/v1/checks.route.ts` | ✅ |
| API: GET /baselines/:id/dom | `packages/syngrisi/src/server/routes/v1/baselines.route.ts` | ✅ |
| Config: domSnapshotsPath | `packages/syngrisi/src/server/config.ts` | ✅ |

### Phase 3: UI (Frontend)

| Component | File | Status |
|-----------|------|--------|
| RCA Types | `src/ui-app/shared/interfaces/IRCA.ts` | ✅ |
| RCA Service | `src/ui-app/shared/services/rca.service.ts` | ✅ |
| DOM Diff Engine | `src/ui-app/shared/utils/domDiff.ts` | ✅ |
| RCA Panel | `src/ui-app/.../RCA/RCAPanel.tsx` | ✅ |
| useRCA Hook | `src/ui-app/.../RCA/useRCA.ts` | ✅ |
| RCA Overlay | `src/ui-app/.../Canvas/rcaOverlay.ts` | ✅ |
| Toolbar Button | `src/ui-app/.../Toolbar/Toolbar.tsx` | ✅ |
| MainView Integration | `src/ui-app/.../Canvas/mainView.ts` | ✅ |
| CheckDetails Integration | `src/ui-app/.../CheckDetails.tsx` | ✅ |

### Phase 4: Testing & Demo

| Component | File | Status |
|-----------|------|--------|
| Demo Test App | `e2e/fixtures/rca-test-app/index.html` | ✅ |
| RCA Demo Steps | `e2e/steps/domain/rca.steps.ts` | ✅ |
| Demo Feature | `e2e/features/DEMO/rca_demo.feature` | ✅ |

### Documentation

| Document | Status |
|----------|--------|
| `docs/environment_variables.md` - added SYNGRISI_DOM_SNAPSHOTS_PATH | ✅ |
| `docs/RCA.md` - complete feature documentation | ✅ |

---

## Problems Encountered & Solutions

### 1. Canvas disappeared when opening RCA panel

**Problem:** When adding RCA panel to a flex container, canvas (fabric.js) lost its content. The diff image became white/empty.

**Cause:** Flex layout forced canvas element to resize, which caused fabric.js canvas content to reset.

**Solution:** Changed RCA panel from flex element to `position: absolute` overlay:
```tsx
<Box style={{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 100 }}>
    <RCAPanel ... />
</Box>
```

### 2. Wireframe (DOM overlay) positioned incorrectly

**Problem:** Dashed borders around DOM elements were drawn with offset, extending beyond image boundaries.

**Cause:** Used viewport transform (zoom + pan) instead of the actual image position and scale on canvas.

**Solution:** In `enableRCAOverlay()` now uses image position and scale:
```typescript
const image = this.actualImage || this.expectedImage;
const imageLeft = image?.left || 0;
const imageTop = image?.top || 0;
const scale = image?.scaleX || 1;
this.rcaOverlay.enable(actualDom, baselineDom, changes, scale, imageLeft, imageTop);
```

### 3. RCA panel was clipped

**Problem:** RCA panel content didn't fit and was clipped.

**Solution:** Increased panel width to 500px with `flexShrink: 0`.

### 4. Mock data in tests

**Problem:** Initially tests used mock DOM data, which didn't demonstrate real feature functionality.

**Solution:** Created a real test application (`e2e/fixtures/rca-test-app/index.html`) with Dashboard UI. Test launches it via HTTP server, takes screenshots via Playwright and collects real DOM.

---

## Tasks Not Completed

### Unit Tests (0% coverage)

| Test | Priority |
|------|----------|
| `domDiff.test.ts` - diff algorithm tests | HIGH |
| `compression.test.ts` - roundtrip tests | MEDIUM |
| `dom-snapshot.service.test.ts` - CRUD tests | MEDIUM |
| `rcaOverlay.test.ts` - overlay tests | LOW |

### Integration Tests

| Test | Priority |
|------|----------|
| E2E test with real Playwright SDK | HIGH |
| Test API endpoints `/checks/:id/dom` | MEDIUM |

### Features Not Implemented

| Feature | Description | Priority |
|---------|-------------|----------|
| Smart Grouping | Group changes by CSS class/parent | MEDIUM |
| Click-to-highlight | Click on issue highlights element on canvas | LOW (partially works) |
| Hover preview | Hover on issue shows element preview | LOW |
| Export report | Export RCA report to PDF/JSON | LOW |

---

## Open Questions

### 1. Performance on large DOMs

**Question:** How does the diff algorithm behave on pages with >10,000 DOM nodes?

**Recommendation:** Add Web Worker for diff calculations and/or R-tree for spatial queries (`rbush` library).

### 2. Backward Compatibility

**Question:** How to handle checks without DOM snapshot (created before RCA implementation)?

**Current behavior:** RCA button is shown, but clicking it displays "No DOM data available" in the panel.

**Recommendation:** Hide RCA button if there's no DOM data.

### 3. DOM Collection by default

**Question:** Should DOM be collected by default or only with `collectDom: true`?

**Current behavior:** Requires explicit enabling.

**Trade-off:** Enabling by default will increase payload size by 2-30KB.

### 4. Baseline DOM on Accept

**Question:** When accepting a check, should actual DOM be copied as baseline DOM?

**Current behavior:** Not implemented.

**Recommendation:** Implement in `check.service.ts:accept()`.

---

## Next Steps

### Immediate (P0)

1. **Unit tests for domDiff.ts** - critical for confidence in the algorithm
2. **Hide RCA button** if there's no DOM data for check
3. **Baseline DOM on accept** - copy actual DOM

### Short-term (P1)

4. **Web Worker for diff** - improve performance
5. **E2E test with real SDK** - integration test of full flow
6. **Click-to-highlight** - full implementation of element selection

### Long-term (P2)

7. **Smart Grouping** - group changes
8. **DOM Collection by default** - after analyzing performance impact
9. **Export report** - PDF/JSON export

---

## Demo

Running demo:
```bash
cd packages/syngrisi/e2e
SKIP_DEMO_TESTS=false npx playwright test --project=demo "features/DEMO/rca_demo.feature" --workers=1 --headed
```

Demo shows:
1. Creating baseline with normal Dashboard
2. Creating actual with "broken" version (modified styles, colors, layout)
3. Opening Check Details with 41.27% visual diff
4. Enabling RCA - panel shows 84 DOM changes
5. Wireframe overlay on canvas
6. Disabling RCA

---

## Metrics

- **Total changes detected in demo:** 84 (39 added, 42 removed, 3 style)
- **Visual diff percentage:** 41.27%
- **DOM snapshot size:** ~30KB original, ~2.3KB compressed
- **Demo test duration:** ~3 minutes (with pauses)

---

## Files Changed

```
packages/syngrisi/
├── src/server/
│   ├── config.ts                              # domSnapshotsPath
│   ├── envConfig.ts                           # SYNGRISI_DOM_SNAPSHOTS_PATH
│   ├── models/DomSnapshot.model.ts            # NEW
│   ├── services/dom-snapshot.service.ts       # NEW
│   └── routes/v1/
│       ├── checks.route.ts                    # GET /checks/:id/dom
│       └── baselines.route.ts                 # GET /baselines/:id/dom
│
├── src/ui-app/
│   ├── shared/
│   │   ├── interfaces/IRCA.ts                 # NEW
│   │   ├── services/rca.service.ts            # NEW
│   │   └── utils/domDiff.ts                   # NEW
│   │
│   └── index2/components/Tests/Table/Checks/CheckDetails/
│       ├── RCA/                               # NEW directory
│       │   ├── RCAPanel.tsx
│       │   ├── useRCA.ts
│       │   ├── index.ts
│       │   └── sections/
│       │       ├── IssuesSection.tsx
│       │       ├── AllChangesSection.tsx
│       │       └── ChangeItem.tsx
│       │
│       ├── Canvas/
│       │   ├── mainView.ts                    # RCA integration
│       │   └── rcaOverlay.ts                  # NEW
│       │
│       ├── Toolbar/Toolbar.tsx                # RCA button
│       └── CheckDetails.tsx                   # RCA panel integration
│
├── e2e/
│   ├── fixtures/rca-test-app/index.html       # NEW - test app
│   ├── steps/domain/rca.steps.ts              # REWRITTEN
│   └── features/DEMO/rca_demo.feature         # NEW
│
└── docs/
    ├── environment_variables.md               # Updated
    ├── RCA.md                                 # NEW
    └── RCA_IMPLEMENTATION_REPORT.md           # NEW (this file)
```
