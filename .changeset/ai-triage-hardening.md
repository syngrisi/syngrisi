---
"@syngrisi/syngrisi": patch
---

Harden the AI Triage / RCA subsystem and fix several admin-panel bugs

Security and reliability:
- Require authentication and the admin role, and validate the request body with a strict schema, on `PATCH /v1/app/:id/triage-policy`; require authentication on `GET /v1/app` (both were previously reachable without auth).
- Escape user- and DB-derived data rendered into the `/ai/*` HTML views (reflected and stored XSS).
- Scope the `OPENAI_API_KEY` / OpenAI base URL to the openai provider only, so they no longer leak to Anthropic, Gemini, or a custom-baseUrl provider.
- Stop reflecting raw upstream response bodies from the AI provider "Test connection" check.
- Make the AI Triage queue "restart all" asynchronous (re-queues via the background scheduler instead of blocking the HTTP request), and retry transient provider failures a bounded number of times instead of permanently marking a check failed.

Admin panel:
- Confirm before restoring the database and before deleting a backup job, and guard those action buttons against double-submit.
- "Test connection" no longer sends the masked `***` API-key placeholder; the server backfills the stored key.
- Keep the user row in edit mode until a save succeeds and resync the row with server state on refetch.
- Resync the settings and plugin-settings forms with server state; use a proper numeric input instead of forcing an empty value to `0`; remove leftover debug logging.
- Confirm before discarding unsaved AI Triage edits when switching projects, and disable window-focus refetch that could silently overwrite them; use stable keys for the verdict/example rows.
- Add `rel="noopener noreferrer"` to the external documentation link and fix the log-refresh pluralization.
