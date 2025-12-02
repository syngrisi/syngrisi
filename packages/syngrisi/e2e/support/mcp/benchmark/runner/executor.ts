import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { getLatestLogFile } from "./log-parser";
import { ExecutionResult, ScenarioDefinition } from "./types";
import { appendRunLog } from "./run-log";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Bench lives at packages/syngrisi/e2e/support/mcp/benchmark; repo root is seven levels up.
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..");

export interface ExecutorOptions {
  timeoutMs?: number;
  dryRun?: boolean;
}

export async function executeScenario(
  scenario: ScenarioDefinition,
  runIndex: number,
  options: ExecutorOptions = {}
): Promise<ExecutionResult> {
  const runId = `${scenario.id}-run${runIndex}`;
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000; // 10 minutes per session
  const shouldDryRun = options.dryRun ?? !process.env.BENCH_COMMAND;
  const startTime = Date.now();
  const logs: string[] = [];

  if (shouldDryRun) {
    return {
      scenario,
      runId,
      logFile: null,
      status: "skipped",
      error: "Dry-run enabled; set BENCH_COMMAND to execute real MCP session."
    };
  }

  const command = process.env.BENCH_COMMAND as string;
  logs.push(`[${runId}] CMD: ${command}`);

  const child = spawn(command, {
    cwd: repoRoot,
    env: {
      ...process.env,
      BENCH_SCENARIO_PROMPT: scenario.prompt,
      BENCH_SESSION_NAME: runId
    },
    stdio: ["ignore", "pipe", "pipe"],
    shell: true
  });

  // Pipe stdout/stderr to console and bench log
  child.stdout?.on("data", (data: Buffer) => {
    const text = data.toString();
    process.stdout.write(text);
    void appendRunLog(`[${runId}] stdout: ${text.trimEnd()}`);
  });
  child.stderr?.on("data", (data: Buffer) => {
    const text = data.toString();
    process.stderr.write(text);
    void appendRunLog(`[${runId}] stderr: ${text.trimEnd()}`);
  });

  const result = await new Promise<ExecutionResult>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      logs.push(`[${runId}] Timeout exceeded (${timeoutMs}ms), process killed`);
      resolve({
        scenario,
        runId,
        logFile: null,
        status: "failed",
        error: `Timeout ${timeoutMs}ms exceeded`
      });
    }, timeoutMs);

    child.on("exit", async (code) => {
      clearTimeout(timer);
      const file = await getLatestLogFile(undefined, startTime);
      logs.push(
        `[${runId}] Exit code: ${code}; logFile: ${file ?? "not found"}; durationMs: ${Date.now() - startTime
        }`
      );
      await appendRunLog(logs);
      resolve({
        scenario,
        runId,
        logFile: file,
        status: code === 0 ? "success" : "failed",
        error: code === 0 ? undefined : `Process exited with code ${code}`
      });
    });
  });

  return result;
}
