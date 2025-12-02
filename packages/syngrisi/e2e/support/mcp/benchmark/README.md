# Syngrisi MCP Benchmark

Lives under `packages/syngrisi/e2e/support/mcp/benchmark`.

What’s inside:
- `scenarios/` — JSON definitions (prompt, expectations, limits).
- `runner/` — execution harness (`run-bench.ts`, `executor.ts`, `log-parser.ts`).
- `metrics/` — KPI calculators.
- `reports/` — generated summaries (`run_<scenario-id>.md`).
- `logs/bench-run.log` — прогресс запусков (команда, runId, logFile, тайминг, stdout/stderr).

Usage:
1) Install dev deps: `npm install` inside `packages/syngrisi/e2e/support/mcp/benchmark`.
2) Configure `.env` locally in this folder (`packages/syngrisi/e2e/support/mcp/benchmark/.env`) for `BENCH_COMMAND`, `BENCH_DRY_RUN`, `GEMINI_API_KEY`, etc. (auto-loaded). Optionally, repo root `.env` is loaded as fallback.
3) `BENCH_COMMAND` (real MCP launch only — mocks forbidden) must start an MCP session (`session_start_new`), feed `BENCH_SCENARIO_PROMPT` and `BENCH_SESSION_NAME` to the agent, and ensure logs appear in `packages/syngrisi/e2e/support/mcp/logs/*.jsonl`.
4) Run: `npm run bench` (all scenarios) or `npm run bench:task1` / `npm run bench:task0` for a specific scenario. Set `BENCH_DRY_RUN=false` to execute for real.

Env contract for `BENCH_COMMAND`:
- Receives `BENCH_SCENARIO_PROMPT` (full prompt text).
- Receives `BENCH_SESSION_NAME` (unique per run).
- Should write MCP logs to `packages/syngrisi/e2e/support/mcp/logs/*.jsonl` so the metrics engine can read them.
