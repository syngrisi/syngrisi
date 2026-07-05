---
"@syngrisi/core-api": minor
"@syngrisi/wdio-sdk": patch
"@syngrisi/playwright-sdk": patch
---

Consolidate shared SDK code into @syngrisi/core-api: both SDKs now consume the
shared paramsGuard and the canonical check schema from core-api; removed dead
duplicated utils and RequiredIdentOptionsSchema. No public driver method
signatures changed.
