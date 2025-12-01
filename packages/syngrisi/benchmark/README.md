# Syngrisi MCP Benchmark

Lightweight harness to benchmark the AI agent via MCP:
- `scenarios/` — JSON definitions (prompt, expectations, limits).
- `runner/` — execution harness (`run-bench.ts`, `executor.ts`, `log-parser.ts`).
- `metrics/` — KPI calculators.
- `reports/` — generated summaries (`run_<scenario-id>.md`).

Usage:
1. Install dev deps: `npm install` inside `packages/syngrisi/benchmark`.
2. Provide a launch command via `BENCH_COMMAND` (real MCP launch only — mocks forbidden). The command must start an MCP session (`session_start_new`), feed `BENCH_SCENARIO_PROMPT` and `BENCH_SESSION_NAME` to the agent, and ensure logs appear in `e2e/support/mcp/logs/*.jsonl`. By default, runs in dry-run mode.
3. Run: `npm run bench` (all scenarios) or `npm run bench:task1` (only task1). Set `BENCH_DRY_RUN=false` to execute for real.

Env contract for `BENCH_COMMAND`:
- Receives `BENCH_SCENARIO_PROMPT` (full prompt text).
- Receives `BENCH_SESSION_NAME` (unique per run).
- Should write MCP logs to `e2e/support/mcp/logs/*.jsonl` so the metrics engine can read them.
