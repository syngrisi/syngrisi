---
"@syngrisi/syngrisi": minor
---

feat: add Root Cause Analysis (RCA) feature for visual regression debugging

Server:
- Add DomSnapshot model for storing DOM snapshots with gzip compression
- Add dom-snapshot.service for DOM snapshot CRUD operations with deduplication
- Add new API endpoints: GET /v1/checks/{id}/dom, GET /v1/baselines/{id}/dom
- Add x-domdump-compressed header support for compressed DOM data
- All DOM operations are non-critical (wrapped in try-catch)

UI:
- Add RCA panel component with DOM diff visualization
- Add wireframe overlay for visual element highlighting
- Add RCA toggle button in toolbar (keyboard shortcut: D)
- Display change statistics: added nodes, removed nodes, style changes
- Show detailed property changes (before/after values)
- Graceful error handling when DOM data is unavailable

Configuration:
- Add SYNGRISI_DOM_SNAPSHOTS_PATH for custom DOM storage location
- Backward compatible: checks without DOM data work as before
