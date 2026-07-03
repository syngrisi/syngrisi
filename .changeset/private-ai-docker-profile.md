---
"@syngrisi/syngrisi": minor
---

"Private AI" out of the box: `docker compose --profile ai up` now brings up a bundled Ollama service with a vision model (`OLLAMA_MODEL`, default `gemma4:12b`) for AI Triage — zero API keys, zero screenshot egress. The model is pulled by a one-shot `ollama-pull` helper into a persistent named volume, so the Ollama healthcheck never blocks on a multi-GB download. The triage provider can now also be seeded from env via `SYNGRISI_AI_TRIAGE_PROVIDER_JSON` (raw JSON: `type`, `baseUrl`, `apiKey`, `model`, …), which is applied to the `ai_triage_provider` setting on startup with env-over-admin precedence — headless/CI provisioning without touching the admin UI. Documented in `docs/AI_FEATURES.md` ("Private AI with Ollama").
