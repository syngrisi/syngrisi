---
"@syngrisi/syngrisi": minor
---

AI Triage (Beta): vision-LLM classification of failed checks with per-project config (off by default), per-verdict labels/colors/icons, confidence threshold with Unknown masking, auto-accept policy, in-progress badge, dedicated Admin → AI page, and a background scheduler. Providers: OpenAI-compatible (incl. self-hosted Ollama/vLLM), Anthropic, Gemini. "Test connection" is now a lightweight reachability check (provider/model ping, 15s timeout) instead of a full classification, so it no longer hangs on slow local models. Provider form gained temperature / max tokens / request timeout with inline help popovers; grid check-status is shown as icons without badge chrome.
