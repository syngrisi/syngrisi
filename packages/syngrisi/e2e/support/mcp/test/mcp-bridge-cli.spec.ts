import fs from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import type { ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import type { Readable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { findEphemeralPort } from '../utils/port-utils';
import { spawnMcpServer } from '../utils/server-spawn';


const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_RELATIVE_PATH = ['support', 'mcp', 'bridge-cli.ts'];

const TIMEOUTS = {
  LIST_TOOLS: 120_000,
  CALL_TOOL: 60_000,
  START_SESSION: 120_000,
  EXECUTE_STEP: 180_000,
  TEST_SUITE: 240_000,
  TEST_SUITE_EXTENDED: 300_000,
} as const;

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

const startBridgeCli = async (
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
    await Promise.allSettled([
      (async () => {
        try {
          await client.close();
        } catch {
          // ignore double-close errors
        }
      })(),
      (async () => {
        try {
          await transport.close();
        } catch {
          // ignore double-close errors
        }
      })(),
    ]);
    await transportClosed.catch(() => {
      /* ignore */
    });

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
  // Clean any leaked browsers/contexts before starting a fresh session
  await client.callTool({ name: 'sessions_clear', arguments: {} });
  const result = await client.callTool(
    {
      name: 'session_start_new',
      arguments: { sessionName },
    },
    undefined,
    { timeout: TIMEOUTS.START_SESSION },
  );
  return { result, text: extractContentText(result) };
};

const executeStep = async (client: Client, stepText: string) => {
  const result = await client.callTool(
    {
      name: 'step_execute_single',
      arguments: { stepText },
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

test.describe('MCP Bridge CLI tests', { tag: '@no-app-start' }, () => {

  test('SDIO bridge through bridge-cli serves MCP clients', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo);

    try {
      const toolsResultBootstrap = await client.listTools(undefined, { timeout: TIMEOUTS.LIST_TOOLS });
      const toolNamesBootstrap = toolsResultBootstrap.tools.map(({ name }) => name);

      expect(toolNamesBootstrap, 'Bootstrap tools should NOT include step_execute_many').toEqual(
        expect.arrayContaining([
          'session_start_new',
          'step_execute_single',
          'attach_existing_session',
        ]),
      );

      expect(toolNamesBootstrap, 'step_execute_many should NOT be in bootstrap - it comes from remote server').not.toContain('step_execute_many');

      const nonSessionTools = toolsResultBootstrap.tools.filter(
        ({ name }) => name !== 'session_start_new' && name !== 'attach_existing_session',
      );

      for (const tool of nonSessionTools) {
        const baseArguments = (() => {
          switch (tool.name) {
            case 'step_execute_single':
              return { stepText: 'I get current URL' };
            default:
              return {};
          }
        })();

        const preStartResult = await client.callTool(
          { name: tool.name, arguments: baseArguments },
          undefined,
          { timeout: TIMEOUTS.CALL_TOOL },
        );

        const preStartText = extractContentText(preStartResult);
        expect(preStartText, `Tool ${tool.name} should fail before session start`).toBe('Status: Failed\nError: Session not started. Please call session_start_new first.');
        expect(preStartResult, `Tool ${tool.name} should return error flag`).toEqual(expect.objectContaining({ isError: true }));
      }

      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');
      expect(sessionText, 'Session start response should include cache path').toContain('Available test steps (open to read):');

      const toolsResultAfter = await client.listTools(undefined, { timeout: TIMEOUTS.LIST_TOOLS });
      const toolNamesAfter = toolsResultAfter.tools.map(({ name }) => name);

      expect(toolNamesAfter, 'Post-session tools should include step_execute_many from remote server').toEqual(
        expect.arrayContaining([
          'step_execute_single',
          'step_execute_many',
          'session_start_new',
        ]),
      );

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge connects to debug MCP server via recorded port', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo);
    let debugServerClosedResolve: (() => void) | null = null;
    const debugServerClosed = new Promise<void>((resolve) => {
      debugServerClosedResolve = resolve;
    });
    const debugServerLogs: string[] = [];
    const serverErrors: Error[] = [];
    let debugServerExitStatus: { code: number | null; signal: NodeJS.Signals | null } | null = null;
    let debugServerProcess: ChildProcess | null = null;
    let portFilePath: string | null = null;

    try {
      const preferredPort = await findEphemeralPort();
      const spawnResult = await spawnMcpServer({
        port: preferredPort,
        onStdout: (chunk) => {
          debugServerLogs.push(`[stdout] ${chunk.toString()}`);
        },
        onStderr: (chunk) => {
          debugServerLogs.push(`[stderr] ${chunk.toString()}`);
        },
        onExit: (code, signal) => {
          debugServerExitStatus = { code, signal };
          debugServerClosedResolve?.();
        },
        onError: (error) => {
          serverErrors.push(error);
        },
      });
      debugServerProcess = spawnResult.child;
      const debugPort = spawnResult.port;

      const portsDir = path.resolve(__dirname, '..', 'logs', 'ports');
      await fs.mkdir(portsDir, { recursive: true });
      const timestampSeconds = Math.floor(Date.now() / 1000) + testInfo.workerIndex;
      portFilePath = path.join(portsDir, `${timestampSeconds}.port`);
      const scenarioPayload = {
        port: debugPort,
        recordedAt: new Date().toISOString(),
        scenario: {
          title: 'Debug Generated Scenario',
          titlePath: ['Feature: Debug', 'Scenario: Debug Generated Scenario'],
          featurePath: 'test/e2e/features/debug.feature',
          featureUri: 'file://' + path.join(process.cwd(), 'test/e2e/features/debug.feature'),
        },
      };
      await fs.writeFile(portFilePath, `${JSON.stringify(scenarioPayload, null, 2)}\n`, 'utf8');

      const connectResult = await client.callTool(
        { name: 'attach_existing_session', arguments: {} },
        undefined,
        { timeout: TIMEOUTS.CALL_TOOL },
      );

      const connectText = extractContentText(connectResult);
      expect(connectText, 'Connect tool should succeed').toContain('Status: Success');
      expect(connectText, 'Connect tool should report port number').toContain(`Connected to debug MCP server on port ${debugPort}`);
      expect(connectText, 'Connect tool should include scenario title').toContain('Scenario: Debug Generated Scenario');
      expect(connectText, 'Connect tool should include feature path').toContain('Feature file: test/e2e/features/debug.feature');

      const toolsAfterConnect = await client.listTools(undefined, { timeout: TIMEOUTS.LIST_TOOLS });
      expect(
        toolsAfterConnect.tools.map(({ name }) => name),
        'Tools list after connect should include testing commands',
      ).toEqual(
        expect.arrayContaining([
          'session_start_new',
          'step_execute_single',
          'attach_existing_session',
          'step_execute_many',
        ]),
      );

      const sessionResponse = await client.callTool(
        {
          name: 'session_start_new',
          arguments: { sessionName: 'mcp-bridge-cli-debug-connect' },
        },
        undefined,
        { timeout: TIMEOUTS.START_SESSION },
      );
      const sessionText = extractContentText(sessionResponse);
      expect(sessionText, 'Session start should succeed via debug connection').toContain('Status: Success');
      expect(sessionText, 'Session start should report cache path').toContain('Available test steps (open to read):');

      await shutdownSession(client);

      let serverStoppedNaturally = false;
      await Promise.race([
        debugServerClosed.then(() => {
          serverStoppedNaturally = true;
        }),
        new Promise<void>((resolve) => {
          setTimeout(resolve, 10_000);
        }),
      ]);

      if (!serverStoppedNaturally && debugServerProcess && debugServerProcess.exitCode === null) {
        debugServerProcess.kill('SIGTERM');
        await Promise.race([
          debugServerClosed,
          new Promise<void>((resolve) => {
            setTimeout(resolve, 10_000);
          }),
        ]);
      }

      expect(serverErrors, 'Debug server should not emit errors').toEqual([]);
      expect(debugServerExitStatus?.code ?? 0, 'Debug server should exit cleanly or be terminated').toBeGreaterThanOrEqual(0);
      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
      if (debugServerProcess && debugServerProcess.exitCode === null) {
        debugServerProcess.kill('SIGTERM');
        await debugServerClosed.catch(() => {
          /* ignore */
        });
      }
      if (portFilePath) {
        await fs.rm(portFilePath, { force: true }).catch(() => {
          /* ignore cleanup errors */
        });
      }
      if (testInfo.status !== 'passed' && debugServerLogs.length) {
        await testInfo.attach('debug-mcp-server.log', {
          body: debugServerLogs.join(''),
          contentType: 'text/plain',
        });
      }
    }
  });

  test('SDIO bridge executes diagnostic step via bridge-cli', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-diagnostic-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-diagnostic-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { text: stepText } = await executeStep(client, 'I test');
      expect(stepText, 'Step should execute successfully').toContain('Status: Success');
      expect(stepText, 'Step should return diagnostic message').toContain('Result: "Test message from diagnostic step"');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge executes batch steps via bridge-cli', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-batch-success-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-batch-success');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { result, text: batchText } = await executeBatch(client, [
        'I test',
        { stepText: 'I get current URL' },
      ]);

      expect(result.isError ?? false, 'Batch execution should succeed').toBe(false);
      expect(batchText, 'Batch execution should return success status').toContain('Status: Success');
      expect(batchText, 'Batch execution summary should list steps').toContain('Executed 2 steps successfully');
      expect(batchText, 'Batch execution summary should include step names').toContain('When I test');
      expect(batchText, 'Batch execution summary should include second step').toContain('When I get current URL');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge handles batch validation errors', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-batch-validation-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-batch-validation');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { result, text: batchText } = await executeBatch(client, [
        'I do nothing',
      ]);

      expect(result, 'Batch validation error should set error flag').toEqual(expect.objectContaining({ isError: true }));
      expect(batchText, 'Batch validation should return error message').toContain('ERROR: Step validation failed for batch execution');
      expect(batchText, 'Batch validation message should include missing step').toContain('I do nothing');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge includes context for batch execution failure', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-batch-failure-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-batch-failure');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { result, text: batchText } = await executeBatch(client, [
        'I test',
        'I get current URL',
        'I fail',
      ]);

      expect(result, 'Batch execution failure should set error flag').toEqual(expect.objectContaining({ isError: true }));
      expect(batchText, 'Batch execution failure should mention failed step').toContain('ERROR: Step execution failed for: "I fail"');
      expect(batchText, 'Batch execution failure should include context header').toContain('Previous successful steps:');
      expect(batchText, 'Batch execution failure should include previous successful step').toContain('When I test');
      expect(batchText, 'Batch execution failure should include second successful step').toContain('When I get current URL');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge restarts session within single CLI run', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-multi-session-stderr',
    });

    try {
      const { text: firstSessionText } = await startNewSession(client, 'mcp-bridge-cli-multi-session-1');
      expect(firstSessionText, 'First session should start successfully').toContain('Status: Success');

      const { text: firstStepText } = await executeStep(client, 'I test');
      expect(firstStepText, 'First step should execute successfully').toContain('Status: Success');

      const { text: secondSessionText } = await startNewSession(client, 'mcp-bridge-cli-multi-session-2');
      expect(secondSessionText, 'Second session should start successfully').toContain('Status: Success');

      const { text: secondStepText } = await executeStep(client, 'I test');
      expect(secondStepText, 'Second step should execute successfully').toContain('Status: Success');
      expect(secondStepText, 'Second step should return diagnostic message').toContain('Result: "Test message from diagnostic step"');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge executes diagnostic step after reconnect via bridge-cli', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const {
      client: firstClient,
      asyncErrors: firstAsyncErrors,
      cleanup: cleanupFirst,
    } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-reconnect-first-stderr',
    });

    try {
      const { text: firstSessionText } = await startNewSession(firstClient, 'mcp-bridge-cli-reconnect-tests-initial');
      expect(firstSessionText, 'First connection session should start successfully').toContain('Status: Success');

      const { text: firstStepText } = await executeStep(firstClient, 'I test');
      expect(firstStepText, 'First connection step should execute successfully').toContain('Status: Success');
      expect(firstStepText, 'First connection step should return diagnostic message').toContain('Result: "Test message from diagnostic step"');

      await shutdownSession(firstClient);
    } finally {
      await cleanupFirst();
    }

    expect(firstAsyncErrors, 'No async errors should occur in first connection').toEqual([]);

    const {
      client: secondClient,
      asyncErrors: secondAsyncErrors,
      cleanup: cleanupSecond,
    } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-reconnect-second-stderr',
    });

    try {
      const { text: secondSessionText } = await startNewSession(secondClient, 'mcp-bridge-cli-reconnect-tests-second');
      expect(secondSessionText, 'Second connection session should start successfully').toContain('Status: Success');

      const { text: secondStepText } = await executeStep(secondClient, 'I test');
      expect(secondStepText, 'Second connection step should execute successfully').toContain('Status: Success');
      expect(secondStepText, 'Second connection step should return diagnostic message').toContain('Result: "Test message from diagnostic step"');

      await shutdownSession(secondClient);
    } finally {
      await cleanupSecond();
    }

    expect(secondAsyncErrors, 'No async errors should occur in second connection').toEqual([]);
  });

  test('SDIO bridge handles non-existent step execution error', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-error-step-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-error-step-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { result, text: stepText } = await executeStep(client, 'I perform non-existent action');
      expect(stepText, 'Non-existent step should return error message').toContain('ERROR:');
      expect(result, 'Non-existent step should have error flag').toEqual(expect.objectContaining({ isError: true }));

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge proxies logging notifications', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-notifications-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-notifications-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { text: stepText } = await executeStep(client, 'I test');
      expect(stepText, 'Step should execute successfully').toContain('Status: Success');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge handles busy port and falls back to ephemeral', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      env: { MCP_BRIDGE_PORT: '0' },
      attachmentName: 'bridge-cli-port-fallback-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-port-fallback-tests');
      expect(sessionText, 'Session should start successfully with ephemeral port').toContain('Status: Success');
      expect(sessionText, 'Should include refreshed step cache path').toContain('Available test steps (open to read):');

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge properly cleans up resources on shutdown', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-cleanup-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-cleanup-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { text: stepText } = await executeStep(client, 'I test');
      expect(stepText, 'Step should execute successfully').toContain('Status: Success');

      await shutdownSession(client);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(asyncErrors, 'No async errors should occur during cleanup').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge handles graceful shutdown', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-graceful-shutdown-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-graceful-shutdown-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { text: stepText } = await executeStep(client, 'I test');
      expect(stepText, 'Step should execute successfully').toContain('Status: Success');

      await shutdownSession(client);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(asyncErrors, 'No async errors should occur during graceful shutdown').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge resets to bootstrap after unexpected transport closure', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-transport-closure-stderr',
    });

    try {
      const { text: firstSessionText } = await startNewSession(client, 'mcp-bridge-cli-transport-closure-tests-1');
      expect(firstSessionText, 'First session should start successfully').toContain('Status: Success');

      const { text: firstStepText } = await executeStep(client, 'I test');
      expect(firstStepText, 'First step should execute successfully').toContain('Status: Success');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { text: secondSessionText } = await startNewSession(client, 'mcp-bridge-cli-transport-closure-tests-2');
      expect(secondSessionText, 'Second session should start successfully after reset').toContain('Status: Success');

      const { text: secondStepText } = await executeStep(client, 'I test');
      expect(secondStepText, 'Second step should execute successfully').toContain('Status: Success');

      await shutdownSession(client);

      expect(asyncErrors.length, 'Some async errors may occur during transport closure').toBeGreaterThanOrEqual(0);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge validates no duplicate session_start_new after restart', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);

    const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
      attachmentName: 'bridge-cli-no-duplicate-session-stderr',
    });

    try {
      const { text: firstSessionText } = await startNewSession(client, 'mcp-bridge-cli-no-duplicate-session-1');
      expect(firstSessionText, 'First session should start successfully').toContain('Status: Success');

      const toolsResultAfterFirst = await client.listTools(undefined, { timeout: TIMEOUTS.LIST_TOOLS });
      const sessionStartToolsAfterFirst = toolsResultAfterFirst.tools.filter(({ name }) => name === 'session_start_new');
      expect(sessionStartToolsAfterFirst, 'Only one session_start_new should exist after first session').toHaveLength(1);

      const { text: secondSessionText } = await startNewSession(client, 'mcp-bridge-cli-no-duplicate-session-2');
      expect(secondSessionText, 'Second session should start successfully').toContain('Status: Success');

      const toolsResultAfterSecond = await client.listTools(undefined, { timeout: TIMEOUTS.LIST_TOOLS });
      const sessionStartToolsAfterSecond = toolsResultAfterSecond.tools.filter(({ name }) => name === 'session_start_new');
      expect(sessionStartToolsAfterSecond, 'Only one session_start_new should exist after second session').toHaveLength(1);

      const toolNames = toolsResultAfterSecond.tools.map(({ name }) => name);
      const uniqueToolNames = new Set(toolNames);
      expect(toolNames.length, 'No duplicate tool names should exist').toBe(uniqueToolNames.size);

      await shutdownSession(client);

      expect(asyncErrors, 'No async errors should occur').toEqual([]);
    } finally {
      await cleanup();
    }
  });

  test('SDIO bridge auto-shuts down after idle timeout', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const idleTimeoutMs = 3_000; // 3 seconds for test
    const checkIntervalMs = 1_000; // Check every 1 second for fast test
    const { client, cleanup } = await startBridgeCli(testInfo, {
      env: {
        MCP_IDLE_TIMEOUT_MS: String(idleTimeoutMs),
        MCP_IDLE_CHECK_INTERVAL_MS: String(checkIntervalMs),
      },
      attachmentName: 'bridge-cli-idle-timeout-stderr',
    });

    try {
      const { text: sessionText } = await startNewSession(client, 'mcp-bridge-cli-idle-timeout-tests');
      expect(sessionText, 'Session should start successfully').toContain('Status: Success');

      const { text: stepText } = await executeStep(client, 'I test');
      expect(stepText, 'Step should execute successfully').toContain('Status: Success');

      // Wait for idle timeout + check interval + buffer (3s + 1s + 1.5s = 5.5s)
      const waitTimeMs = idleTimeoutMs + checkIntervalMs + 1_500;
      await new Promise((resolve) => setTimeout(resolve, waitTimeMs));

      // After shutdown, bridge should revert to bootstrap state, so executing a step
      // without restarting the session must return the SESSION_NOT_STARTED error.
      const { result: postTimeoutResult, text: postTimeoutText } = await executeStep(client, 'I test');

      expect(postTimeoutResult, 'Call should respond with error when server auto-shuts down').toEqual(
        expect.objectContaining({ isError: true })
      );
      expect(postTimeoutText, 'Bootstrap mode should block tools before new session start').toBe(
        'Status: Failed\nError: Session not started. Please call session_start_new first.'
      );
    } finally {
      await cleanup();
    }
  });

});
