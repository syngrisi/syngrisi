---
"@syngrisi/syngrisi": minor
---

RCA (Root Cause Analysis) is now a persistent admin setting. Admins can toggle
it from **Admin → Settings** without a restart (default OFF). The `SYNGRISI_RCA`
environment variable still takes priority when set: the toggle is then locked
and shows a "Set by SYNGRISI_RCA" badge with an explanatory note. `SYNGRISI_RCA`
is read directly from the environment (no longer a strict envalid var, so an
empty value no longer crashes the server).

Settings UX cleanup: boolean settings now show a single toggle (the redundant
second "enabled" switch is gone) and each setting card has a "?" help icon that
reveals its description on click.
