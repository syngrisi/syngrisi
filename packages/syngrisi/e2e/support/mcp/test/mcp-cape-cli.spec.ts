import http from 'node:http';
import { expect, test } from '@playwright/test';
import process from 'node:process';

import { removeSessionState, writeSessionState } from '../test-engine-state';
import { TIMEOUTS } from './utils';
import { runTestEngineCli } from './utils/test-engine-cli';

test.describe('MCP Cape-style CLI integration', { tag: '@no-app-start' }, () => {
  test('resolve uses SYSTEM_THREAD by default', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);
    const env = {
      SYSTEM_THREAD: `cape-env-${testInfo.workerIndex}-${testInfo.retry}`,
    };

    const result = await runTestEngineCli(testInfo, {
      args: ['resolve'],
      env,
      attachmentName: 'mcp-cape-cli-resolve-env-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain(`System thread: ${env.SYSTEM_THREAD}`);
    expect(result.stdout).toContain('Resolved via: system_thread');
    expect(result.stdout).toContain('Has active session: no');
  });

  test('explicit --system-thread overrides env-based resolution', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);
    const explicitAgentId = `cape-explicit-${testInfo.workerIndex}-${testInfo.retry}`;

    const result = await runTestEngineCli(testInfo, {
      args: ['resolve', '--system-thread', explicitAgentId],
      env: {
        SYSTEM_THREAD: `cape-env-${testInfo.workerIndex}-${testInfo.retry}`,
      },
      attachmentName: 'mcp-cape-cli-resolve-explicit-output',
    });

    expect(result.code).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain(`System thread: ${explicitAgentId}`);
    expect(result.stdout).toContain('Resolved via: cli');
  });

  test('reuses an existing explicit agent session across separate invocations', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const agentId = `cape-session-${testInfo.workerIndex}-${testInfo.retry}`;
    const server = http.createServer((request, response) => {
      if (request.method === 'GET' && request.url === '/status') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ ok: true, state: null }));
        return;
      }

      if (request.method === 'POST' && request.url === '/command') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const payload = JSON.parse(body || '{}') as { command?: string };
          const isShutdown = payload.command?.trim().startsWith('shutdown') ?? false;

          response.writeHead(200, { 'content-type': 'application/json' });
          response.end(JSON.stringify({
            ok: true,
            shouldExit: isShutdown,
            stdout: isShutdown ? 'Shutdown notification sent.' : '',
            stderr: '',
          }));
        });
        return;
      }

      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ ok: false }));
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to determine fake daemon port.');
    }

    try {
      await writeSessionState(agentId, {
        agentId,
        sessionName: 'cape-session-demo',
        daemonPid: process.pid,
        daemonPort: address.port,
        headed: false,
        mode: 'start',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        sessionId: 'fake-session',
        logFile: 'fake-session.jsonl',
      });

      const statusResult = await runTestEngineCli(testInfo, {
        args: ['status', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-status-output',
      });
      const reuseResult = await runTestEngineCli(testInfo, {
        args: ['start', 'cape-session-demo', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-reuse-output',
      });
      const shutdownResult = await runTestEngineCli(testInfo, {
        args: ['shutdown', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-shutdown-output',
      });
      await removeSessionState(agentId);
      const afterShutdownResult = await runTestEngineCli(testInfo, {
        args: ['status', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-after-shutdown-output',
      });

      expect(statusResult.code).toBe(0);
      expect(statusResult.stderr).toBe('');
      expect(statusResult.stdout).toContain('Has active session: yes');
      expect(statusResult.stdout).toContain('Session name: cape-session-demo');

      expect(reuseResult.code).toBe(0);
      expect(reuseResult.stderr).toBe('');
      expect(reuseResult.stdout).toContain('Resolved via: cli');
      expect(reuseResult.stdout).toContain('Reused: yes');

      expect(shutdownResult.code).toBe(0);
      expect(shutdownResult.stderr).toBe('');
      expect(shutdownResult.stdout).toContain('Shutdown notification sent.');

      expect(afterShutdownResult.code).toBe(0);
      expect(afterShutdownResult.stderr).toBe('');
      expect(afterShutdownResult.stdout).toContain('Has active session: no');
    } finally {
      await removeSessionState(agentId);
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  test('fails clearly when shutting down a missing explicit session', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.CALL_TOOL);
    const agentId = `cape-missing-${testInfo.workerIndex}-${testInfo.retry}`;

    const result = await runTestEngineCli(testInfo, {
      args: ['shutdown', '--system-thread', agentId],
      attachmentName: 'mcp-cape-cli-missing-shutdown-output',
    });

    expect(result.code).toBe(1);
    expect(result.stderr).toContain(`No active session found for agent "${agentId}". Run start first.`);
  });

  test('fails clearly when auto-resolution is ambiguous across multiple active sessions', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const firstAgentId = `cape-ambiguous-a-${testInfo.workerIndex}-${testInfo.retry}`;
    const secondAgentId = `cape-ambiguous-b-${testInfo.workerIndex}-${testInfo.retry}`;

    try {
      await writeSessionState(firstAgentId, {
        agentId: firstAgentId,
        sessionName: 'cape-ambiguous-a',
        daemonPid: process.pid,
        daemonPort: 50001,
        headed: false,
        mode: 'start',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
      await writeSessionState(secondAgentId, {
        agentId: secondAgentId,
        sessionName: 'cape-ambiguous-b',
        daemonPid: process.pid,
        daemonPort: 50002,
        headed: false,
        mode: 'start',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });

      const ambiguousResult = await runTestEngineCli(testInfo, {
        args: ['status'],
        env: {
          SYSTEM_THREAD: '',
          TEST_ENGINE_DISABLE_PROCESS_TREE_HEURISTICS: '1',
        },
        attachmentName: 'mcp-cape-cli-ambiguous-status-output',
      });

      expect(ambiguousResult.code).toBe(1);
      expect(ambiguousResult.stderr).toContain('Unable to resolve system thread.');
    } finally {
      await removeSessionState(firstAgentId);
      await removeSessionState(secondAgentId);
    }
  });

  test('marks session as broken when daemon reports lost MCP session', async ({ }, testInfo) => {
    test.setTimeout(TIMEOUTS.TEST_SUITE);
    const agentId = `cape-broken-${testInfo.workerIndex}-${testInfo.retry}`;
    const server = http.createServer((request, response) => {
      if (request.method === 'GET' && request.url === '/status') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ ok: true, state: null }));
        return;
      }

      if (request.method === 'POST' && request.url === '/command') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const payload = JSON.parse(body || '{}') as { command?: string };
          const isShutdown = payload.command?.trim().startsWith('shutdown') ?? false;

          response.writeHead(200, { 'content-type': 'application/json' });
          response.end(JSON.stringify({
            ok: isShutdown,
            shouldExit: isShutdown,
            stdout: '',
            stderr: isShutdown ? '' : 'Session not started. Please call session_start_new first.',
          }));
        });
        return;
      }

      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ ok: false }));
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to determine fake daemon port.');
    }

    try {
      await writeSessionState(agentId, {
        agentId,
        sessionName: 'cape-broken-demo',
        daemonPid: process.pid,
        daemonPort: address.port,
        headed: false,
        mode: 'start',
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        health: 'ready',
      });

      const stepResult = await runTestEngineCli(testInfo, {
        args: ['step', 'I analyze current page', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-broken-step-output',
      });
      const statusResult = await runTestEngineCli(testInfo, {
        args: ['status', '--system-thread', agentId],
        attachmentName: 'mcp-cape-cli-broken-status-output',
      });

      expect(stepResult.code).toBe(1);
      expect(stepResult.stderr).toContain('Session not started. Please call session_start_new first.');

      expect(statusResult.code).toBe(0);
      expect(statusResult.stdout).toContain('Health: broken');
      expect(statusResult.stdout).toContain('Broken reason: Session not started. Please call session_start_new first.');
    } finally {
      await removeSessionState(agentId);
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
