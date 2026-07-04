---
"@syngrisi/syngrisi": minor
---

Add baseline promotion and per-project retention.

- **Baseline promotion on merge**: promote a feature branch's accepted baselines to the project's main branch via a new `POST /v1/baselines/promote` endpoint (accepts `{runId}` or `{app, fromBranch, toBranch?}`, CI-callable with an API key) and a "Promote baselines to main" action in the run kebab menu.
- **Per-project retention**: auto-delete old checks per project, configured in Admin → Settings → Project settings (`retentionEnabled` / `retentionDays`). The cleanup scheduler now also runs per-project retention on top of the instance-wide policy.
