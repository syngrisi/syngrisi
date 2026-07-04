---
"@syngrisi/syngrisi": minor
---

Check Details three-dots menu gains "Open in Baselines" (jump to the baselines grid filtered by the check's name) and "Time machine" (open the baseline history modal inline). The branch-baseline fallback is now explicit opt-in via a `branchFallbackEnabled` toggle (default off), with its settings moved from the AI page into a new "Project settings" tab under Admin → Settings. Adds a `run.finished` webhook event, fired when a run's last test finishes. Fixes the Delete Baseline modal's "N checks" link, which pointed at a non-existent `/checks` route (now `/checks-list?baselineId=…`, with ChecksList able to filter by baseline).
