---
"@syngrisi/syngrisi": minor
"@syngrisi/core-api": minor
"@syngrisi/playwright-sdk": minor
"@syngrisi/wdio-sdk": minor
---

Add GitHub commit-status integration: an optional `commit` param on `startSession` (SDKs and core-api) is persisted on the Run, and a session's outcome (pending/success/failure) is reported back to GitHub via `POST /repos/{owner}/{repo}/statuses/{sha}` with a deep link to the run's grid. Configure via `SYNGRISI_GITHUB_TOKEN`, `SYNGRISI_GITHUB_REPO`, `SYNGRISI_PUBLIC_URL` (and optional `SYNGRISI_GITHUB_API_URL`); dormant (zero requests) unless all of these plus a run's `commit` are set. See `docs/environment_variables.md`.
