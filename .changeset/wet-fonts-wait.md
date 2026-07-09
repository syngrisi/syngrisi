---
'@syngrisi/playwright-sdk': minor
'@syngrisi/wdio-sdk': minor
'wdio-syngrisi-cucumber-service': patch
---

Add `driver.waitForFonts()` helper to both SDKs to prevent flaky "slightly shifted text" diffs caused by `font-display: swap` webfonts swapping in after the screenshot is captured (reproduced with mongodb.com-style pages). Call it right before taking a screenshot. Boilerplate snippets in the SDK READMEs and the cucumber service README now include the wait.
