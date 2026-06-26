---
"@syngrisi/syngrisi": minor
---

AI Match (Beta): from one failed check, find the same visual change across the other failed checks in the same run — other resolutions **and** other browsers (not limited to cross-resolution). The Check Details modal gains an "AI Match" icon that leaves the modal and filters the main grid to the ranked cluster, auto-expanded, each check showing a `~NN%` similarity score; the active filter appears as a compact, resettable badge inside the quick filter. Matching is 100% local — a lightweight Lab colour-histogram change descriptor, no ML model and no network — computed per check in the background and ranked by cosine distance. Configurable per project: a match threshold under Admin → AI → Projects settings (a new tab housing the per-project triage and AI Match settings). Off by default.
