import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import type { TestInfo } from '@playwright/test';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const TEST_ENGINE_CLI_RELATIVE_PATH = ['support', 'mcp', 'test-engine-cli.ts'];

const runTestEngineCli = async (
  testInfo: TestInfo,
  options: {
    args?: string[];
    commands?: string[];
    env?: Record<string, string>;
    attachmentName?: string;
  } = {},
): Promise<{ code: number | null; signal: NodeJS.Signals | null; stdout: string; stderr: string }> => {
  const {
    args = [],
    commands = [],
    env: envOverrides = {},
    attachmentName = 'test-engine-cli-output',
  } = options;

  const e2eRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const commandArgs = [
    'tsx',
    path.join(...TEST_ENGINE_CLI_RELATIVE_PATH),
    ...args,
    ...commands.flatMap((command) => ['--command', command]),
  ];

  const workerInstanceId = `test-engine-${testInfo.workerIndex}-${testInfo.retry}-${randomUUID()}`;

  return new Promise((resolve, reject) => {
    const child = spawn(NPX_BIN, commandArgs, {
      cwd: e2eRoot,
      env: {
        ...(process.env as Record<string, string>),
        ZENFLOW_WORKER_INSTANCE: workerInstanceId,
        E2E_HEADLESS: '1',
        NODE_NO_WARNINGS: '1',
        ...envOverrides,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');

    child.stdout?.on('data', (chunk: string) => {
      stdout += chunk;
    });

    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk;
    });

    child.once('error', reject);

    child.once('exit', async (code, signal) => {
      if (testInfo.status !== 'passed' && (stdout || stderr)) {
        await testInfo.attach(attachmentName, {
          body: `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
          contentType: 'text/plain',
        });
      }

      resolve({ code, signal, stdout, stderr });
    });
  });
};

export { runTestEngineCli };
