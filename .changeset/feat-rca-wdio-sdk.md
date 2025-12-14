---
"@syngrisi/wdio-sdk": major
---

BREAKING: update getDomDump() return format for RCA compatibility

- Change getDomDump() return format from flat array to DomNode tree structure
- New format includes: tagName, attributes, rect, computedStyles, children, text
- Add skipDomData parameter to disable DOM data transmission
- Respect SYNGRISI_DISABLE_DOM_DATA environment variable

Migration: If you were parsing getDomDump() output directly, update your code to handle the new tree structure.
