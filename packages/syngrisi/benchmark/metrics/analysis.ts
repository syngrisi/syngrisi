import { RunMetrics } from "./compute";
import { ScenarioDefinition } from "../runner/types";

export interface ScenarioReport {
  scenario: ScenarioDefinition;
  runs: {
    runId: string;
    status: string;
    metrics: RunMetrics | null;
    error?: string;
  }[];
  improvements: string[];
}

const SUCCESS_THRESHOLD = 1; // 100%
const RULE_THRESHOLD = 80;

export function analyzeScenario(
  scenario: ScenarioDefinition,
  runs: ScenarioReport["runs"]
): ScenarioReport {
  const improvements: string[] = [];
  const successRates = runs.map((r) => r.metrics?.successRate ?? 0);
  const ruleScores = runs.map((r) => r.metrics?.ruleAdherence ?? 0);

  const successOk = successRates.every((s) => s >= SUCCESS_THRESHOLD);
  const ruleOk = ruleScores.every((s) => s >= RULE_THRESHOLD);

  if (!successOk) {
    improvements.push(
      "Success Rate below 100%: review scenario prompt, ensure final locator/url markers are asserted."
    );
  }
  if (!ruleOk) {
    improvements.push(
      "Rule Adherence below 80%: check violations (waitForTimeout, XPath usage) and tighten AGENTS.md guidance."
    );
  }

  const frequentViolations = runs
    .flatMap((r) => r.metrics?.violations ?? [])
    .reduce<Record<string, number>>((acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});

  Object.entries(frequentViolations)
    .filter(([, count]) => count > 0)
    .forEach(([violation]) => {
      if (violation === "waitForTimeout") {
        improvements.push(
          "Prohibit or flag waitForTimeout; add rule reminder in AGENTS.md selector section."
        );
      } else if (violation === "xpath_usage") {
        improvements.push(
          "Add explicit XPath prohibition with preferred ARIA/label selectors in AGENTS.md."
        );
      } else {
        improvements.push(`Investigate recurring violation: ${violation}`);
      }
    });

  return { scenario, runs, improvements };
}
