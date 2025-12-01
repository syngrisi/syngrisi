import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { getLatestLogFile } from "./log-parser";
import { ExecutionResult, ScenarioDefinition } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

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
  const args = command.split(" ");
  const bin = args.shift() ?? "bash";

  const child = spawn(bin, args, {
    cwd: repoRoot,
    env: {
      ...process.env,
      BENCH_SCENARIO_PROMPT: scenario.prompt,
      BENCH_SESSION_NAME: runId
    },
    stdio: "inherit"
  });

  const result = await new Promise<ExecutionResult>((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
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
