---
"@syngrisi/syngrisi": minor
"@syngrisi/node-resemble.js": minor
---

Add a true pixel-to-pixel comparison mode and make it the default

The default comparison mode (`matchType: 'nothing'`, previously labelled **Standard**) now performs an **exact, zero-tolerance** pixel-to-pixel comparison and is labelled **Pixel Perfect** in the UI. The previous behaviour — which tolerated differences up to ±16 per colour channel despite being called "Standard" — is still available as a new **Tolerant** mode (`matchType: 'tolerant'`).

- `node-resemble.js` gains an `exact()` method (all tolerances set to 0). `ignoreNothing()` keeps its ±16 behaviour and now backs the Tolerant mode.
- Baseline match-type options: `nothing` (Pixel Perfect, exact, default), `tolerant` (allow minor per-pixel differences), `antialiasing`, `colors`.

⚠️ **Behaviour change (no data migration):** existing baselines with `matchType: 'nothing'` (or unset) are now compared strictly. Renders that previously passed thanks to the ±16 tolerance may start reporting differences. To restore the old leniency for a baseline, switch its match type to **Tolerant**.
