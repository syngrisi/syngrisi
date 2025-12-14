---
"@syngrisi/playwright-sdk": minor
---

feat: add DOM collection capabilities for RCA (Root Cause Analysis)

- Add collectDomDump() method for automatic DOM tree collection
- Add optional collectDom parameter in check() method
- Add skipDomData parameter to disable DOM data transmission
- Respect SYNGRISI_DISABLE_DOM_DATA environment variable
- Improve TypeScript typing for domDump parameter (DomNode instead of any)
