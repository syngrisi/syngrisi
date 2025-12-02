export interface ScenarioExpectations {
  final_url_contains?: string;
  final_locator?: string;
  prohibited_actions?: string[];
}

export interface ScenarioConfig {
  auth_mode?: "guest" | "user";
  headless?: boolean;
  max_steps?: number;
  min_steps?: number;
}

export interface ScenarioDefinition {
  id: string;
  type: "exploration" | "generation" | "debug" | "creation";
  prompt: string;
  expectations: ScenarioExpectations;
  config: ScenarioConfig;
}

export interface ExecutionResult {
  scenario: ScenarioDefinition;
  runId: string;
  logFile: string | null;
  status: "success" | "failed" | "skipped";
  error?: string;
}
