---
"@syngrisi/core-api": minor
---

feat: add DOM snapshot types and compression utilities for RCA

- Add DomNode schema for typed DOM tree representation
- Add compression utilities for efficient DOM data transfer (gzip for payloads > 50KB)
- Add domCollector module for browser-side DOM tree collection
- Add optional skipDomData parameter to control DOM data transmission
- Add SYNGRISI_DISABLE_DOM_DATA environment variable support
