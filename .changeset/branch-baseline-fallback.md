---
"@syngrisi/syngrisi": minor
---

Add read-time baseline fallback to a project's configured main branch: when a check on another branch has no accepted baseline of its own, it is now compared against the main branch's accepted baseline instead of landing as `new`/`not_accepted`. Configure it per project via the new `mainBranch` field (Admin → AI → Projects settings, or `PATCH /v1/app/:id/triage-policy`). Accepting stays branch-scoped — a check's own branch still gets its own baseline on accept. Empty/unset `mainBranch` preserves today's behavior.
