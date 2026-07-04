---
"@syngrisi/syngrisi": minor
---

Admin UI unification: a shared page header (icon + title + description) across all admin pages; boolean settings now use a single Switch instead of a select+checkbox; the Users list is a proper table with Add/Edit/Delete modals (matching the Webhooks page) instead of an always-editable input grid, and no longer shows raw Id/Password columns. The main results grid hides the low-value Id column by default (still toggleable), renders Viewport as plain text to match the other meta cells, and aligns the "running" status color with the run rings.
