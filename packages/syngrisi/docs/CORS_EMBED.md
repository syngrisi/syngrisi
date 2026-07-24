# CORS & Embed

Credentialed cross-origin API access for trusted browser origins (for example
Accept baselines from a Jenkins Allure report while the reviewer is already
logged into Syngrisi). Managed in **Admin → CORS & Embed**.

## Settings

Stored as AppSettings document `cors_embed`:

| Field | Description |
|---|---|
| `enabled` | Master switch (default `false`) |
| `allowedOrigins` | Exact browser Origins (scheme + host + port) |
| `allowCredentials` | Echo `Access-Control-Allow-Credentials: true` |
| `sameSite` | Session cookie `lax` or `none` (HTTPS required for `none`) |
| `csrfRequired` | Require `X-CSRF-Token` on cross-origin mutating `/v1` calls |
| `allowedAcceptRoles` | Roles allowed to Accept via cross-origin requests |
| `allowedAcceptStatuses` | `new` and/or failReasons filter for Accept |
| `frameAncestors` | Extra CSP `frame-ancestors` (optional) |

When `sameSite` is `none`, `csrfRequired` must stay `true`.

## Admin API

- `GET /v1/cors-embed` — admin: read settings
- `PUT /v1/cors-embed` — admin: replace settings (`{ value: {...} }` or body)
- `GET /v1/cors-embed/csrf` — logged-in: issue CSRF token into the session
- `POST /v1/cors-embed/prepare-cookie` — logged-in: re-issue session cookie for cross-site use
- `GET /v1/cors-embed/status` — logged-in: whether the current Origin is allowlisted

## Client flow (Allure / CI)

1. Admin enables the feature and adds the CI Origin; set `sameSite` to `none`.
2. Reviewer logs into Syngrisi (same-origin browsing upgrades the cookie when `sameSite=none`, or use **Prepare session cookie**).
3. From the allowlisted origin, with `credentials: 'include'`:
   - `GET /v1/cors-embed/csrf` → `csrfToken`
   - mutating calls (e.g. `PUT /v1/checks/:id/accept`) with header `X-CSRF-Token: <csrfToken>`

Cross-origin Accept additionally enforces `allowedAcceptRoles` and
`allowedAcceptStatuses`. Same-origin Accept is unchanged.
