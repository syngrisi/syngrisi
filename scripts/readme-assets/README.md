# README assets generator

Reproducible harness that generates the marketing screenshots used in the root
[`README.md`](../../README.md). Not part of the published packages.

- `demo-site/index.html` — self-contained analytics dashboard. Render with `?v=2` to
  introduce intentional visual regressions (for "failed" checks).
- `seed.cjs` — renders the demo site and pushes real screenshots through
  `@syngrisi/playwright-sdk` (a baseline run, a passing run, and a failing run).
- `shoot.cjs` — captures the Syngrisi UI (dashboard, per-test checks, diff viewer)
  into `../../assets/screenshots/`.

## Usage

```bash
# 1. Start Syngrisi locally (auth disabled), e.g. from packages/syngrisi:
#    SYNGRISI_AUTH=false node ./dist/server/server.js
# 2. Seed demo data and capture screenshots from the repo root:
node scripts/readme-assets/seed.cjs
node scripts/readme-assets/shoot.cjs
```

Requires the playwright-sdk to be built (`yarn --cwd packages/playwright-sdk build`) and
Playwright Chromium available.
