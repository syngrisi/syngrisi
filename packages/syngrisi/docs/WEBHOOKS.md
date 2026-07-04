# Webhooks

Syngrisi can notify external systems (Slack, CI, ChatOps, ...) about lifecycle
events by POSTing a JSON payload to one or more registered webhook URLs.

This document covers the management API and the delivery contract. Webhooks
are managed via the REST API described below, or via the admin UI at
`/admin/webhooks`.

## Events

| Event | Fired when | Payload |
|---|---|---|
| `check.created` | A new visual check is created | The created check document |
| `check.updated` | A check is updated (accepted, rejected, recompared, ...) | The updated check document |
| `test.finished` | A test session ends (`endSession`) | The updated test document (`status`, `blinking`, `app`, `run`, `branch`, ...) |

`test.finished` fires once per test session (when the SDK/client ends the
session), not once per check.

## Delivery

For every fired event, Syngrisi looks up all enabled webhooks subscribed to
that event (`Webhook.find({ events: event, enabled: { $ne: false } })`) and
sends, for each one:

```
POST <webhook.url>
Content-Type: application/json
X-Syngrisi-Event: <event>
X-Syngrisi-Secret: <webhook.secret or empty string>

{
  "event": "<event>",
  "payload": { ... },
  "timestamp": "2024-06-13T18:33:38.617Z"
}
```

Delivery is fire-and-forget with a single attempt and a 5s timeout. Delivery
failures are logged, not retried, and never affect the triggering request
(check/test API calls always succeed regardless of webhook delivery outcome).

Use the `X-Syngrisi-Secret` header to verify the request came from your
Syngrisi instance (simple shared-secret check; there is no HMAC signature).

## Management API

All endpoints require `ensureLoggedIn()` (a logged-in session or API key).

`secret` is **write-only**: it can be set on create/update but is never
returned by any endpoint (GET, POST, PATCH, DELETE responses all strip it).

### List webhooks

```
GET /v1/webhooks
```

Paginated (`limit`, `page`, `sortBy`, `filter` query params, same convention
as other list endpoints, e.g. `/v1/suites`).

### Create a webhook

```
POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://example.com/hooks/syngrisi",
  "events": ["check.created", "check.updated", "test.finished"],
  "secret": "optional-shared-secret",
  "enabled": true
}
```

`events` defaults to `["check.updated", "check.created"]` if omitted.
`enabled` defaults to `true`.

### Update a webhook

```
PATCH /v1/webhooks/{id}
Content-Type: application/json

{ "enabled": false }
```

Any subset of `url`, `events`, `secret`, `enabled` may be sent.

### Delete a webhook

```
DELETE /v1/webhooks/{id}
```

## Example: cURL

```bash
curl -X POST http://localhost:3000/v1/webhooks \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/hooks/syngrisi","events":["test.finished"]}'
```
