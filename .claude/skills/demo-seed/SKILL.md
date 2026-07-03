---
name: demo-seed
description: Spin up an isolated, fully-featured Syngrisi demo instance and seed it with a feature tour built from REAL test-app fixtures. Use when the user wants a runnable demo/sandbox to look at the UI, show off features (visual diffs, match types, ignore regions, AI Triage & auto-accept, RCA DOM diff, cross-browser, branches), or reproduce a flow with realistic data. Features are grouped by run name so the runs list reads as a tour.
invocation: /demo-seed
version: 1.0.0
allowed-tools:
  - Bash
  - Read
---

# Syngrisi Demo Instance + Seeder

Boots an isolated Syngrisi server (separate DB + images dir, auth off, every
feature flag on) and seeds it with data that exercises the whole product,
grouped one-feature-per-run. All examples reuse REAL fixtures from the test app
(`packages/syngrisi/tests/files/*.png` and the RCA DOM pages under
`packages/syngrisi/e2e/fixtures/rca-test-scenarios`).

## Run it

```bash
# build (server + UI + playwright-sdk) if needed, start the server, seed it
seed-data/run-demo.sh

# faster: skip the build if dist is already current
SKIP_BUILD=1 seed-data/run-demo.sh

# custom port / db / images dir
PORT=3010 DB=SyngrisiDemo IMAGES=/tmp/demo-imgs seed-data/run-demo.sh

# stop the running demo server
seed-data/run-demo.sh stop
```

When it finishes it prints the URL (default **http://localhost:3000**), the
server PID (log at `seed-data/.demo-server.log`), and the stop command.

Requirements: a local MongoDB running on `127.0.0.1:27017`.

## What the script does

1. Builds `packages/syngrisi` (server + UI) and `packages/playwright-sdk` (skip with `SKIP_BUILD=1`).
2. Drops the demo DB + images dir **before** starting, so the run is clean and the server re-seeds default settings on boot (`createInitialSettings()`).
3. Starts an isolated server with every feature on:
   `SYNGRISI_AUTH=false SYNGRISI_TEST_MODE=true SYNGRISI_RCA=true SYNGRISI_DISABLE_DOM_DATA=false SYNGRISI_AI_TRIAGE_ENABLED=true SYNGRISI_AI_TRIAGE_POLL_INTERVAL_MS=2000`, isolated `SYNGRISI_DB_URI` + `SYNGRISI_IMAGES_PATH`.
4. Symlinks the local (current) `@syngrisi/playwright-sdk` into `seed-data` — the npm copy is older and lacks DOM/RCA support.
5. Runs the feature-grouped seeder (`seed-data/tests/demo-seed.spec.ts`, `yarn seed:demo`).

## Feature tour (one run per feature)

| Run | Feature | Fixtures |
|-----|---------|----------|
| **Passing** | green checks | A.png vs A.png |
| **Regression** | failed visual diff | A.png vs B.png (~5.7%) |
| **New Baselines** | `new` status | People1/People2.png, never accepted |
| **Match · Tolerant** | `matchType: tolerant` + threshold | low_diff_0 vs low_diff_1 |
| **Match · Anti-aliasing** | `matchType: antialiasing` | anti_off vs anti_on |
| **Ignore Regions** | masked comparison region | A vs B with an ignore box |
| **AI Triage** | deterministic AI verdicts (fake provider → `/ai/triage/:id/run`) | likely_bug@9, noise@8, intended_change@8, noise@3 (masked to unknown) |
| **AI Auto-Accept** | triage auto-accept policy | noise@10 → auto-accepted; likely_bug@10 → kept for review |
| **RCA** | root-cause DOM diff | base.html vs added-elements/text-change/broken-layout, DOM captured live |
| **Cross-browser** | browser/viewport/OS variety | chromium/firefox/webkit |
| **Branches** | per-branch runs | main/develop/feature/release |

## How AI verdicts stay deterministic

The seeder sets the **fake** triage provider (`PATCH /v1/settings/ai_triage_provider`)
with the exact `fakeVerdict`/`fakeConfidence` it wants, then triages each check
synchronously via `POST /ai/triage/:id/run`. It deliberately does **not** enable
the app for the background scheduler, so no scheduler run races the verdict.
Auto-accept is driven by the app's `triagePolicy` (applied inside the manual run),
so it works without the scheduler too.

## Editing / extending

- Seeder logic: `seed-data/tests/demo-seed.spec.ts` — each `test()` is one feature/run and is independent (`--workers=1`, no serial-abort).
- Helpers: `makeBaseline()` (creates + accepts a baseline, returns the VRSBaseline id), `makeActual()` (submits the compared check), plus raw HTTP helpers for triage/settings/baseline PUTs (auth is off, so no auth header is needed).
- To add a run, copy an existing `test()` and give it a distinct `run` name.
