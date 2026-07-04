# Baseline "Time Machine"

## Overview

Every accepted baseline is already stored (`Baseline` documents + snapshot image files), so the
full visual history of a check exists in the database - it's just never been visible in one place.
The "time machine" lets you pick a check and scrub through its accepted baselines over time
(a history slider), with an optional AI-generated one-line summary of what changed between two
consecutive baselines.

## How It Works

```
Baseline docs (accepted, sorted by createdDate) ──► GET  /v1/baselines/history
                                                        │
                                                        ▼
                                              ordered timeline (id, date, image)
                                                        │
                                                        ▼
                                     UI: History modal + Mantine Slider (prev/next)
                                                        │
                                     POST /v1/baselines/history-summary (lazy, on step)
                                                        │
                                                        ▼
                                   AI triage provider `classify()` reused for a
                                   free-text "reason" describing the visual change
                                   (cached on the newer Baseline's `historySummary` field)
```

- History is just `Baseline.find({...ident, markedAs: 'accepted'}).sort({createdDate: 1})` -
  no new storage, no schedulers.
- The summary reuses the existing AI triage provider abstraction
  (`services/triage/factory.ts` `createProvider(cfg)` + `services/triage/config.ts`
  `getProviderConfig()`) - the same `classify()` call used for triage verdicts, given a custom
  prompt asking for a one-sentence description instead of a verdict. The model's `reason` field is
  used as the summary text; `verdict`/`confidence` are ignored.
- When no AI provider is configured, the summary endpoint returns `{summary: null, reason: 'no
  provider configured'}` and the UI just shows the slider without a summary line.
- Each baseline pair is summarized once: the result is cached on the *newer* baseline's
  `historySummary` field (`{fromBaselineId, text}`), and repeat requests for the same pair return
  `cached: true` instead of calling the provider again.

## API

### `GET /v1/baselines/history?filter=<ident-json>`

Returns the ordered accepted-baseline timeline for one check ident.

```json
{
  "filter": "{\"name\":\"Login page\",\"app\":\"6651dd45b9c3e1e0b8c1ce26\",\"branch\":\"master\",\"browserName\":\"chrome\",\"viewport\":\"1366x768\",\"os\":\"macOS\"}"
}
```

Response - array of items, oldest first:

```json
[
  {
    "id": "6651ec20917e9ce26f7c0849",
    "createdDate": "2024-05-26T10:49:19.896Z",
    "markedByUsername": "Guest",
    "filename": "6651ec20917e9ce26f7c0849.png",
    "imageUrl": "/snapshoots/6651ec20917e9ce26f7c0849.png"
  }
]
```

Note: unlike the SDK-facing ident (`client.route.ts`, where `app` is the app *name*), this
endpoint's `app` is the App document's ObjectId - matching how the UI already reads baselines
(`GET /v1/baselines`).

### `POST /v1/baselines/history-summary`

```json
{ "fromBaselineId": "<older baseline id>", "toBaselineId": "<newer baseline id>" }
```

Response:

```json
{ "summary": "header redesigned with a new logo", "cached": false }
```

or, when no provider is configured:

```json
{ "summary": null, "reason": "no provider configured" }
```

A provider is considered "configured" when the stored `ai_triage_provider` setting has an explicit
`apiKey`/`baseUrl` (or is the `fake` test provider) - the default seeded setting
(`{type: 'openai', apiKey: '', baseUrl: ''}`) counts as unconfigured, so the feature degrades to a
plain slider by default.

## UI

On the Baselines table (`/baselines`), each row has a "History" action (clock icon) that opens a
modal with the current image, a Mantine `Slider` over the timeline (labelled by date), prev/next
buttons, and - once you step to a baseline that has a predecessor - a lazily-fetched one-line AI
summary (hidden when `summary` is `null`).

## Scope

Out of scope: comparison engine changes, schedulers, video/GIF export.
