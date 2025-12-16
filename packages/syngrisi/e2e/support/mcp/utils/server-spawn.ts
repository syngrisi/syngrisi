import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { getProjectRoot } from './common';
import { ensurePathExists } from '@utils/fs';

const READY_MARKER_REGEX = /MCP server listening at http:\/\/localhost:(\d+)/;

export interface SpawnServerOptions {
  port: number;
  extraEnv?: Record<string, string>;
  onStdout: (chunk: Buffer) => void;
  onStderr: (chunk: Buffer) => void;
  onExit: (code: number | null, signal: NodeJS.Signals | null) => void;
  onError: (error: Error) => void;
}

export interface SpawnServerResult {
  child: ChildProcess;
  port: number;
}

export async function spawnMcpServer(options: SpawnServerOptions): Promise<SpawnServerResult> {
  const { port, extraEnv, onStdout, onStderr, onExit, onError } = options;

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    MCP_KEEP_ALIVE: '0',
    PORT: String(port),
    ...(extraEnv ?? {}),
  };

  // Debug: log idle timeout env vars
  if (env.MCP_IDLE_TIMEOUT_MS || env.MCP_IDLE_CHECK_INTERVAL_MS) {
    // Route debug to stderr; prefix clearly for test attachments
    console.error(
      `[server-spawn] MCP idle config → timeout=${env.MCP_IDLE_TIMEOUT_MS ?? 'unset'}ms, interval=${env.MCP_IDLE_CHECK_INTERVAL_MS ?? 'unset'}ms`
    );
  }

  const projectRoot = getProjectRoot();
  const e2eRoot = path.join(projectRoot, 'e2e');

  const spawnArgs = [
    'playwright',
    'test',
    '--config',
    path.join(e2eRoot, 'support/mcp/playwright.config.ts'),
    '--project=chromium',
    path.join(e2eRoot, 'support/mcp/mcp.spec.ts'),
  ];

  const binName = process.platform === 'win32' ? 'playwright.cmd' : 'playwright';
  const playwrightBin = path.join(e2eRoot, 'node_modules', '.bin', binName);

  await ensurePathExists(playwrightBin, 'file');

  const child = spawn(playwrightBin, spawnArgs.slice(1), {
    cwd: e2eRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  let readyResolved = false;
  let resolvedPort: number | null = null;

  const readyPromise = new Promise<number>((resolve, reject) => {
    const inspectOutput = (chunk: Buffer, source: 'stdout' | 'stderr') => {
      if (source === 'stdout') {
        onStdout(chunk);
      } else {
        onStderr(chunk);
      }

      if (readyResolved) {
        return;
      }

      const text = chunk.toString();
      const match = READY_MARKER_REGEX.exec(text);
      if (match) {
        readyResolved = true;
        const detectedPort = Number.parseInt(match[1], 10);
        if (!Number.isNaN(detectedPort)) {
          resolvedPort = detectedPort;
          resolve(detectedPort);
        }
      }
    };

    child.stdout?.on('data', (chunk: Buffer) => inspectOutput(chunk, 'stdout'));
    child.stderr?.on('data', (chunk: Buffer) => inspectOutput(chunk, 'stderr'));

    child.once('exit', (code, signal) => {
      if (!readyResolved) {
        const message = code === null
          ? `Playwright server exited before readiness due to signal ${signal ?? 'unknown'}`
          : `Playwright server exited with code ${code} before readiness`;
        reject(new Error(message));
      }
    });

    child.once('error', (error: Error) => {
      if (!readyResolved) {
        reject(error);
      }
    });
  });

  child.on('exit', onExit);
  child.on('error', onError);

  const finalPort = await readyPromise;
  
  if (resolvedPort === null) {
    throw new Error('Playwright server did not report a listening port');
  }

  return { child, port: finalPort };
}
