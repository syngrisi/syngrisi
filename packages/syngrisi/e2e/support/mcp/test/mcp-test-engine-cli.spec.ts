import { expect, test } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ChildProcess } from 'node:child_process';

import { findEphemeralPort } from '../utils/port-utils';
import { spawnMcpServer } from '../utils/server-spawn';
import { TIMEOUTS } from './utils';
import { runTestEngineCli } from './utils/test-engine-cli';

test.describe('MCP Test Engine CLI tests', { tag: '@no-app-start' }, () => {
  const buildSessionEnv = (testInfo: Parameters<typeof runTestEngineCli>[0], suffix: string) => ({
    SYSTEM_THREAD: `test-engine-cli-${testInfo.workerIndex}-${testInfo.retry}-${suffix}`,
  });

  test('prints help output', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);

    const result = await runTestEngineCli(testInfo, {
      args: ['help'],
      attachmentName: 'mcp-test-engine-cli-help-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Syngrisi MCP Test Engine CLI');
    expect(result.stdout).toContain('start <sessionName> [--headed]');
    expect(result.stdout).toContain('step <stepText>');
    expect(result.stdout).toContain('Use start once; every next CLI call reuses the same session via local state.');
  });

  test('runs start, step, reuse and shutdown across separate invocations', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const env = buildSessionEnv(testInfo, 'basic');

    const startResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-basic'],
      env,
      attachmentName: 'mcp-test-engine-cli-basic-start-output',
    });
    const stepResult = await runTestEngineCli(testInfo, {
      args: ['step', 'I test'],
      env,
      attachmentName: 'mcp-test-engine-cli-basic-step-output',
    });
    const reuseResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-basic'],
      env,
      attachmentName: 'mcp-test-engine-cli-basic-reuse-output',
    });
    const shutdownResult = await runTestEngineCli(testInfo, {
      args: ['shutdown'],
      env,
      attachmentName: 'mcp-test-engine-cli-basic-shutdown-output',
    });

    expect(startResult.code).toBe(0);
    expect(startResult.stderr).toBe('');
    expect(startResult.stdout).toContain('Status: Success');
    expect(startResult.stdout).toContain('Reused: no');

    expect(stepResult.code).toBe(0);
    expect(stepResult.stderr).toBe('');
    expect(stepResult.stdout).toContain('Result: "Test message from diagnostic step"');

    expect(reuseResult.code).toBe(0);
    expect(reuseResult.stderr).toBe('');
    expect(reuseResult.stdout).toContain('Reused: yes');

    expect(shutdownResult.code).toBe(0);
    expect(shutdownResult.stderr).toBe('');
    expect(shutdownResult.stdout).toContain('Shutdown notification sent.');
  });

  test('runs batch commands successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const env = buildSessionEnv(testInfo, 'batch');

    const startResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-batch'],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-start-output',
    });
    const batchResult = await runTestEngineCli(testInfo, {
      args: ['batch', 'I test', 'I get current URL'],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-output',
    });
    const shutdownResult = await runTestEngineCli(testInfo, {
      args: ['shutdown'],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-shutdown-output',
    });

    expect(startResult.code).toBe(0);
    expect(startResult.stderr).toBe('');
    expect(batchResult.code).toBe(0);
    expect(batchResult.stderr).toBe('');
    expect(batchResult.stdout).toContain('Executed 2 steps successfully');
    expect(batchResult.stdout).toContain('1. When I test');
    expect(batchResult.stdout).toContain('2. When I get current URL');
    expect(shutdownResult.code).toBe(0);
    expect(shutdownResult.stderr).toBe('');
  });

  test('runs structured step-json command successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const env = buildSessionEnv(testInfo, 'step-json');

    const startResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-step-json'],
      env,
      attachmentName: 'mcp-test-engine-cli-step-json-start-output',
    });
    const stepResult = await runTestEngineCli(testInfo, {
      args: ['step-json', JSON.stringify({ stepText: 'I test' })],
      env,
      attachmentName: 'mcp-test-engine-cli-step-json-output',
    });
    const shutdownResult = await runTestEngineCli(testInfo, {
      args: ['shutdown'],
      env,
      attachmentName: 'mcp-test-engine-cli-step-json-shutdown-output',
    });

    expect(startResult.code).toBe(0);
    expect(startResult.stderr).toBe('');
    expect(stepResult.code).toBe(0);
    expect(stepResult.stderr).toBe('');
    expect(stepResult.stdout).toContain('Result: "Test message from diagnostic step"');
    expect(shutdownResult.code).toBe(0);
    expect(shutdownResult.stderr).toBe('');
  });

  test('runs structured batch-json command successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const env = buildSessionEnv(testInfo, 'batch-json');

    const startResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-batch-json'],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-json-start-output',
    });
    const batchResult = await runTestEngineCli(testInfo, {
      args: ['batch-json', JSON.stringify([{ stepText: 'I test' }, { stepText: 'I get current URL' }])],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-json-output',
    });
    const shutdownResult = await runTestEngineCli(testInfo, {
      args: ['shutdown'],
      env,
      attachmentName: 'mcp-test-engine-cli-batch-json-shutdown-output',
    });

    expect(startResult.code).toBe(0);
    expect(startResult.stderr).toBe('');
    expect(batchResult.code).toBe(0);
    expect(batchResult.stderr).toBe('');
    expect(batchResult.stdout).toContain('Executed 2 steps successfully');
    expect(batchResult.stdout).toContain('1. When I test');
    expect(batchResult.stdout).toContain('2. When I get current URL');
    expect(shutdownResult.code).toBe(0);
    expect(shutdownResult.stderr).toBe('');
  });

  test('reads step docstring from file', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const env = buildSessionEnv(testInfo, 'docstring-file');

    const docstringPath = path.join('/tmp', `mcp-docstring-${Date.now()}-${testInfo.workerIndex}.yml`);
    await fs.writeFile(docstringPath, 'SYNGRISI_TEST_MODE: "true"\nSYNGRISI_AUTH: "false"\n', 'utf8');

    try {
      const startResult = await runTestEngineCli(testInfo, {
        args: ['start', 'mcp-test-engine-cli-docstring-file'],
        env,
        attachmentName: 'mcp-test-engine-cli-docstring-file-start-output',
      });
      const stepResult = await runTestEngineCli(testInfo, {
        args: ['step', 'I set env variables:', '--docstring-file', docstringPath],
        env,
        attachmentName: 'mcp-test-engine-cli-docstring-file-output',
      });
      const shutdownResult = await runTestEngineCli(testInfo, {
        args: ['shutdown'],
        env,
        attachmentName: 'mcp-test-engine-cli-docstring-file-shutdown-output',
      });

      expect(startResult.code).toBe(0);
      expect(startResult.stderr).toBe('');
      expect(stepResult.code).toBe(0);
      expect(stepResult.stderr).toBe('');
      expect(stepResult.stdout).toContain('Status: Success');
      expect(shutdownResult.code).toBe(0);
      expect(shutdownResult.stderr).toBe('');
    } finally {
      await fs.rm(docstringPath, { force: true }).catch(() => undefined);
    }
  });

  test('finds matching steps without starting a session', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);

    const result = await runTestEngineCli(testInfo, {
      commands: ['steps find set env variables'],
      attachmentName: 'mcp-test-engine-cli-steps-find-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Found');
    expect(result.stdout).toContain('I set env variables:');
    expect(result.stdout).toContain('steps/domain/');
  });

  test('reports session status and supports explicit --system-thread', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const agentId = `explicit-agent-${testInfo.workerIndex}-${testInfo.retry}`;

    const startResult = await runTestEngineCli(testInfo, {
      args: ['start', 'mcp-test-engine-cli-status', '--system-thread', agentId],
      attachmentName: 'mcp-test-engine-cli-status-start-output',
    });
    const statusResult = await runTestEngineCli(testInfo, {
      args: ['status', '--system-thread', agentId],
      attachmentName: 'mcp-test-engine-cli-status-output',
    });
    const shutdownResult = await runTestEngineCli(testInfo, {
      args: ['shutdown', '--system-thread', agentId],
      attachmentName: 'mcp-test-engine-cli-status-shutdown-output',
    });
    const afterShutdownResult = await runTestEngineCli(testInfo, {
      args: ['status', '--system-thread', agentId],
      attachmentName: 'mcp-test-engine-cli-status-after-shutdown-output',
    });

    expect(startResult.code).toBe(0);
    expect(startResult.stderr).toBe('');
    expect(startResult.stdout).toContain(`System thread: ${agentId}`);
    expect(startResult.stdout).toContain('Resolved via: cli');

    expect(statusResult.code).toBe(0);
    expect(statusResult.stderr).toBe('');
    expect(statusResult.stdout).toContain('Has active session: yes');
    expect(statusResult.stdout).toContain('Session name: mcp-test-engine-cli-status');

    expect(shutdownResult.code).toBe(0);
    expect(shutdownResult.stderr).toBe('');

    expect(afterShutdownResult.code).toBe(0);
    expect(afterShutdownResult.stderr).toBe('');
    expect(afterShutdownResult.stdout).toContain('Has active session: no');
  });

  test('attaches to an existing debug MCP server', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);
    const env = buildSessionEnv(testInfo, 'attach');

    let debugServerProcess: ChildProcess | null = null;
    let portFilePath: string | null = null;
    const serverErrors: Error[] = [];
    let debugServerClosedResolve: (() => void) | null = null;
    const debugServerClosed = new Promise<void>((resolve) => {
      debugServerClosedResolve = resolve;
    });

    try {
      const preferredPort = await findEphemeralPort();
      const spawnResult = await spawnMcpServer({
        port: preferredPort,
        onStdout: () => undefined,
        onStderr: () => undefined,
        onExit: () => {
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
      await fs.writeFile(
        portFilePath,
        `${JSON.stringify({
          port: debugPort,
          recordedAt: new Date().toISOString(),
          scenario: {
            title: 'Test Engine Attach Scenario',
            titlePath: ['Feature: Test Engine', 'Scenario: Test Engine Attach Scenario'],
            featurePath: 'support/mcp/test/test-engine-attach.feature',
            featureUri: 'file://' + path.join(process.cwd(), 'support/mcp/test/test-engine-attach.feature'),
          },
        }, null, 2)}\n`,
        'utf8',
      );

      const attachResult = await runTestEngineCli(testInfo, {
        args: ['attach'],
        env,
        attachmentName: 'mcp-test-engine-cli-attach-output',
      });
      const stepResult = await runTestEngineCli(testInfo, {
        args: ['step', 'I test'],
        env,
        attachmentName: 'mcp-test-engine-cli-attach-step-output',
      });
      const shutdownResult = await runTestEngineCli(testInfo, {
        args: ['shutdown'],
        env,
        attachmentName: 'mcp-test-engine-cli-attach-shutdown-output',
      });

      expect(serverErrors).toEqual([]);
      expect(attachResult.code).toBe(0);
      expect(attachResult.stderr).toBe('');
      expect(attachResult.stdout).toContain(`Connected to debug MCP server on port ${debugPort}`);
      expect(attachResult.stdout).toContain('Status: Success');
      expect(stepResult.code).toBe(0);
      expect(stepResult.stderr).toBe('');
      expect(stepResult.stdout).toContain('Result: "Test message from diagnostic step"');
      expect(shutdownResult.code).toBe(0);
      expect(shutdownResult.stderr).toBe('');
      expect(shutdownResult.stdout).toContain('Shutdown notification sent.');

      if (debugServerProcess.exitCode === null) {
        await Promise.race([
          debugServerClosed,
          new Promise<void>((resolve) => {
            setTimeout(resolve, 10_000);
          }),
        ]);
      }
    } finally {
      if (debugServerProcess && debugServerProcess.exitCode === null) {
        debugServerProcess.kill('SIGTERM');
        await Promise.race([
          debugServerClosed,
          new Promise<void>((resolve) => {
            setTimeout(resolve, 10_000);
          }),
        ]);
      }

      if (portFilePath) {
        await fs.rm(portFilePath, { force: true }).catch(() => undefined);
      }
    }
  });

  test('fails fast on invalid command usage', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);

    const result = await runTestEngineCli(testInfo, {
      args: ['batch', 'I test'],
      attachmentName: 'mcp-test-engine-cli-invalid-usage-output',
    });

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('batch requires at least 2 steps.');
  });

  test('surfaces bridge session errors', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);

    const result = await runTestEngineCli(testInfo, {
      args: ['step', 'I test'],
      attachmentName: 'mcp-test-engine-cli-session-error-output',
    });

    expect(result.code).toBe(1);
    expect(result.stderr).toContain('No active session found for agent');
  });
});
