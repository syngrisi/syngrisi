import { expect, test } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ChildProcess } from 'node:child_process';

import { findEphemeralPort } from '../utils/port-utils';
import { spawnMcpServer } from '../utils/server-spawn';
import { TIMEOUTS } from './utils';
import { runTestEngineCli } from './utils/test-engine-cli';

test.describe('MCP Test Engine CLI tests', { tag: '@no-app-start' }, () => {
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
  });

  test('runs start, step and shutdown commands', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const result = await runTestEngineCli(testInfo, {
      commands: [
        'start mcp-test-engine-cli-basic',
        'step "I test"',
        'shutdown',
      ],
      attachmentName: 'mcp-test-engine-cli-basic-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Status: Success');
    expect(result.stdout).toContain('Result: "Test message from diagnostic step"');
    expect(result.stdout).toContain('Shutdown notification sent.');
  });

  test('runs batch commands successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const result = await runTestEngineCli(testInfo, {
      commands: [
        'start mcp-test-engine-cli-batch',
        'batch "I test" "I get current URL"',
        'shutdown',
      ],
      attachmentName: 'mcp-test-engine-cli-batch-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Executed 2 steps successfully');
    expect(result.stdout).toContain('1. When I test');
    expect(result.stdout).toContain('2. When I get current URL');
  });

  test('runs structured step-json command successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const result = await runTestEngineCli(testInfo, {
      args: [
        '--command', 'start mcp-test-engine-cli-step-json',
        '--command', `step-json ${JSON.stringify({ stepText: 'I test' })}`,
        '--command', 'shutdown',
      ],
      attachmentName: 'mcp-test-engine-cli-step-json-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Result: "Test message from diagnostic step"');
    expect(result.stdout).toContain('Shutdown notification sent.');
  });

  test('runs structured batch-json command successfully', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const result = await runTestEngineCli(testInfo, {
      args: [
        '--command', 'start mcp-test-engine-cli-batch-json',
        '--command', `batch-json ${JSON.stringify([{ stepText: 'I test' }, { stepText: 'I get current URL' }])}`,
        '--command', 'shutdown',
      ],
      attachmentName: 'mcp-test-engine-cli-batch-json-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Executed 2 steps successfully');
    expect(result.stdout).toContain('1. When I test');
    expect(result.stdout).toContain('2. When I get current URL');
  });

  test('reads step docstring from file', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);

    const docstringPath = path.join('/tmp', `mcp-docstring-${Date.now()}-${testInfo.workerIndex}.yml`);
    await fs.writeFile(docstringPath, 'SYNGRISI_TEST_MODE: "true"\nSYNGRISI_AUTH: "false"\n', 'utf8');

    try {
      const result = await runTestEngineCli(testInfo, {
        commands: [
          'start mcp-test-engine-cli-docstring-file',
          `step "I set env variables:" --docstring-file "${docstringPath}"`,
          'shutdown',
        ],
        attachmentName: 'mcp-test-engine-cli-docstring-file-output',
      });

      expect(result.code).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.stdout).toContain('Status: Success');
      expect(result.stdout).toContain('Shutdown notification sent.');
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

  test('attaches to an existing debug MCP server', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE_EXTENDED);

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

      const result = await runTestEngineCli(testInfo, {
        commands: [
          'attach',
          'start test-engine-attached-session',
          'shutdown',
        ],
        attachmentName: 'mcp-test-engine-cli-attach-output',
      });

      expect(serverErrors).toEqual([]);
      expect(result.code).toBe(0);
      expect(result.stderr).toBe('');
      expect(result.stdout).toContain(`Connected to debug MCP server on port ${debugPort}`);
      expect(result.stdout).toContain('Status: Success');
      expect(result.stdout).toContain('Shutdown notification sent.');

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
    expect(result.stderr).toContain('Session not started. Please call session_start_new first.');
  });
});
