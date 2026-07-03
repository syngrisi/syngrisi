---
"@syngrisi/syngrisi": patch
---

Server hardening: reject unknown Mongo operators in client-supplied filters (blocks NoSQL operator injection such as `$where`/`$expr`), make AI Triage and AI Match background schedulers safe for multi-instance deployments via atomic per-check claims with a lease, and replace synchronous `fs` calls in request paths with `fs.promises`.
