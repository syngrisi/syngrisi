---
"@syngrisi/syngrisi": minor
---

RCA bug fixes and panel polish

- **Empty baseline**: a check whose baseline DOM is empty/degenerate (e.g. a cleared `<body>`) now reports its added/removed elements instead of "No DOM changes detected".
- **Issue aggregation**: many similar structural changes are grouped into a single issue card (e.g. "4 elements added (div)", "9 elements moved or resized") instead of one near-identical card per element.
- **Stats badges**: the RCA panel now shows geometry and content/text badges so the per-type counts reconcile with the total.
- **Panel layout**: stats on the left and the wireframe toggle on the right of the panel toolbar, theme-aware light/dark, neutral Issues/All Changes tabs, the severity icon color matches its badge, long XPaths are truncated to one line with the full path on hover, and the expanded issue/change card is highlighted.
- **Wireframe overlay** is now actually visible (it was rendering but at a near-invisible opacity).
