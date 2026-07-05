---
"@syngrisi/syngrisi": minor
---

Security & correctness hardening batch (audit-driven):

- **Security**: stop leaking password/salt/apiKey hashes from `GET /v1/users`;
  scope share tokens to their own check (fix IDOR across DOM snapshots, baseline
  history and the `/snapshoots` static dir); opt-in webhook SSRF protection
  (`SYNGRISI_WEBHOOK_SSRF_PROTECTION`, default off) + no more `secret` leak on
  webhook registration; reject Mongo operator-injection / bound the name regex on
  the AI checks endpoint; prevent Zip-Slip in admin data restore; default SAML
  assertion/response signature verification on (opt-out via env), production
  `secure` session cookie + HSTS, tightened CSP.
- **Bug fixes**: snapshot image files are now actually removed on the last
  reference (were leaking on disk); check removal deletes actual/diff snapshots by
  their own field; database restore takes a pre-restore safety backup and rolls
  back on failure, with an atomic job-admission lock (no more destructive
  drop-before-import).
- **Quality/tooling**: server unit tests wired into a runnable `test:server` +
  root `verify` + CI job; characterization tests for critical/destructive paths;
  UI fixes (JSON.parse guard, memoization, real LRU image cache, RCA cancellation);
  auth middleware fully type-checked (`@ts-nocheck` removed); ~17 MB of dead code
  removed; controller→service layering for auth/client/baseline controllers.
