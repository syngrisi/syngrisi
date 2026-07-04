---
"@syngrisi/syngrisi": patch
---

Add an official `syngrisi-status` composite GitHub Action (poll `/v1/tests?filter={"run":...}` and gate the job on Passed/Failed/New) plus an example reusable workflow, and document the two-piece CI setup (server-side `commit` status via `startTestSession`, CI-side poll-and-gate) in a new `docs/CI.md` guide linked from the README.
