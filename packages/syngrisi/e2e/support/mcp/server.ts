import http from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Page, TestInfo } from '@playwright/test';
import type { BddContext } from 'playwright-bdd/dist/runtime/bddContext';
import { z } from 'zod';
import { createErrorResponse, createSuccessResponse, safeJsonParse } from './utils/responseHelpers';
import { getStepDefinitions } from './utils/stepDefinitions';
import { getStepDefinitionsFilePath, saveStepDefinitionsToFile } from './utils/stepDefinitionsStorage';
import { createStepExecutorBatchTool, createStepExecutorTool, type StepExecutorDependencies } from './utils/stepExecutor';
import { patchStepInvoker } from './utils/stepInvokerPatch';
import { getSessionInfo, initializeSession, startNewSession } from './utils/stepLogger';
import type { Data } from './utils/types';
import { initializeStepFinder } from './utils/stepModules';
import { bddConfig } from './bdd.config';
import { env, getIdleTimeoutMs, getIdleCheckIntervalMs } from './config';
import { formatError, isShutdownNotification, SHUTDOWN_NOTIFICATION_METHOD } from './utils/common';
import logger, { formatArgs } from './utils/logger';
// Using relative path instead of @utils alias to allow bridge-cli.ts to run from any directory
// without requiring tsconfig.json path resolution
import { waitFor } from '../utils/common';
import { findEphemeralPort, waitForHttpAvailability } from './utils/port-utils';

export const sessionStartToolDefinition = {
  name: 'session_start_new',
  description: 'Start a new named session. Must be run before using any other tools.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      sessionName: { type: 'string', description: 'Human-readable name for the new MCP session' },
      headless: { type: 'boolean', description: 'Run browser in headless mode (default: true)' },
    },
    required: ['sessionName'],
  },
  annotations: {
    title: 'Start New Test Engine Session',
    destructiveHint: true,
  },
};

export const stepExecuteToolDefinition = {
  name: 'step_execute_single',
  description: 'Execute a single Gherkin step with optional docString payload. IMPORTANT: ALWAYS use this tool for single steps, diagnostic steps, and steps that return values. This is the primary tool for step-by-step execution and debugging. для ровно одного шага.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      stepText: {
        type: 'string' as const,
        description: 'Step text without leading keyword (e.g. `I open the app`)',
      },
      stepDocstring: {
        type: 'string' as const,
        description: 'Optional docString payload for the step',
      },
    },
    required: ['stepText'],
  },
  annotations: { title: 'Step Executor' },
};

export const stepExecuteBatchToolDefinition = {
  name: 'step_execute_many',
  description: 'Validate and execute a sequence of Gherkin steps with optional docStrings. IMPORTANT: Use ONLY for reproducing multiple steps in sequence. NEVER use for single steps. Do NOT use in diagnostic steps as this tool does not return step values. Do NOT use for steps that return values. использовать только при ≥2 шагах; одиночные шаги запрещены.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      steps: {
        type: 'array',
        description: 'Ordered list of steps to execute sequentially.',
        items: {
          type: 'object',
          properties: {
            stepText: { type: 'string', description: 'Step text without leading keyword (e.g. `I open the app`)' },
            stepDocstring: { type: 'string', description: 'Optional docString payload for the step' },
          },
          required: ['stepText'],
        },
        minItems: 1,
      },
    },
    required: ['steps'],
  },
  annotations: { title: 'Step Executor Many' },
};

export const attachExistingSessionToolDefinition = {
  name: 'attach_existing_session',
  description: 'Attach the bridge to an MCP server launched via debug steps. Add the scenario step `I start the debug MCP Test Engine` before invoking this tool. Do not run it after `session_start_new`; it only attaches to an existing instance.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
  },
  annotations: { title: 'Attach Existing MCP Session' },
};

export const bootstrapToolDefinitions = [
  sessionStartToolDefinition,
  stepExecuteToolDefinition,
  // stepExecuteBatchToolDefinition is added via server builder, not bootstrap
  attachExistingSessionToolDefinition,
] as const;
export interface StartMcpServerOptions {
  fixtures: {
    page: any;
    context: any;
    request: any;
    appServer: any;
    testData: any;
    testManager: any;
    $bddContext?: BddContext;
    $tags?: string[];
    $uri?: string;
  };
  runtime?: {
    test?: any;
    testInfo?: TestInfo;
    featureUri?: string;
    tags?: string[];
  };
  requestedPort?: number;
  keepAlive?: boolean;
}

export interface McpServerHandle {
  port: number;
  baseUrl: string;
  server: unknown;
  httpServer: http.Server;
  waitForShutdown: (options?: { timeoutMs?: number }) => Promise<void>;
  stop: () => Promise<void>;
}

export async function startMcpServer({
  fixtures,
  runtime,
  requestedPort = 0,
}: StartMcpServerOptions): Promise<McpServerHandle> {
  patchStepInvoker();
  logger.info(formatArgs(`🚀 Starting MCP server with requested port: ${requestedPort || 'auto'}`));

  // Helper: count total pages in browser
  const countBrowserPages = (browser: any | null): number =>
    browser?.contexts().reduce((count: number, ctx: any) => count + ctx.pages().length, 0) ?? 0;

  // Helper: create testing tool with common error handling
  const createTestingTool = async <TSchema extends z.ZodTypeAny>(
    name: string,
    description: string,
    schema: TSchema,
    handler: (params: z.infer<TSchema>) => Promise<string>,
    options: { title: string },
  ) => {
    const { createTool } = await import('playwright-mcp-advanced');
    return createTool(
      name,
      description,
      schema,
      async (params: z.infer<TSchema>) => {
        idleState.update();
        try {
          const result = await handler(params);
          return createSuccessResponse(result);
        } catch (err) {
          const message = formatError(err);
          logger.error(formatArgs(`❌ Failed to execute ${name}:`, message));
          return createErrorResponse(message);
        }
      },
      {
        title: options.title,
        capability: 'testing',
        type: 'destructive',
      },
    );
  };

  // Helper: wait for browser window to appear
  const waitForBrowserWindow = async (browser: any | null, timeoutMs: number = 3_600_000) => {
    await waitFor(
      () => countBrowserPages(browser) > 0,
      {
        timeoutMs,
        intervalMs: 250,
        description: 'browser window to appear',
      }
    );
    logger.info(formatArgs('🪟 Browser window detected.'));
  };

  // Helper: find first available page in browser
  const findFirstAvailablePage = (browser: any | null, fallbackPage: Page): Page => {
    if (!browser) return fallbackPage;
    return browser
      .contexts()
      .flatMap((ctx: any) => ctx.pages())
      .find((candidate: Page) => !candidate.isClosed()) ?? fallbackPage;
  };

  // Helper: create a resolvable promise with external resolve control
  const createResolvablePromise = () => {
    let resolved = false;
    let resolveFunc!: () => void;
    const promise = new Promise<void>((resolve) => {
      resolveFunc = () => {
        if (resolved) {
          logger.info(formatArgs('⚠️ Shutdown already resolved, skipping'));
          return;
        }
        logger.info(formatArgs('📍 Marking shutdown - resolving shutdown promise'));
        resolved = true;
        resolve();
      };
    });
    return { promise, resolve: resolveFunc, isResolved: () => resolved };
  };

  const stepDefinitionsJson = getStepDefinitions();
  let llmStepDefinitionsParsed: Data = safeJsonParse<Data>(stepDefinitionsJson, { files: [] });

  const StepFinder = await initializeStepFinder();
  const stepFinder = new StepFinder(bddConfig);

  initializeSession();

  const autoFixtures = {
    $test: runtime?.test,
    $testInfo: runtime?.testInfo,
    $bddContext: undefined,
    $tags: runtime?.tags ?? [],
    featureUri: runtime?.featureUri,
  };

  // Track last activity for idle timeout
  const idleState = {
    lastActivityTime: Date.now(),
    checkTimer: null as NodeJS.Timeout | null,
    stopped: false,
    update: () => { idleState.lastActivityTime = Date.now(); },
  };

  let activePage = (fixtures?.page ?? null) as Page | null;
  const setActivePage = (page: Page | null) => {
    activePage = page;
    if (page) {
      (fixtures as Record<string, unknown>).page = page;
    } else {
      delete (fixtures as Record<string, unknown>).page;
    }
  };

  const stepExecutorDependencies: StepExecutorDependencies = {
    stepFinder,
    fixtures,
    llmStepDefinitionsParsed,
    bddConfig,
    autoFixtures,
    onToolInvoked: idleState.update,
  };

  const stepExecuteTool = await createStepExecutorTool(
    {
      name: stepExecuteToolDefinition.name,
      description: stepExecuteToolDefinition.description,
      title: stepExecuteToolDefinition.annotations.title,
      supportsDocstring: true,
    },
    stepExecutorDependencies,
  );

  const stepExecuteBatchTool = await createStepExecutorBatchTool(stepExecutorDependencies);

  async function refreshStepDefinitions(): Promise<string[]> {
    logger.info(formatArgs('🏗️ Regenerating step definition cache...'));
    const latestJson = getStepDefinitions();
    llmStepDefinitionsParsed = safeJsonParse<Data>(latestJson, { files: [] });
    stepExecutorDependencies.llmStepDefinitionsParsed = llmStepDefinitionsParsed;
    const createdFiles = await saveStepDefinitionsToFile(llmStepDefinitionsParsed);
    logger.info(formatArgs(`📚 Step definitions cache rebuilt. Created ${createdFiles.length} files`));
    return createdFiles;
  }

  await refreshStepDefinitions();

  const zNewSessionParams = z.object({
    sessionName: z
      .string()
      .describe('Human-readable name for the new MCP session'),
    headless: z
      .boolean()
      .optional()
      .describe('Run browser in headless mode (default: true)'),
  });

  const internalStartSession = async (sessionName: string) => {
    logger.info(formatArgs(`🎯 Starting new session "${sessionName}"`));
    const id = startNewSession(sessionName);
    const info = getSessionInfo();
    const page = activePage;
    if (!page || page.isClosed()) {
      throw new Error('No Playwright page available for the new session.');
    }
    if (fixtures?.appServer?.baseURL) {
      logger.info(formatArgs(`🌍 Launching application at ${fixtures.appServer.baseURL}`));
      await page.goto(fixtures.appServer.baseURL);
      // await page.pause();
    } else {
      logger.warn(formatArgs('⚠️ Unable to launch application automatically: Playwright page or appServer baseURL missing.'));
    }
    const browser = page.context().browser();
    await waitForBrowserWindow(browser);
    const firstPage = findFirstAvailablePage(browser, page);
    setActivePage(firstPage);
    return { id, info } as const;
  };

  const sessionStartNewTool = await createTestingTool(
    sessionStartToolDefinition.name,
    sessionStartToolDefinition.description,
    zNewSessionParams,
    async (params: z.infer<typeof zNewSessionParams>) => {
      const cacheFilePaths = await refreshStepDefinitions();
      const { id, info } = await internalStartSession(params.sessionName);
      const filesListFormatted = cacheFilePaths.map(p => `- ${p}`).join('\n');
      return `New session started: "${info.name}" with ID ${info.id}. Logs at ${id}.jsonl. Available test steps (open to read):\n${filesListFormatted}`;
    },
    { title: sessionStartToolDefinition.annotations.title },
  );

  const mcpAdvanced = await import('playwright-mcp-advanced');
  const server = await mcpAdvanced.createServerBuilder({
    config: {
      browser: { headless: env.E2E_HEADLESS === '1' },
      capabilities: ['vision'],
    },
    shadowItems: {
      tools: ['browser_*', 'plugins_manage'],
      prompts: [],
      resources: [],
    },
  })
    .addTools([
      sessionStartNewTool,
      stepExecuteTool,
      stepExecuteBatchTool,
    ])
    .build();

  server.setupExitWatchdog();

  const shutdown = createResolvablePromise();
  const markShutdown = shutdown.resolve;

  // Helper: setup shutdown notification handler
  const setupShutdownHandler = (srv: typeof server, onShutdown: () => void) => {
    const originalCreateConnection = srv.createConnection.bind(srv);
    (srv as typeof srv & { createConnection: typeof originalCreateConnection }).createConnection = async (transport) => {
      const connection = await originalCreateConnection(transport);
      const mcpServer = (connection as { server?: { fallbackNotificationHandler?: (notification: unknown) => unknown } }).server;
      if (mcpServer) {
        const previousFallback = mcpServer.fallbackNotificationHandler?.bind(mcpServer);
        mcpServer.fallbackNotificationHandler = async (notification: unknown) => {
          if (isShutdownNotification(notification)) {
            logger.info(formatArgs('📴 Shutdown notification received.'));
            onShutdown();
          }
          if (previousFallback) {
            await previousFallback(notification);
          }
        };
      }
      return connection;
    };
  };

  setupShutdownHandler(server, markShutdown);

  // Helper: stop idle checker
  const stopIdleChecker = () => {
    idleState.stopped = true;
    if (idleState.checkTimer) {
      clearInterval(idleState.checkTimer);
      idleState.checkTimer = null;
    }
  };

  // Helper: close active page
  const closeActivePage = async () => {
    if (activePage) {
      try {
        if (!activePage.isClosed()) {
          await activePage.close();
        }
      } catch (err) {
        logger.warn(formatArgs('⚠️ Failed to close idle Playwright page.', err));
      } finally {
        setActivePage(null);
      }
    }
  };

  // Helper: close all server connections
  const closeServerConnections = async (srv: typeof server) => {
    const connections = (srv as unknown as { _connectionList?: Array<{ close?: () => Promise<void> }> })._connectionList;
    if (Array.isArray(connections)) {
      await Promise.allSettled(connections.map((connection) => connection?.close?.()));
    }
  };

  // Helper: close HTTP server
  const closeHttpServer = async (httpSrv: http.Server) => {
    await new Promise<void>((resolve, reject) => {
      httpSrv.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  };

  logger.info(formatArgs(`🌐 Starting MCP HTTP server on port ${requestedPort || 'auto'}`));
  const { startHttpServer, startHttpTransport } = await import('playwright-mcp-advanced');
  const startOnPort = async (port: number) => {
    const httpSrv = await startHttpServer({ port });
    const addr = httpSrv.address() as AddressInfo | string | null;
    const resolved = addr && typeof addr !== 'string' ? addr.port : port;
    return { httpSrv, resolved };
  };

  let httpServer: http.Server;
  let resolvedPort: number;
  let startResult: { httpSrv: http.Server; resolved: number };
  let stopped = false;

  try {
    startResult = await startOnPort(requestedPort);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'EADDRINUSE') {
      throw error;
    }
    const fallbackPort = await findEphemeralPort();
    logger.warn(formatArgs(`Port ${requestedPort} is busy, retrying on ${fallbackPort}`));
    startResult = await startOnPort(fallbackPort);
  }
  ({ httpSrv: httpServer, resolved: resolvedPort } = startResult);

  startHttpTransport(httpServer, server);
  logger.info(formatArgs(`🚀 MCP server listening at http://localhost:${resolvedPort}`));

  // Wait for the HTTP server to be truly available before proceeding
  await waitForHttpAvailability(resolvedPort);

  // Start idle timeout checker
  const startIdleChecker = () => {
    const idleTimeoutMs = getIdleTimeoutMs();
    const idleCheckIntervalMs = getIdleCheckIntervalMs();
    logger.info(formatArgs(`🕐 Starting idle checker: timeout=${idleTimeoutMs}ms, interval=${idleCheckIntervalMs}ms`));
    // Extra debug to ensure env is visible in CI logs
    logger.debug?.(formatArgs('🧪 Idle env', {
      MCP_IDLE_TIMEOUT_MS: process.env.MCP_IDLE_TIMEOUT_MS,
      MCP_IDLE_CHECK_INTERVAL_MS: process.env.MCP_IDLE_CHECK_INTERVAL_MS,
    }));
    idleState.checkTimer = setInterval(() => {
      const idleTime = Date.now() - idleState.lastActivityTime;
      if (idleTime >= idleTimeoutMs && !idleState.stopped) {
        logger.warn(formatArgs(`⏱️ Server idle for ${Math.round(idleTime / 1000)}s. Auto-shutting down...`));
        idleState.stopped = true;
        if (idleState.checkTimer) {
          clearInterval(idleState.checkTimer);
          idleState.checkTimer = null;
        }
        void handleRef.stop()
          .then(() => logger.info(formatArgs('✅ Auto-shutdown complete')))
          .catch(err => logger.error(formatArgs('❌ Error during auto-shutdown:', err)));
      }
    }, idleCheckIntervalMs);
  };

  const handleRef: McpServerHandle = {
    port: resolvedPort,
    baseUrl: `http://localhost:${resolvedPort}`,
    server,
    httpServer,
    async waitForShutdown(options) {
      const timeoutMs = options?.timeoutMs;
      if (!timeoutMs || timeoutMs <= 0) {
        return shutdown.promise;
      }
      await Promise.race([
        shutdown.promise,
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms waiting for shutdown.`)), timeoutMs);
        }),
      ]);
    },
    async stop() {
      if (stopped) {
        return;
      }
      stopped = true;
      stopIdleChecker();
      markShutdown();
      await closeActivePage();
      await closeServerConnections(server);
      await closeHttpServer(httpServer);
    },
  };

  // Ensure shutdown notification triggers a full stop (including browser close)
  shutdown.promise
    .then(() => handleRef.stop())
    .catch((err) => logger.error(formatArgs('❌ Error while stopping MCP server after shutdown signal:', err)));

  // Start the idle timeout checker
  startIdleChecker();

  return handleRef;
}
