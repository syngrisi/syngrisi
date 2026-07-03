# AI Features Documentation

Syngrisi provides a set of features designed to facilitate integration with AI agents for automated review and analysis of visual regression checks.

## Endpoints

### 1. List Checks
**URL:** `GET /ai/checks`
**Description:** Returns a simplified HTML list of checks, optimized for parsing by AI agents.

**Query Parameters (Filters):**

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `run` | Filter by Run ID | `6929a243d36598e1591da630` |
| `status` | Filter by status (new, passed, failed, etc.) | `failed` |
| `name` | Filter by check name (regex supported) | `Login Page` |
| `branch` | Filter by git branch | `main` |
| `browser` | Filter by browser name | `chrome` |
| `os` | Filter by operating system | `macOS` |
| `viewport` | Filter by viewport size | `1920x1080` |
| `markedAs` | Filter by review status (`accepted`, `bug`) | `bug` |
| `hasDiff` | Show only checks with visual differences (`true`) | `true` |
| `app` | Filter by App ID | `...` |
| `suite` | Filter by Suite ID | `...` |
| `fromDate` | Start date for filtering (YYYY-MM-DD) | `2025-01-01` |
| `toDate` | End date for filtering (YYYY-MM-DD) | `2025-01-31` |
| `limit` | Number of results per page | `50` |
| `page` | Page number | `1` |

### 2. Check Details
**URL:** `GET /ai/checks/:id`
**Description:** Returns a simplified HTML view of a specific check, including images (baseline, actual, diff) and metadata.

### 3. Analysis Data
**URL:** `GET /ai/analysis/:id`
**Description:** Returns a JSON object containing Base64-encoded images and context data, suitable for direct processing by AI models.

### 4. Batch Actions
**URL:** `POST /ai/batch`
**Description:** Perform actions on multiple checks simultaneously.

**Body:**
```json
{
  "ids": ["id1", "id2"],
  "action": "accept" // or "remove"
}
```

### 5. Webhooks
**URL:** `POST /ai/webhooks`
**Description:** Register a webhook to receive notifications about events.

**Body:**
```json
{
  "url": "https://my-ai-agent.com/webhook",
  "events": "check.updated",
  "secret": "my-secret"
}
```

## Webhook Events

*   `check.created`: Triggered when a new check is created.
*   `check.updated`: Triggered when a check is updated (e.g., status change, accepted).

## Authentication

All AI endpoints require authentication via API Key or Session cookie.
Header: `apikey: <your-api-key>`

## Private AI with Ollama (docker profile)

AI Triage can run fully on your own hardware — no API keys, no screenshot egress. The
`ai` docker compose profile bundles an [Ollama](https://ollama.com) service with a vision
model and wires the Syngrisi app to it via environment variables.

### Quick start

```bash
cd packages/syngrisi

SYNGRISI_AI_TRIAGE_ENABLED=true \
SYNGRISI_AI_TRIAGE_PROVIDER_JSON='{"type":"openai","baseUrl":"http://ollama:11434/v1","model":"gemma4:12b"}' \
docker compose --profile ai up -d
```

This starts the regular `syngrisi-app` + `syngrisi-db` services plus:

- **`ollama`** — the Ollama server (official `ollama/ollama` image). Models are stored in
  the named volume `ollama_data`, so they survive restarts. The healthcheck only verifies
  the API is up — it never waits for a model download.
- **`ollama-pull`** — a one-shot helper that pulls the vision model (`OLLAMA_MODEL`,
  default `gemma4:12b`, several GB on first run) into that volume and exits. Re-runs are
  instant no-ops once the model is cached. You can also pull manually instead:
  `docker exec syngrisi-ollama ollama pull gemma4:12b`.

Then enable triage per project (Admin → AI → Projects settings, or
`PATCH /v1/app/:id/triage-policy` with `{"triageEnabled": true}`) — failed checks get
classified by the local model.

### Environment variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `OLLAMA_MODEL` | `gemma4:12b` | Vision model pulled by `ollama-pull` (any multimodal Ollama model) |
| `OLLAMA_PORT` | `11434` | Host port the Ollama API is published on |
| `SYNGRISI_DOCKER_OLLAMA_DATA_PATH` | `ollama_data` (named volume) | Where model files are stored |
| `SYNGRISI_AI_TRIAGE_ENABLED` | `false` | Global AI Triage on/off (env wins over the admin UI) |
| `SYNGRISI_AI_TRIAGE_PROVIDER_JSON` | — | Provider config as a JSON string; applied to the `ai_triage_provider` setting on every startup (env wins over the admin UI). Fields: `type`, `baseUrl`, `apiKey`, `model`, and optional `maxTokens` / `temperature` / `timeoutMs` |

Inside the compose network the app reaches Ollama at `http://ollama:11434/v1`
(OpenAI-compatible endpoint; `apiKey` may be omitted — Ollama ignores it).

`SYNGRISI_AI_TRIAGE_PROVIDER_JSON` also works outside docker — point any Syngrisi server
at any OpenAI-compatible endpoint, e.g. a host-local Ollama:

```bash
SYNGRISI_AI_TRIAGE_PROVIDER_JSON='{"type":"openai","baseUrl":"http://127.0.0.1:11434/v1","model":"gemma4:12b"}'
```

### Lifecycle

```bash
docker compose --profile ai up -d     # start everything, pull the model in the background
docker compose --profile ai down      # stop; the model volume is KEPT
docker compose --profile ai down -v   # stop and delete the model volume (re-download on next up)
```

Notes:

- Local VLM inference is CPU/GPU heavy; a single classification can take tens of seconds
  to minutes depending on hardware. See [AI_TRIAGE.md](../AI_TRIAGE.md) for model
  recommendations and tuning.
- Plain `docker compose up` (without `--profile ai`) is unaffected — the Ollama services
  only exist inside the `ai` profile.
