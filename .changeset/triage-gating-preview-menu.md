---
"@syngrisi/syngrisi": minor
---

AI Triage gating, preview card menu and Backup page fix

- **AI Triage gating**: the "Filter by AI verdict" toolbar control and the "Run AI triage" button in Check Details are now hidden when AI triage is globally disabled. The global `ai_triage_enabled` flag is exposed via `GET /settings/public` so the UI can react to it.
- **Preview card menu**: each check preview card now has a three-dots menu in its title with "AI Match" (find similar checks) and "Delete baseline".
- **Backup page**: fixed column/value misalignment in the Job History table on the Data Management page.
