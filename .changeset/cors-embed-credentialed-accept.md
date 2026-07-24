---
"@syngrisi/syngrisi": minor
---

CORS & Embed: admin-managed credentialed cross-origin Accept (e.g. from Jenkins Allure) without sharing an API key.

- **Admin → CORS & Embed**: enable flag, allowed origins, credentials, session `SameSite` (`lax`|`none`), CSRF requirement, Accept roles/statuses, optional CSP `frame-ancestors`
- **API**: `GET/PUT /v1/cors-embed`, `GET /v1/cors-embed/csrf`, `POST /v1/cors-embed/prepare-cookie`, `GET /v1/cors-embed/status`
- **Middleware**: production credentialed CORS + CSRF for allowlisted origins; session cookie upgrade when `sameSite=none`
- **Accept guard**: cross-origin Accept limited to configured roles and check statuses / fail reasons
- **Docs**: `docs/CORS_EMBED.md`; e2e coverage under `INTEGRATION/cors_embed` and `AP/settings/cors_embed_ui`
- **Fix**: clear `base_filter` atomically when changing navbar Group by (stale run filter after regrouping)
