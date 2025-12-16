# Syngrisi MCP Benchmark (Playwright Edition)

This benchmark suite evaluates the MCP Agent using Playwright as the runner.

## 📊 Key Metrics
We track 5 critical metrics (inspired by WebArena and SWE-bench):

1.  **Success Rate**: Did the agent achieve the goal? (Pass/Fail)
2.  **Step Efficiency**: How many turns/tool calls did it take?
3.  **Token Usage**: Total input + output tokens (estimated from logs).
4.  **Duration**: Wall-clock time for the run.
5.  **Reliability Score**: Quality score (100 - penalties for errors/hallucinations).

## 🚀 Running Benchmarks

### Prerequisites
1.  Ensure `BENCH_COMMAND` is set in your `.env` (command to launch your MCP agent).
2.  Install dependencies: `npm install` in the e2e root.

### Execute
Run all scenarios:
```bash
npx playwright test -c support/mcp/benchmark/playwright.benchmark.config.ts
```

Run a specific scenario:
```bash
npx playwright test -c support/mcp/benchmark/playwright.benchmark.config.ts -g "task1"
```

### Configuration
- **Config File**: `support/mcp/benchmark/playwright.benchmark.config.ts`
- **Scenarios**: JSON files in `support/mcp/benchmark/scenarios/`
- **Reporters**: Custom reporter located in `support/mcp/benchmark/reporters/`

## 📂 Structure
- `tests/scenarios.spec.ts`: Dynamically loads JSON scenarios as Playwright tests.
- `tests/fixtures.ts`: Manages the MCP Agent process and log capturing.
- `reporters/benchmark-reporter.ts`: Aggregates results into the 5 metrics.