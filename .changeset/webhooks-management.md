---
"@syngrisi/syngrisi": minor
---

Add webhooks management: a CRUD API (`GET/POST/PATCH/DELETE /v1/webhooks`) and admin UI to register, enable/disable and delete webhooks on top of the existing delivery engine, plus a new `test.finished` event fired when a test session ends. See `packages/syngrisi/docs/WEBHOOKS.md`.
