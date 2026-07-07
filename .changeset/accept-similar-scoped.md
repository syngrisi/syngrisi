---
"@syngrisi/syngrisi": patch
---

Fix: accepting from the "AI match / similar" view no longer accepts the whole
test. When the grid is filtered to a subset of checks (similar/AI-match, or a
triage `_idIn` set), the bulk "accept tests" action now accepts only those
displayed checks — the server-side `test.accept` takes an optional `checkIds`
filter (`PUT /v1/tests/accept/:id` body), and the UI passes the currently
filtered check ids. With no filter, the whole test is accepted as before.
