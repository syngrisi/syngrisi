import { McpLogEvent } from "../runner/log-parser";
import { ScenarioDefinition } from "../runner/types";

export interface RunMetrics {
  successRate: number; // 0 or 1 per run
  ruleAdherence: number; // percentage
  stepEfficiency: number; // actualSteps / minSteps
  selfCorrectionCount: number;
  hallucinationCount: number;
  actualSteps: number;
  violations: string[];
}

interface ParsedStep {
  status: "success" | "failed";
  text?: string;
  raw: string;
}

function extractSteps(events: McpLogEvent[]): ParsedStep[] {
  const steps: ParsedStep[] = [];
  for (const event of events) {
    const payload = event.raw ?? "";
    const match = payload.match(/Status:\s+(Success|Failed)/i);
    if (!match) continue;
    const status = match[1].toLowerCase() === "success" ? "success" : "failed";
    const stepMatch = payload.match(/for:\s+\"([^\"]+)\"/i);
    steps.push({
      status,
      text: stepMatch ? stepMatch[1] : undefined,
      raw: payload
    });
  }
  return steps;
}

function containsSuccessMarker(
  events: McpLogEvent[],
  scenario: ScenarioDefinition
): boolean {
  const urlTarget = scenario.expectations.final_url_contains;
  const locatorTarget = scenario.expectations.final_locator;

  return events.some((event) => {
    const haystack = event.raw ?? "";
    const urlOk = urlTarget ? haystack.includes(urlTarget) : false;
    const locatorOk = locatorTarget ? haystack.includes(locatorTarget) : false;
    return urlOk || locatorOk;
  });
}

export function computeMetrics(
  events: McpLogEvent[],
  scenario: ScenarioDefinition
): RunMetrics {
  const steps = extractSteps(events);
  const totalSteps = steps.length || 1; // avoid division by zero
  const minSteps = scenario.config.min_steps ?? 1;

  const prohibited = new Set(scenario.expectations.prohibited_actions ?? []);

  const violations: string[] = [];

  for (const step of steps) {
    const haystack = step.raw;
    if (/waitForTimeout/i.test(haystack)) {
      violations.push("waitForTimeout");
    }
    if (/locator\("\//i.test(haystack) || /"\/\//.test(haystack)) {
      violations.push("xpath_usage");
    }
    for (const action of prohibited) {
      if (haystack.includes(action)) {
        violations.push(action);
      }
    }
  }

  const ruleAdherence = ((totalSteps - violations.length) / totalSteps) * 100;

  let selfCorrectionCount = 0;
  for (let i = 0; i < steps.length - 1; i++) {
    if (steps[i].status === "failed" && steps[i + 1].status === "success") {
      selfCorrectionCount += 1;
    }
  }

  const hallucinationCount = events.filter((event) => {
    const haystack = (event.raw ?? "").toLowerCase();
    return (
      haystack.includes("step definition not found") ||
      haystack.includes("tool not found") ||
      haystack.includes("no such file")
    );
  }).length;

  const successMarker = containsSuccessMarker(events, scenario);
  const fallbackSuccess =
    !scenario.expectations.final_locator &&
    !scenario.expectations.final_url_contains &&
    steps.length > 0 &&
    steps[steps.length - 1].status === "success";

  return {
    successRate: successMarker || fallbackSuccess ? 1 : 0,
    ruleAdherence: Math.max(0, Math.min(100, ruleAdherence)),
    stepEfficiency: totalSteps / Math.max(1, minSteps),
    selfCorrectionCount,
    hallucinationCount,
    actualSteps: steps.length,
    violations
  };
}
