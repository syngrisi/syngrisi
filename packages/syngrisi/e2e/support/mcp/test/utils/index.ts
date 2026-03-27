import path from 'node:path';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import type { Readable } from 'node:stream';
import type { TestInfo } from '@playwright/test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { findEphemeralPort } from '../../utils/port-utils';
import { waitForServerStop } from '../../../utils/app-server';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_RELATIVE_PATH = ['support', 'mcp', 'bridge-cli.ts'];
let bridgeCliSpawnCounter = 0;

export const TIMEOUTS = {
  LIST_TOOLS: 120_000,
  CALL_TOOL: 60_000,
  START_SESSION: 180_000,
  EXECUTE_STEP: 180_000,
  TEST_SUITE: 240_000,
  TEST_SUITE_EXTENDED: 300_000,
} as const;

type BridgeCliOptions = {
  env?: Record<string, string>;
  attachmentName?: string;
};

type BridgeCliSetup = {
  client: Client;
  asyncErrors: Error[];
  cleanup: () => Promise<void>;
  transportClosed: Promise<void>;
};

const extractContentText = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const container = 'result' in payload && payload.result && typeof payload.result === 'object'
    ? payload.result
    : payload;

  if (!container || typeof container !== 'object') {
    return '';
  }

  const content = (container as { content?: unknown }).content;
  if (!Array.isArray(content) || !content.length) {
    return '';
  }

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== 'object') {
    return '';
  }

  const text = (firstBlock as { text?: unknown }).text;
  return typeof text === 'string' ? text : '';
};

const buildSubprocessEnv = (
  baseEnv: Record<string, string | undefined>,
  overrides: Record<string, string>,
): Record<string, string> => {
  const env = { ...baseEnv };

  delete env.NODE_OPTIONS;
  delete env.PW_TEST_SOURCE_TRANSFORM;
  delete env.PW_TEST_SOURCE_TRANSFORM_SCOPE;
  delete env.PLAYWRIGHT_JSON_OUTPUT_NAME;
  delete env.PLAYWRIGHT_JUNIT_OUTPUT_NAME;
  delete env.PW_TEST_HTML_REPORT_OPEN;
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  delete env.SYNGRISI_APP_PORT;
  delete env.SYNGRISI_DB_URI;
  delete env.SYNGRISI_IMAGES_PATH;

  return Object.fromEntries(
    Object.entries({
      ...env,
      ...overrides,
    }).filter(([, value]) => typeof value === 'string'),
  ) as Record<string, string>;
};

const startBridgeCli = async (
  testInfo: TestInfo,
  options: BridgeCliOptions = {},
): Promise<BridgeCliSetup> => {
  const { env: envOverrides = {}, attachmentName = 'bridge-cli-stderr' } = options;

  const e2eRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const commandArgs = ['tsx', path.join(...BRIDGE_RELATIVE_PATH)];
  const workerInstanceId = `bridge-${testInfo.workerIndex}-${testInfo.retry}-${randomUUID()}`;
  const portOverride = envOverrides.MCP_DEFAULT_PORT;
  const preferredPort = portOverride ?? String(await findEphemeralPort());

  const parentWorkerIndex = testInfo.parallelIndex;
  const uniqueWorkerIndex = 100 + (parentWorkerIndex * 1000) + bridgeCliSpawnCounter++;

  const transport = new StdioClientTransport({
    command: NPX_BIN,
    args: commandArgs,
    cwd: e2eRoot,
    env: buildSubprocessEnv(process.env as Record<string, string>, {
      ZENFLOW_WORKER_INSTANCE: workerInstanceId,
      MCP_DEFAULT_PORT: preferredPort,
      E2E_HEADLESS: '1',
      TEST_WORKER_INDEX: String(uniqueWorkerIndex),
      SYNGRISI_TEST_CID: String(uniqueWorkerIndex),
      SYNGRISI_APP_PORT: String(5100 + uniqueWorkerIndex),
      ...envOverrides,
    }),
    stderr: 'pipe',
  });

  const stderrChunks: string[] = [];
  const stderrStream = transport.stderr;
  if (stderrStream && 'setEncoding' in stderrStream) {
    (stderrStream as Readable).setEncoding('utf8');
  }
  stderrStream?.on('data', (chunk: string | Buffer) => {
    stderrChunks.push(typeof chunk === 'string' ? chunk : chunk.toString('utf8'));
  });

  const asyncErrors: Error[] = [];
  transport.onerror = (error: Error | unknown) => {
    asyncErrors.push(error instanceof Error ? error : new Error(String(error)));
  };

  const transportClosed = new Promise<void>((resolve) => {
    transport.onclose = () => resolve();
  });

  const client = new Client(
    {
      name: 'zenflow-bridge-cli-test',
      version: '0.0.0',
    },
    {
      capabilities: {},
    },
  );

  client.onerror = (error: Error | unknown) => {
    asyncErrors.push(error instanceof Error ? error : new Error(String(error)));
  };

  await client.connect(transport);

  const cleanup = async () => {
    const settleWithTimeout = async (task: Promise<unknown>, timeoutMs: number) => Promise.race([
      task.then(() => undefined).catch(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);

    await Promise.allSettled([
      settleWithTimeout((async () => {
        try {
          await client.close();
        } catch {
          // ignore double-close errors
        }
      })(), 1_000),
      settleWithTimeout((async () => {
        try {
          await transport.close();
        } catch {
          // ignore double-close errors
        }
      })(), 1_000),
    ]);

    const waitForTransportClose = transportClosed.catch(() => {
      /* ignore */
    });

    const transportClosedInTime = await Promise.race([
      waitForTransportClose.then(() => true),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 1_000)),
    ]);

    if (!transportClosedInTime) {
      try {
        const cleanupCommand = `pkill -f 'support/mcp/bridge-cli.ts|support/mcp/test/mcp.spec.ts' || true`;
        const { execSync } = await import('node:child_process');
        execSync(cleanupCommand, { stdio: 'ignore' });
      } catch {
        // ignore forced bridge teardown failures
      }
    }

    try {
      const cleanupCommand = `pkill -SIGINT -f "syngrisi_test_server_${uniqueWorkerIndex}" || true`;
      const { execSync } = await import('node:child_process');
      execSync(cleanupCommand, { stdio: 'ignore' });
      await waitForServerStop(uniqueWorkerIndex, 10_000).catch(() => {
        /* ignore teardown races */
      });
    } catch {
      // ignore teardown cleanup failures for already-stopped servers
    }

    if (testInfo.status !== 'passed' && stderrChunks.length) {
      await testInfo.attach(attachmentName, {
        body: stderrChunks.join(''),
        contentType: 'text/plain',
      });
    }
  };

  return { client, asyncErrors, cleanup, transportClosed };
};

const startNewSession = async (client: Client, sessionName: string) => {
  const runStart = async () => client.callTool(
    {
      name: 'session_start_new',
      arguments: { sessionName },
    },
    undefined,
    { timeout: TIMEOUTS.START_SESSION },
  );

  let result: Awaited<ReturnType<typeof runStart>> | null = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await client.callTool({ name: 'sessions_clear', arguments: {} });
    result = await runStart();

    const text = extractContentText(result);
    const isError = Boolean(result && typeof result === 'object' && 'isError' in result && (result as { isError?: boolean }).isError);
    const isTransientStartError = isError && (
      text.includes('ERR_CONNECTION_REFUSED')
      || text.includes('Request timed out')
      || text.includes('Connection closed')
    );

    if (!isTransientStartError || attempt === 3) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  if (!result) {
    throw new Error('Failed to start MCP session: no result returned.');
  }

  return { result, text: extractContentText(result) };
};

const executeStep = async (client: Client, stepText: string, stepDocstring?: unknown) => {
  const args: Record<string, unknown> = { stepText };
  if (stepDocstring !== undefined) {
    args.stepDocstring = stepDocstring;
  }
  const result = await client.callTool(
    {
      name: 'step_execute_single',
      arguments: args,
    },
    undefined,
    { timeout: TIMEOUTS.EXECUTE_STEP },
  );
  return { result, text: extractContentText(result) };
};

const executeBatch = async (
  client: Client,
  steps: Array<{ stepText: string; stepDocstring?: unknown } | string>,
) => {
  const result = await client.callTool(
    {
      name: 'step_execute_many',
      arguments: { steps },
    },
    undefined,
    { timeout: TIMEOUTS.EXECUTE_STEP },
  );
  return { result, text: extractContentText(result) };
};

const shutdownSession = async (client: Client) => {
  await client.notification({
    method: 'notifications/shutdown',
    params: {},
  });
};

export {
  startBridgeCli,
  startNewSession,
  executeStep,
  executeBatch,
  shutdownSession,
  extractContentText,
};
