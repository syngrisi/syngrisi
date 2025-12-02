import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { computeMetrics } from "../metrics/compute";
import { parseLogFile } from "./log-parser";
import { executeScenario } from "./executor";
import { ScenarioDefinition } from "./types";
import { analyzeScenario, ScenarioReport } from "../metrics/analysis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const benchRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..");
const reportsDir = path.join(benchRoot, "reports");

// Load env from benchmark/.env first (local overrides), then repo root .env
dotenv.config({ path: path.join(benchRoot, ".env") });
dotenv.config({ path: path.join(repoRoot, ".env") });

interface CliOptions {
  scenarioPaths: string[];
  runsPerScenario: number;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const scenarioFlagIndex = args.indexOf("--scenario");
  let scenarioPaths: string[] = [];
  if (scenarioFlagIndex >= 0 && args[scenarioFlagIndex + 1]) {
    scenarioPaths = [args[scenarioFlagIndex + 1]];
  } else {
    const scenarioDir = path.join(benchRoot, "scenarios");
    const files = fs.readdirSync(scenarioDir).filter((f) => f.endsWith(".json"));
    scenarioPaths = files.map((f) => path.join(scenarioDir, f));
  }
  const runsPerScenario = 3;
  return { scenarioPaths, runsPerScenario };
}

async function loadScenario(filePath: string): Promise<ScenarioDefinition> {
  const absolute = path.isAbsolute(filePath) ? filePath : path.join(benchRoot, filePath);
  const content = await fsp.readFile(absolute, "utf-8");
  const data = JSON.parse(content) as ScenarioDefinition;
  return data;
}

async function ensureReportsDir() {
  await fsp.mkdir(reportsDir, { recursive: true });
}

async function writeReport(scenarioReport: ScenarioReport) {
  await ensureReportsDir();
  const lines: string[] = [];
  lines.push(`# Benchmark report for ${scenarioReport.scenario.id}`);
  lines.push("");
  lines.push(`Prompt: ${scenarioReport.scenario.prompt}`);
  lines.push("");
  lines.push("| Run | Status | Metrics |");
  lines.push("| --- | --- | --- |");

  scenarioReport.runs.forEach((run) => {
    const metrics = run.metrics;
    const summary = metrics
      ? [
          `Success:${metrics.successRate}`,
          `Rule:${metrics.ruleAdherence.toFixed(1)}%`,
          `Steps:${metrics.actualSteps}`,
          `Eff:${metrics.stepEfficiency.toFixed(2)}`,
          `Fixes:${metrics.selfCorrectionCount}`,
          `Halluc:${metrics.hallucinationCount}`
        ].join(" ")
      : run.error ?? "n/a";
    lines.push(`| ${run.runId} | ${run.status} | ${summary} |`);
  });

  if (scenarioReport.improvements.length) {
    lines.push("");
    lines.push("## Improvements");
    scenarioReport.improvements.forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  const reportPath = path.join(reportsDir, `run_${scenarioReport.scenario.id}.md`);
  await fsp.writeFile(reportPath, lines.join("\n"), "utf-8");
  return reportPath;
}

async function main() {
  const options = parseArgs();
  const dryRun = process.env.BENCH_DRY_RUN !== "false";

  for (const scenarioPath of options.scenarioPaths) {
    const scenario = await loadScenario(scenarioPath);
    const results: {
      runId: string;
      status: string;
      metrics: ReturnType<typeof computeMetrics> | null;
      error?: string;
    }[] = [];
    for (let i = 1; i <= options.runsPerScenario; i++) {
      const execResult = await executeScenario(scenario, i, {
        dryRun,
        timeoutMs: 10 * 60 * 1000
      });

      let metrics = null;
      let error = execResult.error;
      if (execResult.logFile) {
        const events = await parseLogFile(execResult.logFile);
        metrics = computeMetrics(events, scenario);
      } else if (execResult.error) {
        error = execResult.error;
      }

      results.push({
        runId: execResult.runId,
        status: execResult.status,
        metrics,
        error
      });
    }

    const scenarioReport = analyzeScenario(scenario, results);
    const reportPath = await writeReport(scenarioReport);
    // eslint-disable-next-line no-console
    console.log(`Report written to ${reportPath}`);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
