---
"@syngrisi/syngrisi": patch
---

Clarify the two AI Triage switches in the admin panel

The global master switch (Settings tab) is now labelled "Enable AI Triage (whole instance)" with a description explaining it controls the feature and its UI controls instance-wide. The per-project switch (Projects settings tab) is now labelled "Auto-triage for this project" with a description noting it auto-classifies new failed checks and requires AI Triage to be enabled instance-wide. This removes the confusion where toggling the per-project switch appeared to do nothing to the toolbar controls.
