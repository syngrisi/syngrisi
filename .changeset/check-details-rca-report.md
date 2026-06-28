---
"@syngrisi/syngrisi": minor
---

Check Details, RCA and reporting improvements

- **RCA panel**: controls moved into a dedicated panel toolbar (wireframe toggle + change-stats badges), full light/dark theme support, neutral (non status-colored) Issues / All Changes tabs, and a fix for the wireframe overlay being hidden behind the screenshot. New icons for the RCA toggle (microscope) and the wireframe toggle.
- **Copy check info**: a button in the Check Details header copies a Markdown summary (status, project/suite/test/run, resolution, browser, OS, branch, diff %, id, deep link) to the clipboard.
- **Download screenshots**: a Check Details menu item saves the actual / baseline / diff images as PNG files named after the check.
- **Toolbar layout**: the three-dots menu moved to the far right, the RCA toggle restyled to match the other toolbar icons, and RCA / AI Match / Triage grouped together without dividers.
- **Run report API**: new `GET /ai/report/:runId` endpoint returning an aggregated run report (run metadata, status breakdown, diff summary, and the tests with their checks).
