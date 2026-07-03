<div align="center">

<img src="assets/logo.svg" width="92" alt="Syngrisi logo" />

# Syngrisi

### Open-source Visual Testing Platform — catch visual regressions before your users do.

An **open-source visual regression testing platform** to capture screenshots from your
automated tests, compare them against approved baselines, and review every pixel change
in a fast, self-hosted web UI.

[![npm](https://img.shields.io/npm/v/@syngrisi/syngrisi?color=6366f1&label=npm)](https://www.npmjs.com/package/@syngrisi/syngrisi)
[![CI](https://img.shields.io/github/actions/workflow/status/syngrisi/syngrisi/ci.yml?branch=main&label=CI)](https://github.com/syngrisi/syngrisi/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](packages/syngrisi/LICENSE.md)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![Stars](https://img.shields.io/github/stars/syngrisi/syngrisi?style=social)](https://github.com/syngrisi/syngrisi/stargazers)

</div>

---

## 🎬 Demo

https://github.com/user-attachments/assets/24a666f0-6dc5-439d-be9a-8d7b2e411655


## Why Syngrisi?

Visual bugs — a broken layout, a clipped chart, a shifted button — slip straight through
unit tests and code review. Dedicated visual testing clouds catch them, but they are
expensive, send your screenshots to someone else's servers, and lock you in.

**Syngrisi gives you the same workflow, open-source and self-hosted:**

- 🆓 **Free & MIT-licensed** — no per-screenshot pricing, no seat limits.
- 🔒 **Your data stays yours** — runs entirely on your own infrastructure.
- 🔌 **Drop-in SDKs** for Playwright, WebdriverIO and Cucumber, plus a REST API.
- 🐳 **Up in one command** with Docker.

## ✨ Features

- 🖼️ **Pixel-perfect comparison** — powered by a Resemble.js-based engine with `nothing` / `antialiasing` / `colors` match modes.
- 🎯 **Tolerance threshold** — let checks pass within a configurable mismatch budget (per-baseline or per-check).
- 🙈 **Ignore regions & vertical-shift handling** — mask dynamic areas and absorb scroll offsets.
- 🌐 **Cross-browser, OS & viewport** — capture and group results by browser, platform, viewport and git branch.
- ✅ **Review workflow** — accept/reject baselines, mark checks as bugs, batch-accept, and share single checks via link.
- 🧭 **Powerful filtering & grouping** — group by run, suite, browser, platform or status; build nested `AND`/`OR` filters.
- 🧠 **AI Triage** _(beta)_ — a vision-LLM classifies each failed check (intended change / likely bug / noise) with a confidence score; auto-accept policies, per-project prompts & verdicts, and a fully self-hosted local-model option via Ollama.
- 🎯 **AI Match** _(beta)_ — from one failed check, instantly find the **same visual change** on every other resolution and browser, ranked by a similarity score — review the whole cluster of "one bug, many viewports" in a single pass. 100% local, no model required.
- 🤖 **Root Cause Analysis** _(beta)_ — captures a DOM snapshot alongside each screenshot to help explain **why** a check changed.
- 🕰️ **Baseline Time Machine** — scrub through a check's accepted baselines over time with a history slider, with an optional AI-generated one-line summary of what changed between steps.
- 🔐 **Auth, roles & SSO** — username/password, API keys, plus OAuth2 / SAML 2.0 single sign-on and an admin panel.
- 🧩 **Plugin system & rich configuration** — extend behaviour and tune everything through environment variables.
- 🔔 **Webhooks** — check/test lifecycle events with secret signing.
- ✅ **GitHub commit status** — report a run's pass/fail state straight to the PR, with a deep link back to the grid.
- 🐳 **Self-hosted & Docker-ready** — Express + MongoDB backend, React + Mantine UI.
- 🤖 **MCP server** — let AI agents query runs, view diffs and accept checks from the IDE.

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><img src="assets/screenshots/side-by-side.png" alt="Side-by-side slider comparison of baseline and actual" /><br/><sub><b>Side-by-side compare</b> — drag the slider between baseline and actual.</sub></td>
    <td width="50%"><img src="assets/screenshots/rca.png" alt="Root Cause Analysis panel listing DOM changes" /><br/><sub><b>Root Cause Analysis</b> — the DOM-level changes behind a diff, ranked by severity.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/screenshots/diff-chart.png" alt="Single-element diff" /><br/><sub><b>Pinpoint diffs</b> — exactly what changed, down to a single chart point.</sub></td>
    <td width="50%"><img src="assets/screenshots/checks-and-settings.png" alt="Per-test checks with a customizable dark UI" /><br/><sub><b>Per-test checks</b> — every check at a glance, with a customizable UI (dark theme, layouts, fields).</sub></td>
  </tr>
</table>

<div align="center">
  <img src="assets/screenshots/highlight.png" width="100%" alt="Difference highlighting reveals a tiny sub-pixel change on a globe" /><br/>
  <sub><b>Difference highlighting</b> — a 0.09% change across a handful of points becomes impossible to miss.</sub>
</div>

## ✨ NEW: AI Triage — let AI sort the red from the real _(beta)_

> **Stop drowning in red diffs.** A wall of failed checks after a refactor is the worst
> part of visual testing. Syngrisi now puts a **vision-LLM on triage duty**: it looks at
> the baseline, the actual and the diff, and tells you what each change actually is.

- 🧠 **Every failed check gets a verdict** — `intended change`, `likely bug`, `noise` or
  `uncertain`, with a confidence score and a one-line reason ("header overlaps content",
  "image failed to load", "dynamic timestamp updated").
- ⚡ **Auto-accept the boring stuff** — let intended changes and rendering noise accept
  themselves above a confidence threshold; real bugs are always kept for a human.
- 🗂️ **Triage at a glance** — group and filter the grid by AI verdict, so "9 noise, 3 real
  regressions" replaces "47 red checks". Verdicts update live, no reload.
- 🔒 **100% private — bring your own model** — point it at a **local model via Ollama**
  (Qwen-VL, Gemma…) and your screenshots never leave your machine. Or use any
  OpenAI-compatible / Anthropic / Gemini endpoint.
- 🎛️ **Yours to tune** — per-project verdicts, fully editable prompt with `{{placeholders}}`,
  few-shot example images, and a manual queue (restart / cancel) grouped by run.
- 🐳 **Private AI out of the box** — `docker compose --profile ai up` starts a bundled
  **Ollama** with a vision model and wires triage to it via env: zero API keys, zero
  screenshot egress. See [Private AI with Ollama](packages/syngrisi/docs/AI_FEATURES.md#private-ai-with-ollama-docker-profile).

> Enabled per project, **off by default**. See [AI Triage docs](packages/syngrisi/AI_TRIAGE.md).

<table>
  <tr>
    <td width="50%"><img src="assets/screenshots/ai-config.png" alt="Admin AI settings: provider and per-project triage" /><br/><sub><b>Provider & per-project config</b> — a known provider or a self-hosted model; custom verdicts and auto-accept threshold.</sub></td>
    <td width="50%"><img src="assets/screenshots/ai-filter.png" alt="Filter checks by AI verdict" /><br/><sub><b>Filter by verdict</b> — focus on likely bugs; hide intended changes and noise.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/screenshots/ai-grouping.png" alt="Group tests by AI verdict" /><br/><sub><b>Group by AI verdict</b> — triage a wall of red at a glance.</sub></td>
    <td width="50%"><img src="assets/screenshots/ai-queue.png" alt="AI triage queue grouped by run" /><br/><sub><b>Analysis queue</b> — grouped by run, with manual restart / cancel.</sub></td>
  </tr>
</table>

## 🎯 NEW: AI Match — one bug, every viewport, one click _(beta)_

> **A single layout regression rarely fails just once.** Bump a header and it breaks on
> mobile, tablet, desktop and in every browser you capture — a dozen red checks for **one
> root cause**. AI Match collapses that noise: open any failed check, hit the **AI Match**
> icon, and Syngrisi pulls up every other check with the *same* visual change.


https://github.com/user-attachments/assets/3dca7b0f-5056-423d-bef7-81d2ac6f6125


- 🎯 **Same change, everywhere** — finds the identical diff across other resolutions **and**
  other browsers in the run, not just look-alikes by name.
- 📊 **Ranked by similarity** — each match shows a `~NN%` score so the closest siblings sort
  to the top; the main grid filters down to just the cluster, auto-expanded.
- ⚡ **Instant & 100% local** — built on a lightweight colour-histogram change descriptor, **no
  ML model and no network** required. Matching is computed once per check in the background.
- 🧹 **Review the cluster, not the chaos** — accept or reject the whole "one bug across N
  viewports" group in a single pass, using the same per-check controls you already know.
- 🎛️ **Tunable per project** — set the match threshold (stricter = fewer, surer matches) under
  **Admin → AI → Projects settings**.

> Enabled per project, **off by default**.

## 🚀 Quick Start

### Scaffold a new project (recommended)

```bash
npm init sy@latest
```

The interactive CLI sets up a ready-to-run project with Syngrisi and your chosen test
framework. Prefer a template? The
[**Playwright BDD boilerplate**](https://github.com/syngrisi/syngrisi-playwright-bdd-boilerplate)
is the **recommended starting point for the fastest start** — Gherkin/BDD with ~150 ready-made
steps, first-class Syngrisi visual checks, and AI-agent tooling out of the box. You can also
start from the plain
[Playwright](https://github.com/syngrisi/syngrisi-playwright-boilerplate) or
[Cucumber](https://github.com/syngrisi/syngrisi-cucumber-boilerplate) boilerplate
([▶ open in Gitpod](https://gitpod.io/#https://github.com/syngrisi/syngrisi-cucumber-boilerplate)).
Testing in another language? There are also
[Playwright + Python](https://github.com/syngrisi/syngrisi-playwright-python-boilerplate) and
[Playwright + Java](https://github.com/syngrisi/syngrisi-playwright-java-boilerplate) boilerplates.

### Run the server with Docker

```bash
mkdir my-syngrisi && cd my-syngrisi
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/syngrisi-app.dockerfile
curl -LO https://raw.githubusercontent.com/syngrisi/syngrisi/main/packages/syngrisi/docker-compose.yml
docker compose up
```

Then open **http://localhost:3000**. See the
[main app README](packages/syngrisi/README.md) for native (non-Docker) setup.

## 🧪 Use it in your tests

**Playwright** (via [`@syngrisi/playwright-sdk`](packages/playwright-sdk/README.md)):

```ts
import { test } from '@playwright/test';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';

test('homepage looks right', async ({ page }) => {
  const driver = new PlaywrightDriver({
    page,
    url: 'http://localhost:3000/',
    apiKey: process.env.SYNGRISI_API_KEY,
  });

  await driver.startTestSession({ params: { app: 'My App', test: 'Homepage', branch: 'main' } });
  await page.goto('https://example.com');
  await driver.check({ checkName: 'Homepage', imageBuffer: await page.screenshot() });
  await driver.stopTestSession();
});
```

Also available: [`@syngrisi/wdio-sdk`](packages/wdio-sdk/README.md) for WebdriverIO,
[`wdio-syngrisi-cucumber-service`](packages/wdio-syngrisi-cucumber-service/README.md) for
Cucumber, and the framework-agnostic
[`@syngrisi/core-api`](packages/core-api/README.md) REST client.

## ⚖️ How it compares

| | **Syngrisi** | Applitools | Percy | Chromatic |
|---|:---:|:---:|:---:|:---:|
| Open source (MIT) | ✅ | ❌ | ❌ | ❌ |
| Self-hosted / data ownership | ✅ | Enterprise only | ❌ (cloud) | ❌ (cloud) |
| Free to run | ✅ | ❌ | Limited tier | Limited tier |
| Pixel comparison & diffs | ✅ | ✅ | ✅ | ✅ |
| Playwright & WebdriverIO SDKs | ✅ | ✅ | ✅ | Partial |
| Root Cause Analysis | ✅ _(beta)_ | ✅ _(AI)_ | — | — |
| AI triage of diffs | ✅ _(beta, **self-hosted / local model**)_ | ✅ _(cloud only)_ | — | — |
| Managed cloud & scaling | self-managed | ✅ | ✅ | ✅ |

Syngrisi trades a managed cloud and a large hosted feature set for being **free,
open-source and fully under your control**. If you want to own your visual testing
stack, it's built for you.

## 📦 Monorepo

```
packages/
├── syngrisi/                              # Main application (Express + React)
├── core-api/                              # Framework-agnostic REST client
├── core-api-python/                       # Python REST client (+ Playwright driver)
├── playwright-sdk/                        # Playwright SDK
├── wdio-sdk/                              # WebdriverIO SDK
├── wdio-syngrisi-cucumber-service/        # WebdriverIO + Cucumber service
├── wdio-cucumber-viewport-logger-service/ # In-viewport step logger
├── node-resemble.js/                      # Image comparison library
├── mcp/                                   # MCP server for AI agents
└── create-sy/                             # `npm init sy` project scaffolder
```

- **Just running tests?** Install the SDK for your framework (`@syngrisi/playwright-sdk` or `@syngrisi/wdio-sdk`).
- **Hosting the server?** Use the `@syngrisi/syngrisi` app (Docker or native).
- **Starting from scratch?** Run `npm init sy@latest`.

## 📚 Documentation

- 📖 [Main App Guide](packages/syngrisi/README.md)
- 🤖 [MCP Server for AI Agents](packages/mcp/README.md)
- 🤖 [AI Features](packages/syngrisi/docs/AI_FEATURES.md) · [Root Cause Analysis](packages/syngrisi/docs/RCA.md)
- 🧩 [Plugins](packages/syngrisi/docs/PLUGINS.md)
- ⚙️ [Environment Variables](packages/syngrisi/docs/environment_variables.md)
- 🛠️ [Development Guide](packages/syngrisi/docs/DEVELOPMENT.md) · [Release Cycle](docs-src/RELEASE_CYCLE.md)
- 🔗 API reference: Swagger UI at `/swagger/` on a running instance.

<details>
<summary><b>Local development</b></summary>

**Requirements:** Node.js ≥ 22.19, Yarn ≥ 1.22 (npm is blocked in this repo), MongoDB 8.0+.

```bash
yarn install:all   # install server + UI dependencies
yarn build         # build all packages
yarn start         # start the main application
yarn test          # run the E2E suite (from packages/syngrisi)
```

See the [Development Guide](packages/syngrisi/docs/DEVELOPMENT.md) for the full workflow.

</details>

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss substantial changes first.
See [`AGENTS.md`](AGENTS.md) and the [Release Cycle](docs-src/RELEASE_CYCLE.md) for repo
conventions, then send a PR.

## License

[MIT](packages/syngrisi/LICENSE.md) © Syngrisi contributors
