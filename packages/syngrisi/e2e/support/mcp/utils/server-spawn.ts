import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { getProjectRoot, ensurePathExists } from './common';

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

// Counter to generate unique worker indices for spawned servers within a single worker process
let spawnCounter = 0;

export async function spawnMcpServer(options: SpawnServerOptions): Promise<SpawnServerResult> {
  const { port, extraEnv, onStdout, onStderr, onExit, onError } = options;

  // Generate unique worker index to avoid port conflicts in parallel tests
  // Use TEST_WORKER_INDEX if already set high (100+), otherwise use spawn counter
  // This handles the case where the parent test already set a unique high index
  const parentWorkerIndex = parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
  let uniqueWorkerIndex: number;
  if (parentWorkerIndex >= 100) {
    // Already have a high index from parent - just add spawn counter within same range
    uniqueWorkerIndex = parentWorkerIndex + (spawnCounter++);
  } else {
    // Normal Playwright worker (0-99) - add offset to avoid conflicts
    uniqueWorkerIndex = 100 + (parentWorkerIndex * 10) + (spawnCounter++);
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    MCP_KEEP_ALIVE: '0',
    PORT: String(port),
    E2E_HEADLESS: process.env.E2E_HEADLESS || '0',
    // Override TEST_WORKER_INDEX to ensure unique port allocation
    TEST_WORKER_INDEX: String(uniqueWorkerIndex),
    ...(extraEnv ?? {}),
  };

  // Debug: log idle timeout env vars
  if (env.MCP_IDLE_TIMEOUT_MS || env.MCP_IDLE_CHECK_INTERVAL_MS) {
    // Route debug to stderr; prefix clearly for test attachments
    console.error(
      `[server-spawn] MCP idle config → timeout=${env.MCP_IDLE_TIMEOUT_MS ?? 'unset'}ms, interval=${env.MCP_IDLE_CHECK_INTERVAL_MS ?? 'unset'}ms`
    );
  }

  let projectRoot = getProjectRoot();
  // getProjectRoot() may return the package root (packages/syngrisi) or e2e directory
  // depending on where the process is running from.
  // We need to ensure we have the e2e directory path.
  const { existsSync } = await import('node:fs');

  // Check if we're already in e2e directory
  if (!existsSync(path.join(projectRoot, 'support/mcp/bridge.ts'))) {
    // Try e2e subdirectory
    const e2eSubdir = path.join(projectRoot, 'e2e');
    if (existsSync(path.join(e2eSubdir, 'support/mcp/bridge.ts'))) {
      projectRoot = e2eSubdir;
    }
  }
  const e2eRoot = projectRoot;

  const spawnArgs = [
    'playwright',
    'test',
    '--config',
    path.join(e2eRoot, 'support/mcp/playwright.server.config.ts'),
    '--project=chromium',
    path.join(e2eRoot, 'support/mcp/test/mcp.spec.ts'),
  ];

  const binName = process.platform === 'win32' ? 'playwright.cmd' : 'playwright';
  // Try e2e/node_modules first, then fall back to parent node_modules (monorepo root)
  let playwrightBin = path.join(e2eRoot, 'node_modules', '.bin', binName);
  if (!existsSync(playwrightBin)) {
    // Fallback: look in parent directories for monorepo structure
    const parentNodeModules = path.join(e2eRoot, '..', 'node_modules', '.bin', binName);
    if (existsSync(parentNodeModules)) {
      playwrightBin = parentNodeModules;
    }
  }

  await ensurePathExists(playwrightBin, 'file');

  const child = spawn(playwrightBin, spawnArgs.slice(1), {
    cwd: e2eRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
  });

  let readyResolved = false;
  let resolvedPort: number | null = null;
  const outputBuffer: string[] = [];

  const readyPromise = new Promise<number>((resolve, reject) => {
    const inspectOutput = (chunk: Buffer, source: 'stdout' | 'stderr') => {
      if (source === 'stdout') {
        onStdout(chunk);
      } else {
        onStderr(chunk);
      }

      const text = chunk.toString();
      // Buffer output for error diagnosis
      outputBuffer.push(`[${source}] ${text}`);

      if (readyResolved) {
        return;
      }

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
        const baseMessage = code === null
          ? `Playwright server exited before readiness due to signal ${signal ?? 'unknown'}`
          : `Playwright server exited with code ${code} before readiness`;
        // Include buffered output for debugging
        const outputSummary = outputBuffer.length > 0
          ? `\n--- Server output ---\n${outputBuffer.slice(-50).join('')}`
          : '\n(no output captured)';
        reject(new Error(`${baseMessage}${outputSummary}`));
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
