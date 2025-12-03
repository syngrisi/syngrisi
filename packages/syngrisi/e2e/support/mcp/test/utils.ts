import fs from 'node:fs/promises';
import type { ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import type { Readable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { TestInfo } from '@playwright/test';

import { findEphemeralPort } from '../utils/port-utils';
import { spawnMcpServer } from '../utils/server-spawn';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_RELATIVE_PATH = ['support', 'mcp', 'bridge-cli.ts'];

export const TIMEOUTS = {
  LIST_TOOLS: 120_000,
  CALL_TOOL: 60_000,
  START_SESSION: 120_000,
  EXECUTE_STEP: 180_000,
  TEST_SUITE: 240_000,
  TEST_SUITE_EXTENDED: 300_000,
} as const;

export const extractContentText = (payload: unknown): string => {
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

export const startBridgeCli = async (
  testInfo: TestInfo,
  options: BridgeCliOptions = {},
): Promise<BridgeCliSetup> => {
  const { env: envOverrides = {}, attachmentName = 'bridge-cli-stderr' } = options;

  const e2eRoot = path.resolve(__dirname, '..', '..', '..');
  const commandArgs = ['tsx', path.join(...BRIDGE_RELATIVE_PATH)];
  const workerInstanceId = `bridge-${testInfo.workerIndex}-${testInfo.retry}-${randomUUID()}`;
  const portOverride = envOverrides.MCP_DEFAULT_PORT;
  const preferredPort = portOverride ?? String(await findEphemeralPort());

  // Compute unique worker index for isolation in parallel tests
  // Use high offset (100+) per worker to avoid conflicts with main Playwright workers
  const parentWorkerIndex = testInfo.parallelIndex;
  const uniqueWorkerIndex = 100 + (parentWorkerIndex * 100);

  const transport = new StdioClientTransport({
    command: NPX_BIN,
    args: commandArgs,
    cwd: e2eRoot,
    env: {
      ...(process.env as Record<string, string>),
      MCP_KEEP_ALIVE: '0', // Default to non-keepalive mode for tests
      ZENFLOW_WORKER_INSTANCE: workerInstanceId,
      MCP_DEFAULT_PORT: preferredPort,
      E2E_HEADLESS: '1',
      // Pass unique worker index for proper isolation in spawned MCP servers
      TEST_WORKER_INDEX: String(uniqueWorkerIndex),
      ...envOverrides,
    },
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
      name: 'mcp-bridge-cli-test',
      version: '1.0.0',
    },
    {
      capabilities: {},
      maxEventListeners: 50,
    },
  );

  client.onError = (error) => asyncErrors.push(error);
  await client.connect(transport);

  const cleanup = async () => {
    await client.close();
    await transportClosed;

    // Persist stderr if requested
    const stderrText = stderrChunks.join('');
    if (stderrText && testInfo) {
      await testInfo.attach(attachmentName, {
        body: stderrText,
        contentType: 'text/plain',
      });
    }
  };

  return { client, asyncErrors, cleanup, transportClosed };
};

export const startNewSession = async (client: Client, sessionName: string) => {
  const result = await client.callTool(
    { name: 'session_start_new', arguments: { sessionName, headless: true } },
    undefined,
    { timeout: TIMEOUTS.START_SESSION },
  );
  return { result, text: extractContentText(result) };
};

export const executeStep = async (client: Client, stepText: string, stepDocstring?: string) => {
  const result = await client.callTool(
    { name: 'step_execute_single', arguments: { stepText, stepDocstring } },
    undefined,
    { timeout: TIMEOUTS.EXECUTE_STEP },
  );
  return { result, text: extractContentText(result) };
};

export const executeBatch = async (client: Client, steps: string[]) => {
  const result = await client.callTool(
    { name: 'step_execute_many', arguments: { steps: steps.map((stepText) => ({ stepText })) } },
    undefined,
    { timeout: TIMEOUTS.EXECUTE_STEP },
  );
  return { result, text: extractContentText(result) };
};

export const shutdownSession = async (client: Client) => {
  await client.notification({
    method: 'notifications/shutdown',
    params: {},
  });
};
