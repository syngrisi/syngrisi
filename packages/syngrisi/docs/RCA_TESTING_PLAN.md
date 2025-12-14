# RCA Testing Implementation Plan

## Phase 1: SDK Changes

### 1.1 Core API (`packages/core-api`)
- [x] Add `SYNGRISI_DISABLE_DOM_DATA` environment variable check in `src/SyngrisiApi.ts`
- [x] Add `skipDomData?: boolean` option to `CheckParamsSchema` in `schemas/SyngrisiApi.schema.ts`
- [x] Update `performCheck` method to respect both env var and option

### 1.2 Playwright SDK (`packages/playwright-sdk`)
- [x] Add `skipDomData?: boolean` to `CheckOptionsSchema` in `src/schemas/Check.schema.ts`
- [x] Update `check()` method in `src/PlaywrightDriver.ts` to pass `skipDomData` option
- [x] Respect `SYNGRISI_DISABLE_DOM_DATA` env var when `collectDom: true`

### 1.3 WDIO SDK (`packages/wdio-sdk`)
- [x] Add `skipDomData?: boolean` to `CheckParams` type in `src/types.ts`
- [x] Update `check()` method in `src/WDIODriver.ts` to pass `skipDomData` option

---

## Phase 2: HTML Test Fixtures

### 2.1 HTML Changes Scenarios (`e2e/fixtures/rca-test-scenarios/html-changes/`)
- [x] Create `base.html` - baseline page with div, p, span elements
- [x] Create `added-elements.html` - page with 2 new div elements added
- [x] Create `removed-elements.html` - page with div removed
- [x] Create `text-change.html` - page with changed text content

### 2.2 CSS Changes Scenarios (`e2e/fixtures/rca-test-scenarios/css-changes/`)
- [x] Create `base.html` - styled baseline page
- [x] Create `color-change.html` - changed background-color
- [x] Create `size-change.html` - changed width/height
- [x] Create `position-change.html` - changed margin/padding

### 2.3 Edge Cases (`e2e/fixtures/rca-test-scenarios/edge-cases/`)
- [x] Create `large-dom.html` - page with 5000+ DOM elements
- [x] Create `minimal.html` - minimal HTML (only body)
- [x] Create `large-dom-modified.html` - modified version for comparison
- [x] Create `minimal-modified.html` - modified version for comparison

---

## Phase 3: E2E Tests

### 3.1 Feature Files (`e2e/features/RCA/`)
- [x] Create `rca_html_changes.feature` - test HTML structure changes
- [x] Create `rca_css_changes.feature` - test CSS style changes
- [x] Create `rca_edge_cases.feature` - test large DOM, no DOM data
- [x] Create `rca_no_dom_data.feature` - test behavior without DOM snapshots

### 3.2 Step Definitions (`e2e/steps/domain/rca-scenarios.steps.ts`)
- [x] Add step: `Given I create RCA test with {string} as baseline`
- [x] Add step: `When I create RCA actual check with {string}`
- [x] Add step: `Then the RCA panel should show added elements`
- [x] Add step: `Then the RCA panel should show removed elements`
- [x] Add step: `Then the RCA panel should show style changes`
- [x] Add step: `Then the RCA panel should show no DOM data message`

---

## Phase 4: Verification

- [x] Run `npx tsc --noEmit` in all modified packages (core-api, playwright-sdk, wdio-sdk) - PASSED
- [ ] Run RCA E2E tests: `npx playwright test "features/RCA/*.feature"`
- [ ] Verify RCA demo still works: `npx playwright test "features/DEMO/rca_demo.feature"`

---

## Test Scenarios Matrix

| Scenario | Baseline | Actual | Expected RCA Result |
|----------|----------|--------|---------------------|
| HTML: Add elements | base.html | added-elements.html | Shows 2 added elements |
| HTML: Remove elements | base.html | removed-elements.html | Shows 1 removed element |
| HTML: Text change | base.html | text-change.html | Shows text content change |
| CSS: Color change | base.html | color-change.html | Shows background-color style change |
| CSS: Size change | base.html | size-change.html | Shows width/height style changes |
| Large DOM | large-dom.html | large-dom.html (modified) | Works without timeout |
| No DOM data | image only | image only | RCA shows "No DOM data" message |
| Mixed: DOM + no DOM | base.html with DOM | image only | RCA partially available |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SYNGRISI_DISABLE_DOM_DATA` | `false` | Disable DOM data collection/sending |

---

## Run Commands

```bash
# Run all RCA tests
cd packages/syngrisi/e2e
npx playwright test --project=default "features/RCA/*.feature" --workers=1

# Run specific scenario
npx playwright test --project=default "features/RCA/rca_html_changes.feature"

# Run with headed browser for debugging
npx playwright test --project=default "features/RCA/*.feature" --workers=1 --headed
```
