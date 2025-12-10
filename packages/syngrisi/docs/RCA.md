# Root Cause Analysis (RCA)

## Overview

Root Cause Analysis (RCA) is a feature that helps understand **WHY** visual regressions occurred, not just **WHAT** changed. Instead of only seeing red pixels in a diff image, RCA shows which DOM elements were added, removed, or had their styles changed.

## How It Works

### Architecture

```
SDK (Playwright/WDIO)     Server                  UI
     │                      │                     │
     │ collect DOM ───────► │ store .dom.gz ────► │ fetch DOM
     │ with screenshot      │ (gzip compressed)   │
     │                      │                     │ diff algorithm
     │                      │                     │ (client-side)
     │                      │                     │
     │                      │                     │ display changes
     │                      │                     │ + wireframe overlay
```

1. **SDK** collects DOM snapshot along with screenshot
2. **Server** stores DOM as compressed `.dom.gz` file (gzip, SHA256 deduplication)
3. **UI** fetches both baseline and actual DOM, runs diff algorithm, displays results

### DOM Snapshot Structure

```typescript
interface DOMNode {
  tagName: string;
  attributes: Record<string, string>;
  rect: { x: number; y: number; width: number; height: number };
  computedStyles: Record<string, string>;
  children: DOMNode[];
  text?: string;
}
```

Collected styles: `display`, `visibility`, `opacity`, `position`, `width`, `height`, `margin*`, `padding*`, `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `textAlign`, `overflow`, `zIndex`, `transform`, `flex*`, `grid*`

## Usage

### Enabling DOM Collection in SDK

#### Playwright SDK

```typescript
import { SyngrisiDriver } from '@syngrisi/playwright-sdk';

const syngrisi = new SyngrisiDriver(page, {
  // ... other options
});

// Enable DOM collection for a check
await syngrisi.check('My Check', { collectDom: true });
```

#### WDIO SDK

```typescript
// DOM collection is automatic when using getDomDump helper
await browser.syngrisiCheck('My Check');
```

### Using RCA in UI

1. Open a failed check with visual differences
2. Click the **RCA button** (brain icon) in the toolbar, or press **D** key
3. The RCA panel opens showing:
   - Summary: total changes, added, removed, style changes
   - Issues list with expandable details
4. **Wireframe overlay** appears on the canvas showing DOM element boundaries
5. Click on an issue to highlight the corresponding element on the canvas

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SYNGRISI_DOM_SNAPSHOTS_PATH` | Path to store DOM snapshots | Uses `SYNGRISI_IMAGES_PATH` |

### Storage

DOM snapshots are stored as:
- Filename: `{checkId}_{type}_{timestamp}.dom.gz`
- Type: `actual` or `baseline`
- Compression: gzip
- Deduplication: SHA256 hash

## API Endpoints

### Get Actual DOM
```
GET /v1/checks/:id/dom
```

### Get Baseline DOM
```
GET /v1/baselines/:id/dom
```

## Change Types

| Type | Description | Color |
|------|-------------|-------|
| `added` | Element exists in actual but not in baseline | Green |
| `removed` | Element exists in baseline but not in actual | Red |
| `style_changed` | Element's computed styles differ | Orange |
| `content_changed` | Element's text content differs | Orange |
| `geometry_changed` | Element's position or size changed | Orange |

## Technical Details

### DOM Diff Algorithm

1. Build XPath map for both DOM trees
2. Find removed nodes (in baseline, not in actual)
3. Find added nodes (in actual, not in baseline)
4. For matching nodes: compare geometry, styles, content
5. Return array of `DOMChange` objects

### Wireframe Overlay

The wireframe overlay draws dashed rectangles around changed DOM elements:
- Uses fabric.js canvas
- Coordinates transformed using image position and scale
- Updates on zoom/pan

## Files Structure

```
packages/syngrisi/
├── src/
│   ├── server/
│   │   ├── models/DomSnapshot.model.ts      # MongoDB model
│   │   ├── services/dom-snapshot.service.ts  # CRUD operations
│   │   └── routes/v1/
│   │       ├── checks.route.ts              # GET /checks/:id/dom
│   │       └── baselines.route.ts           # GET /baselines/:id/dom
│   │
│   └── ui-app/
│       ├── shared/
│       │   ├── interfaces/IRCA.ts           # TypeScript interfaces
│       │   ├── services/rca.service.ts      # API client
│       │   └── utils/domDiff.ts             # Diff algorithm
│       │
│       └── index2/components/Tests/Table/Checks/CheckDetails/
│           ├── RCA/
│           │   ├── RCAPanel.tsx             # Main panel component
│           │   ├── useRCA.ts                # React hook
│           │   └── sections/                # Panel sections
│           │
│           └── Canvas/
│               └── rcaOverlay.ts            # Wireframe overlay
│
├── packages/core-api/
│   ├── schemas/DomNode.schema.ts            # Zod schema
│   └── src/
│       ├── compression.ts                   # gzip utilities
│       └── domCollector.ts                  # Browser script
│
└── packages/playwright-sdk/
    └── src/PlaywrightDriver.ts              # collectDom option
```

## Limitations

- DOM collection increases check payload size (~2-30KB compressed)
- Very large DOM trees (>10,000 nodes) may impact performance
- Some dynamic elements (canvas, SVG internals) are not fully captured
- CSS pseudo-elements are not captured

## Troubleshooting

### DOM not available for a check

1. Ensure SDK version supports DOM collection
2. Enable `collectDom: true` option when calling `check()`
3. Check server logs for DOM storage errors

### Wireframe misaligned

1. Ensure image is fully loaded before enabling RCA
2. Check if custom CSS transforms are applied to the page
3. Verify viewport size matches original screenshot

### RCA panel shows no changes

1. Check if both baseline and actual have DOM snapshots
2. Verify DOM was collected with same viewport size
3. Check browser console for diff algorithm errors
