---
"@syngrisi/syngrisi": minor
---

Optimize React frontend performance: memoization, code splitting, and lazy rendering

- Add React.memo to key components (Row, Check, RunItem, SuiteItem, BaseItemWrapper, Header) to prevent cascade re-renders
- Add useCallback/useMemo for stable function references and computed values
- Code-split CheckDetails (with fabric.js) into lazy-loaded chunk, reducing main bundle from 585KB to 147KB (-75%)
- Lazy-load ChecksList route
- Conditionally render Checks only when table row is expanded, preventing unnecessary API queries for collapsed rows
- Fix useMemo dependencies in useInfinityScroll
