import chalk from 'chalk';
import type { PickleStepArgument, PickleTableRow } from '@cucumber/messages';
import { z } from 'zod';
import { createTool } from 'playwright-mcp-advanced';
import type { BddContext } from 'playwright-bdd/dist/runtime/bddContext';
import type { BddTestData, BddStepData } from 'playwright-bdd/dist/bddData/types';
import type { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { removeGherkinKeywords } from './gherkinHelpers';
import { createErrorResponse, createSuccessResponse } from './responseHelpers';
import { simpleTokenSearch } from './simpleTokenSearch';
import { formatError } from './common';
import { initializeSession, logStepExecution } from './stepLogger';
import type { Data } from './types';
import logger, { formatArgs } from './logger';
import { requirePlaywrightBddModule } from './playwrightBddPaths';
import { emmetifyCompactHtml } from './emmetify';
import { getStepDefinitionsFilePath } from './stepDefinitionsStorage';
import { findCustomStepDefinitions, type MatchedStep } from './stepModules';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { BddStepInvoker } = requirePlaywrightBddModule<{ BddStepInvoker: any }>(
  'dist',
  'runtime',
  'bddStepInvoker.js',
);

// Common Zod schemas for step parameters
const STEP_TEXT_SCHEMA = z
  .string()
  .describe('Step text without leading keyword (e.g. `I open the app`)');

const STEP_DOCSTRING_SCHEMA = z
  .any()
  .optional()
  .describe('Optional docString payload for the step');

const createStepParamsSchema = (includeDocstring: boolean) =>
  includeDocstring
    ? z.object({ stepText: STEP_TEXT_SCHEMA, stepDocstring: STEP_DOCSTRING_SCHEMA })
    : z.object({ stepText: STEP_TEXT_SCHEMA });

// Helper for normalizing step parameters
const normalizeStepParam = (step: string | StepExecutorParams): StepExecutorParams =>
  typeof step === 'string' ? { stepText: step } : step;

export interface StepExecutorParams {
  stepText: string;
  stepDocstring?: unknown;
}

export interface StepExecutorDependencies {
  stepFinder: any;
  fixtures: Record<string, unknown>;
  llmStepDefinitionsParsed: Data;
  bddConfig: unknown;
  autoFixtures: {
    $test?: unknown;
    $testInfo?: unknown;
    $bddContext?: BddContext;
    $tags?: string[];
    featureUri?: string;
  };
  updateTextWithKeyword?: (textWithKeyword: string) => void;
  onToolInvoked?: () => void;
}

export interface StepExecutorToolConfig {
  name: string;
  description: string;
  title: string;
  supportsDocstring: boolean;
  deprecated?: boolean;
  deprecationMessage?: string;
}

export type StepBatchItem = StepExecutorParams;

interface PreparedBatchStep {
  original: StepExecutorParams;
  normalizedStepText: string;
  keyword: string;
  matchedDefinition: any;
}

const safeStringify = (value: unknown, indent?: number): string => {
  try {
    const seen = new WeakSet();
    return JSON.stringify(value, (_, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      return val;
    }, indent);
  } catch {
    return String(value);
  }
};

const toDocStringContent = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    return safeStringify(value, 2);
  }
  return String(value);
};

const toPickleStepArgument = (value: unknown): PickleStepArgument | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (Array.isArray(value) && value.every((row) => Array.isArray(row))) {
    const rows = (value as unknown[][]).map((cells) => ({
      cells: cells.map((cell) => ({ value: String(cell) })),
    }));
    return { dataTable: { rows } };
  }

  if (
    Array.isArray(value) &&
    value.every((row) => row && typeof row === 'object' && !Array.isArray(row))
  ) {
    const objectRows = value as Array<Record<string, unknown>>;
    const headers = [...new Set(objectRows.flatMap((row) => Object.keys(row)))];
    const dataRows: PickleTableRow[] = [
      {
        cells: headers.map((header) => ({ value: header })),
      },
      ...objectRows.map((row) => ({
        cells: headers.map((header) => ({ value: String(row[header] ?? '') })),
      })),
    ];
    return { dataTable: { rows: dataRows } };
  }

  const docStringContent = toDocStringContent(value);
  if (docStringContent !== undefined) {
    return {
      docString: {
        content: docStringContent,
      },
    };
  }

  return null;
};

const createBddContext = (
  deps: StepExecutorDependencies,
  textWithKeyword: string,
  matchedDefinition: any,
): BddContext => {
  const baseContext = deps.autoFixtures.$bddContext as BddContext | undefined;
  const config = (deps.bddConfig ?? baseContext?.config) as BddContext['config'];
  const test = (deps.autoFixtures.$test ?? baseContext?.test) as BddContext['test'];
  const testInfo = (deps.autoFixtures.$testInfo ?? baseContext?.testInfo) as BddContext['testInfo'];
  const featureUri =
    deps.autoFixtures.featureUri ?? baseContext?.featureUri ?? 'mcp://manual-execution';
  const tags = deps.autoFixtures.$tags ?? baseContext?.tags ?? [];

  if (!config || !test || !testInfo) {
    throw new Error('Missing required BDD runtime fixtures (config/test/testInfo) for step execution.');
  }

  const stepMatchArguments = typeof matchedDefinition.getStepMatchArguments === 'function'
    ? matchedDefinition.getStepMatchArguments()
    : [];

  const stepData: BddStepData = {
    pwStepLine: 1,
    gherkinStepLine: matchedDefinition?.definition?.line ?? 1,
    keywordType: undefined,
    textWithKeyword,
    stepMatchArguments,
  };

  const testData: BddTestData = {
    pwTestLine: 1,
    pickleLine: 1,
    tags,
    steps: [stepData],
  };

  return {
    config,
    featureUri,
    test,
    testInfo,
    tags,
    step: { title: textWithKeyword },
    stepIndex: -1,
    bddTestData: testData,
  };
};

const findStepDefinitionsForText = (
  stepFinder: any,
  stepText: string,
) => {
  try {
    return stepFinder.findDefinitions(undefined, stepText);
  } catch (err) {
    throw new Error(`Failed to find step definitions: ${formatError(err)}`);
  }
};

const getStepKeyword = (stepDefinitions: any[]): string => {
  if (stepDefinitions.length === 0) return 'When';
  return (
    stepDefinitions[0]?.definition?.options?.keyword ??
    stepDefinitions[0]?.options?.keyword ??
    'When'
  );
};

interface StepValidationResult {
  ok: true;
  normalizedText: string;
  keyword: string;
  matchedDefinition: any;
  useCustomExecution?: boolean;
  customMatch?: MatchedStep;
}

interface StepValidationError {
  ok: false;
  errorResponse: ReturnType<typeof createErrorResponse>;
}

type ValidationResult = StepValidationResult | StepValidationError;

const validateAndResolveStep = async (
  stepText: string,
  dependencies: StepExecutorDependencies,
  sessionId: string,
): Promise<ValidationResult> => {
  const normalizedText = removeGherkinKeywords(stepText);

  // Find step definitions from playwright-bdd registry
  let stepDefinitions: any[];
  try {
    stepDefinitions = findStepDefinitionsForText(dependencies.stepFinder, normalizedText);
  } catch (err) {
    const errorDetails = formatError(err);
    const message = `ERROR: Failed to search for step definitions: "${normalizedText}"\n\n${errorDetails}`;
    await logStepExecution('When', normalizedText, 'Error', sessionId, message);
    return { ok: false, errorResponse: createErrorResponse(message) };
  }

  // If playwright-bdd registry is empty, try custom step registry
  if (stepDefinitions.length === 0) {
    const customMatches = findCustomStepDefinitions(normalizedText);

    if (customMatches.length === 1) {
      const customMatch = customMatches[0];
      const keyword = customMatch.definition.keyword;
      logger.info(formatArgs(`🔧 Using custom step registry for: "${normalizedText}"`));

      return {
        ok: true,
        normalizedText,
        keyword,
        matchedDefinition: customMatch,
        useCustomExecution: true,
        customMatch,
      };
    }

    if (customMatches.length > 1) {
      const variants = customMatches
        .map((m, index) => {
          return `${index + 1}. ${m.definition.keyword} "${m.definition.patternString}"`;
        })
        .join('\n\n');

      const message = `ERROR: Ambiguous step - multiple custom definitions match: "${normalizedText}"\n\nFound ${customMatches.length} matches:\n\n${variants}`;
      await logStepExecution('When', normalizedText, 'Fail', sessionId, message);
      return { ok: false, errorResponse: createErrorResponse(message) };
    }

    // No custom matches either - fall back to simple token search for suggestions
    const searchResults = simpleTokenSearch(dependencies.llmStepDefinitionsParsed, normalizedText);

    if (searchResults.length === 0) {
      const message = `ERROR: No step definitions found for step: "${normalizedText}"\n\nPlease check the step text or define a new step definition.`;
      await logStepExecution('When', normalizedText, 'Not Found', sessionId, message);
      return { ok: false, errorResponse: createErrorResponse(message) };
    }

    const suggestionsList = searchResults
      .slice(0, 5)
      .map((result, index) => {
        const fileWithLine = result.line ? `${result.file}:${result.line}` : result.file;
        return `${index + 1}. "${result.pattern}"\n   📁 ${fileWithLine}\n   📊 Match score: ${result.score.toFixed(2)}`;
      })
      .join('\n\n');

    const stepDefinitionsFiles = await getStepDefinitionsFilePath();
    const filesListFormatted = stepDefinitionsFiles.map(p => `- ${p}`).join('\n');
    const message = `ERROR: Step definition not found for: "${normalizedText}"\n\nDid you mean one of these?\n\n${suggestionsList}\n\nAvailable test steps (open to read):\n${filesListFormatted}`;
    await logStepExecution('When', normalizedText, 'Not Found', sessionId, message);
    return { ok: false, errorResponse: createErrorResponse(message) };
  }

  const keyword = getStepKeyword(stepDefinitions);

  // Handle multiple definitions
  if (stepDefinitions.length > 1) {
    const variants = stepDefinitions
      .map(({ definition }: { definition: any }, index: number) => {
        const location = definition?.uri ? `${definition.uri}:${definition.line}` : 'unknown location';
        return `${index + 1}. ${definition?.keyword ?? 'Unknown'} "${definition?.patternString ?? '?'}"\n   📁 ${location}`;
      })
      .join('\n\n');

    const message = `ERROR: Ambiguous step - multiple definitions match: "${normalizedText}"\n\nPlease be more specific. Found ${stepDefinitions.length} matches:\n\n${variants}`;
    await logStepExecution(keyword, normalizedText, 'Fail', sessionId, message);
    return { ok: false, errorResponse: createErrorResponse(message) };
  }

  // Success - single definition found from playwright-bdd registry
  return {
    ok: true,
    normalizedText,
    keyword,
    matchedDefinition: stepDefinitions[0],
  };
};

const executeMatchedDefinition = async (
  params: StepExecutorParams,
  dependencies: StepExecutorDependencies,
  matchedDefinition: any,
  keyword: string,
  sessionId: string,
  stepText: string,
  startTime: number,
) => {
  const textWithKeyword = `${keyword} ${params.stepText}`;
  dependencies.updateTextWithKeyword?.(textWithKeyword);

  const fixtures = dependencies.fixtures ?? {};
  const hasDocstring = params.stepDocstring !== undefined && params.stepDocstring !== null;

  logger.info(formatArgs(`🚀 Executing step "${textWithKeyword}"`));
  const bddContext = createBddContext(dependencies, textWithKeyword, matchedDefinition);
  const argument = toPickleStepArgument(hasDocstring ? params.stepDocstring : undefined);
  const invoker = new BddStepInvoker(bddContext, {});
  const result = await invoker.invoke(stepText, argument, fixtures);
  logger.info(formatArgs(`✅ Step "${textWithKeyword}" completed`));

  const duration = Date.now() - startTime;
  await logStepExecution(keyword, stepText, 'Ok', sessionId);

  const responseText =
    result === undefined
      ? `Duration: ${duration}ms`
      : `Duration: ${duration}ms\nResult: ${safeStringify(result)}`;

  return createSuccessResponse(responseText);
};

/**
 * Execute a step using the custom step registry (bypass BddStepInvoker).
 */
const executeCustomStep = async (
  params: StepExecutorParams,
  dependencies: StepExecutorDependencies,
  customMatch: MatchedStep,
  keyword: string,
  sessionId: string,
  stepText: string,
  startTime: number,
) => {
  const textWithKeyword = `${keyword} ${params.stepText}`;
  dependencies.updateTextWithKeyword?.(textWithKeyword);

  const fixtures = dependencies.fixtures ?? {};
  const hasDocstring = params.stepDocstring !== undefined && params.stepDocstring !== null;

  logger.info(formatArgs(`🚀 Executing custom step "${textWithKeyword}"`));

  // Get step parameters from the match
  const parameters = await customMatch.getMatchedParameters();

  // Add docstring to parameters if present
  if (hasDocstring) {
    const docStringContent = toDocStringContent(params.stepDocstring);
    if (docStringContent !== undefined) {
      parameters.push(docStringContent);
    }
  }

  // Execute the step function directly
  const result = await customMatch.definition.fn(fixtures, ...parameters);
  logger.info(formatArgs(`✅ Custom step "${textWithKeyword}" completed`));

  const duration = Date.now() - startTime;
  await logStepExecution(keyword, stepText, 'Ok', sessionId);

  const responseText =
    result === undefined
      ? `Duration: ${duration}ms`
      : `Duration: ${duration}ms\nResult: ${safeStringify(result)}`;

  return createSuccessResponse(responseText);
};

export const executeStep = async (
  params: StepExecutorParams,
  dependencies: StepExecutorDependencies,
) => {
  const startTime = Date.now();
  const normalizedStepText = removeGherkinKeywords(params.stepText);
  const hasDocstring = params.stepDocstring !== undefined && params.stepDocstring !== null;
  const sessionId = initializeSession();

  logger.info(formatArgs(`🧩 ${chalk.magenta(normalizedStepText)} ${hasDocstring ? '(with docstring)' : ''}`));

  // Validate and resolve step definition
  const validation = await validateAndResolveStep(params.stepText, dependencies, sessionId);
  if (!validation.ok) {
    return validation.errorResponse;
  }

  // Execute using custom registry if indicated
  if (validation.useCustomExecution && validation.customMatch) {
    try {
      return await executeCustomStep(
        params,
        dependencies,
        validation.customMatch,
        validation.keyword,
        sessionId,
        validation.normalizedText,
        startTime,
      );
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorDetails = formatError(err);
      const message = `Custom step execution failed for: "${validation.normalizedText}"\n\n⏱️ Duration: ${duration}ms\n\n${errorDetails}`;
      await logStepExecution(validation.keyword, validation.normalizedText, 'Fail', sessionId, message);
      return createErrorResponse(message);
    }
  }

  // Execute using BddStepInvoker (playwright-bdd registry)
  try {
    return await executeMatchedDefinition(
      params,
      dependencies,
      validation.matchedDefinition,
      validation.keyword,
      sessionId,
      validation.normalizedText,
      startTime,
    );
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorDetails = formatError(err);
    const message = `Step execution failed for: "${validation.normalizedText}"\n\n⏱️ Duration: ${duration}ms\n\n${errorDetails}`;

    const artifacts: { screenshotPath?: string; accessibilityTreePath?: string } = {};
    const page = dependencies.fixtures.page as Page | undefined;

    if (page && !page.isClosed()) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const artifactsDir = path.join(process.cwd(), 'logs', 'artifacts');

      const screenshotPath = path.join(artifactsDir, `error-${timestamp}.png`);
      const htmlPath = path.join(artifactsDir, `html-${timestamp}.emmet`);

      artifacts.screenshotPath = screenshotPath;
      artifacts.accessibilityTreePath = htmlPath;

      void (async () => {
        try {
          const [screenshot, html] = await Promise.all([
            page.screenshot({ fullPage: true }),
            page.content(),
          ]);

          const emmetHtml = emmetifyCompactHtml(html);

          await Promise.all([
            fs.writeFile(screenshotPath, screenshot),
            fs.writeFile(htmlPath, emmetHtml),
          ]);
        } catch (artifactError) {
          logger.error(formatArgs('Failed to capture artifacts on error:', artifactError));
        }
      })();
    }

    await logStepExecution(validation.keyword, validation.normalizedText, 'Fail', sessionId, message);
    return createErrorResponse(message, artifacts);
  }
};

export const createStepExecutorTool = (
  config: StepExecutorToolConfig,
  dependencies: StepExecutorDependencies,
) => {
  const zParams = createStepParamsSchema(config.supportsDocstring);

  return createTool(
    config.name,
    config.description,
    zParams,
    async (params: z.infer<typeof zParams>) => {
      dependencies.onToolInvoked?.();

      if (!config.supportsDocstring) {
        return executeStep(
          { stepText: params.stepText },
          { ...dependencies },
        );
      }

      return executeStep(
        {
          stepText: params.stepText,
          stepDocstring: (params as { stepDocstring?: unknown }).stepDocstring,
        },
        { ...dependencies },
      );
    },
    {
      title: config.title,
      capability: 'testing',
      type: 'destructive',
    },
  );
};

const validateAndPrepareBatchSteps = async (
  steps: StepExecutorParams[],
  dependencies: StepExecutorDependencies,
) => {
  const sessionId = initializeSession();
  const resolutionPromises = steps.map(async (step) => {
    const validation = await validateAndResolveStep(step.stepText, dependencies, sessionId);

    if (!validation.ok) {
      // Extract error message from the error response
      const errorContent = validation.errorResponse.content[0];
      const message = errorContent?.type === 'text' ? errorContent.text : 'Unknown error';
      return {
        status: 'error' as const,
        message,
      };
    }

    return {
      status: 'ok' as const,
      prepared: {
        original: step,
        normalizedStepText: validation.normalizedText,
        keyword: validation.keyword,
        matchedDefinition: validation.matchedDefinition,
      } satisfies PreparedBatchStep,
    };
  });

  const results = await Promise.all(resolutionPromises);
  const errors = results.filter(
    (result): result is { status: 'error'; message: string } => result.status === 'error',
  );

  if (errors.length > 0) {
    const combinedMessage = [
      'ERROR: Step validation failed for batch execution.',
      '',
      ...errors.map((error, index) => `${index + 1}. ${error.message}`),
    ].join('\n');
    return {
      ok: false as const,
      response: createErrorResponse(combinedMessage),
    };
  }

  const preparedSteps = results
    .filter((result): result is { status: 'ok'; prepared: PreparedBatchStep } => result.status === 'ok')
    .map((result) => result.prepared);

  return { ok: true as const, preparedSteps };
};

const executePreparedStep = async (
  prepared: PreparedBatchStep,
  dependencies: StepExecutorDependencies,
  previousSuccessfulSteps: string[],
) => {
  const sessionId = initializeSession();
  const startTime = Date.now();

  try {
    const response = await executeMatchedDefinition(
      {
        stepText: prepared.original.stepText,
        stepDocstring: prepared.original.stepDocstring,
      },
      dependencies,
      prepared.matchedDefinition,
      prepared.keyword,
      sessionId,
      prepared.normalizedStepText,
      startTime,
    );

    return {
      outcome: 'success' as const,
      response,
      executedLabel: `${prepared.keyword} ${prepared.original.stepText}`,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorDetails = formatError(error);
    const baseMessage = `ERROR: Step execution failed for: "${prepared.normalizedStepText}"\n\n⏱️ Duration: ${duration}ms\n\n${errorDetails}`;
    const recentSuccessful = previousSuccessfulSteps.slice(-2);

    const contextMessage =
      recentSuccessful.length > 0
        ? `\n\nContext:\nPrevious successful steps:\n${recentSuccessful
          .map((stepText, index) => `  ${index + 1}. ${stepText}`)
          .join('\n')}`
        : '';

    const messageWithContext = `${baseMessage}${contextMessage}`;
    await logStepExecution(prepared.keyword, prepared.normalizedStepText, 'Fail', sessionId, messageWithContext);

    return {
      outcome: 'error' as const,
      response: createErrorResponse(messageWithContext),
    };
  }
};

export const createStepExecutorBatchTool = (
  dependencies: StepExecutorDependencies,
) => {
  const zBatchStepObject = createStepParamsSchema(true);

  const zBatchStep = z.union([
    z.string(),
    zBatchStepObject,
  ]);

  const zBatchParams = z.object({
    steps: z
      .array(zBatchStep)
      .min(1)
      .describe('Ordered list of steps to execute sequentially. All steps must be valid before execution starts.'),
  });

  return createTool(
    'step_execute_many',
    'Validate and execute a sequence of Gherkin steps with optional docStrings. IMPORTANT: Use ONLY for reproducing multiple steps in sequence. NEVER use for single steps. Do NOT use in diagnostic steps as this tool does not return step values. Do NOT use for steps that return values.',
    zBatchParams,
    async (params: z.infer<typeof zBatchParams>) => {
      dependencies.onToolInvoked?.();

      const normalizedSteps = params.steps.map(normalizeStepParam);

      const validation = await validateAndPrepareBatchSteps(normalizedSteps, dependencies);
      if (!validation.ok) {
        return validation.response;
      }

      const previousSuccessfulSteps: string[] = [];

      for (const prepared of validation.preparedSteps) {
        const result = await executePreparedStep(prepared, dependencies, previousSuccessfulSteps);
        if (result.outcome === 'error') {
          return result.response;
        }

        previousSuccessfulSteps.push(result.executedLabel);
      }

      const executedSummary = validation.preparedSteps
        .map((prepared, index) => `${index + 1}. ${prepared.keyword} ${prepared.original.stepText}`)
        .join('\n');

      const warning = validation.preparedSteps.length === 1
        ? '\n⚠️ Warning! Only one step was provided. Please use step_execute_single for single steps instead of step_execute_many.\n'
        : '';

      return createSuccessResponse(
        `${warning}Executed ${validation.preparedSteps.length} steps successfully:\n${executedSummary}`,
      );
    },
    {
      title: 'Step Executor Batch',
      capability: 'testing',
      type: 'destructive',
    },
  );
};
