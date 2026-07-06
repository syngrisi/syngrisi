---
"@syngrisi/core-api": patch
---

Restore transient-failure retries lost in the got→fetch migration: idempotent
requests (getIdent/getBaselines/getSnapshots and the accept/updateBaseline PUTs)
now retry on network-level errors and retryable 5xx/408/429 statuses, matching
got's previous default. POST requests (startSession/createCheck) are still never
retried.
