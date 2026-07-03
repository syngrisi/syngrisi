---
"@syngrisi/syngrisi": minor
---

Add a baseline "time machine": a history slider over a check's accepted baselines (`GET /v1/baselines/history`), with an optional AI-generated one-line summary of what changed between two consecutive baselines (`POST /v1/baselines/history-summary`, reusing the configured AI triage provider; degrades to a plain slider when no provider is configured). New "History" action on the Baselines table opens a modal with the slider and prev/next controls.
