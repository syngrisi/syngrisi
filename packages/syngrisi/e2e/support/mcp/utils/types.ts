export interface StepDefinitionSummary {
  pattern: string;
  description: string;
  line?: number;
}

export interface StepFileSummary {
  fileName: string;
  steps: StepDefinitionSummary[];
}

export interface Data {
  files: StepFileSummary[];
}

export interface SearchResult {
  pattern: string;
  description: string;
  file: string;
  line?: number;
  score: number;
  matchedTokens: string[];
}
