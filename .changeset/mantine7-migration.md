---
"@syngrisi/syngrisi": minor
---

Migrate Mantine UI library from v5 to v7

Complete migration of the React UI component library across 150+ files. Key changes include removal of createStyles/sx in favor of inline styles, new provider architecture (Spotlight, Notifications, ColorScheme), prop renames (position→justify, spacing→gap, color→c, weight→fw), ScrollArea infinity scroll via onBottomReached, and List.Item onClick workaround via native DOM listeners.
