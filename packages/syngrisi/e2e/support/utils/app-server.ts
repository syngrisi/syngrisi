import path from "path";
import { spawn } from "child_process";
import { once } from "events";
import http from "http";
import net from "net";
import { env } from '@config';
import { sleep, waitFor } from "@utils/common";
import { resolveRepoRoot, ensurePathExists } from "@utils/fs";
import { createLogger } from "@lib/logger";

const REPO_ROOT = resolveRepoRoot();

const backendLogger = createLogger('backend', { fileLevel: 'debug', consoleLevel: 'info' });

type Child = ReturnType<typeof spawn>;

export interface RunningAppServer {
  baseURL: string;
  backendHost: string;
  serverPort: number;
  config: {
    connectionString: string;
    defaultImagesPath: string;
  };
  stop: () => Promise<void>;
  getBackendLogs: () => string;
  getFrontendLogs: () => string;
}

export type LaunchAppServerOptions = {
  env?: Record<string, string>;
  cid?: number;
};

function getCid(): number {
  if (env.DOCKER === '1') return 100;
  return parseInt(process.env.TEST_WORKER_INDEX || '0', 10);
}

function resolveTestPaths(cid: number) {
  const databaseName = 'SyngrisiDbTest';
  const requestedDbUri =
    process.env.SYNGRISI_DB_URI ||
    env.SYNGRISI_DB_URI ||
    '';
  const requestedImagesPath =
    process.env.SYNGRISI_IMAGES_PATH ||
    env.SYNGRISI_IMAGES_PATH ||
    '';

  const enforcedDbUri = `mongodb://127.0.0.1/${databaseName}${cid}`;
  const enforcedImagesPath = path.resolve(REPO_ROOT, 'baselinesTest', String(cid));

  if (requestedDbUri && requestedDbUri !== enforcedDbUri) {
    backendLogger.warn(
      `Overriding provided SYNGRISI_DB_URI (${requestedDbUri}) with test database ${enforcedDbUri} to isolate e2e runs`,
    );
  }

  if (requestedImagesPath && requestedImagesPath !== enforcedImagesPath) {
    backendLogger.warn(
      `Overriding provided SYNGRISI_IMAGES_PATH (${requestedImagesPath}) with test path ${enforcedImagesPath} to isolate e2e runs`,
    );
  }

  return {
    connectionString: enforcedDbUri,
    defaultImagesPath: enforcedImagesPath,
  };
}

export async function launchAppServer(
  options: LaunchAppServerOptions = {},
): Promise<RunningAppServer> {
  const { env: additionalEnv, cid: providedCid } = options;
  const cid = providedCid ?? getCid();

  const cmdPath = path.resolve(REPO_ROOT);
  const runtimeEnv = process.env;
  const backendHost = runtimeEnv.E2E_BACKEND_HOST ?? env.E2E_BACKEND_HOST;

  // Determine port priority: options.env > process.env > default calculation
  const envPort = additionalEnv?.SYNGRISI_APP_PORT ?? runtimeEnv.SYNGRISI_APP_PORT;
  const cidPort = envPort ? parseInt(envPort, 10) : 3002 + cid;

  const baseURL = `http://${backendHost}:${cidPort}`;

  const serverScriptPath = path.join(cmdPath, 'dist', 'server', 'server.js');
  await ensurePathExists(serverScriptPath, "file");

  // IMPORTANT: Check additionalEnv FIRST to avoid race conditions with parallel workers
  // Each worker may set different values in process.env, so explicit options take precedence
  const disableFirstRun = additionalEnv?.SYNGRISI_DISABLE_FIRST_RUN ?? runtimeEnv.SYNGRISI_DISABLE_FIRST_RUN ?? env.SYNGRISI_DISABLE_FIRST_RUN ?? 'true';
  const authEnabled = additionalEnv?.SYNGRISI_AUTH ?? runtimeEnv.SYNGRISI_AUTH ?? env.SYNGRISI_AUTH ?? 'false';
  const coverageFlag = additionalEnv?.SYNGRISI_COVERAGE ?? runtimeEnv.SYNGRISI_COVERAGE ?? env.SYNGRISI_COVERAGE ?? 'false';

  const nodeEnv = (additionalEnv?.NODE_ENV || runtimeEnv.NODE_ENV || 'test') as string;

  const { connectionString: defaultConnectionString, defaultImagesPath } = resolveTestPaths(cid);

  const spawnEnv: Record<string, string> = {
    ...runtimeEnv,
    NODE_ENV: nodeEnv,
    SYNGRISI_DISABLE_FIRST_RUN: disableFirstRun,
    SYNGRISI_APP_PORT: String(cidPort),
    SYNGRISI_COVERAGE: coverageFlag === 'true' ? 'true' : 'false',
    // Only enable test mode if not explicitly set to false (allows real SSO testing)
    SYNGRISI_TEST_MODE: runtimeEnv.SYNGRISI_TEST_MODE ?? 'true',
    ...additionalEnv,
  };

  if (authEnabled !== '') {
    spawnEnv.SYNGRISI_AUTH = authEnabled;
    spawnEnv.SYNGRISI_AUTH_OVERRIDE = authEnabled;
  } else {
    delete spawnEnv.SYNGRISI_AUTH;
    delete spawnEnv.SYNGRISI_AUTH_OVERRIDE;
  }



  // Always force test DB and baselines path for e2e isolation (even if user .env points elsewhere)
  spawnEnv.SYNGRISI_DB_URI = defaultConnectionString;
  spawnEnv.SYNGRISI_IMAGES_PATH = defaultImagesPath;

  const nodePath = process.env.SYNGRISI_TEST_SERVER_NODE_PATH || process.execPath;

  let command: string;
  let args: string[];

  if (spawnEnv.SYNGRISI_COVERAGE === 'true') {
    command = 'c8';
    args = [nodePath, serverScriptPath, `syngrisi_test_server_${cid}`];
  } else {
    command = nodePath;
    args = [serverScriptPath, `syngrisi_test_server_${cid}`];
  }

  backendLogger.debug("[app-server] spawn params:", {
    command,
    args,
    options: {
      cwd: cmdPath,
      env: spawnEnv,
      stdio: ["ignore", "pipe", "pipe"],
    },
  });

  const spawnOptions = {
    cwd: cmdPath,
    env: spawnEnv,
    stdio: ["ignore", "pipe", "pipe"] as const,
  };

  // Retry logic for backend early exit (SIGINT during startup)
  const maxRetries = 3;
  let lastError: Error | null = null;
  let backend: Child | null = null;
  let backendLogs: () => string = () => '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      backend = spawn(command, args, spawnOptions);
      backendLogs = startBackendLogCapture(backend);

      await Promise.race([
        waitForHttp(`${baseURL}/v1/app/info`, 120_000),
        once(backend, "exit").then(([code, signal]) => {
          throw new Error(
            `Backend exited early (code=${code} signal=${signal}).\n${backendLogs()}`,
          );
        }),
      ]);

      // Success - break out of retry loop
      lastError = null;
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      backendLogger.warn(`Backend startup attempt ${attempt}/${maxRetries} failed: ${lastError.message}`);

      // Clean up failed process
      if (backend && !backend.killed) {
        await terminateProcess(backend);
      }

      if (attempt < maxRetries) {
        backendLogger.info(`Retrying backend startup in 2 seconds...`);
        await sleep(2000);
      }
    }
  }

  if (lastError) {
    throw new Error(`Backend failed to start after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }

  if (!backend) {
    throw new Error('Backend process was not created');
  }

  // Stabilization delay to ensure MongoDB has completed all user creation writes
  // This addresses race conditions where tests start before users are fully indexed
  // 5000ms is needed for parallel test execution with heavy database load
  // Note: core-api has 401 retry logic for additional resilience
  await sleep(5000);

  return {
    baseURL,
    backendHost,
    serverPort: cidPort,
    config: {
      connectionString: spawnEnv.SYNGRISI_DB_URI ?? defaultConnectionString,
      defaultImagesPath: spawnEnv.SYNGRISI_IMAGES_PATH ?? defaultImagesPath,
    },
    stop: () => terminateProcess(backend!),
    getBackendLogs: backendLogs,
    getFrontendLogs: () => "",
  };
}

async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  await waitFor(() => isHttpServiceAvailable(url), {
    timeoutMs,
    description: `HTTP service at ${url}`,
  });
}

function isHttpServiceAvailable(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http
      .request(url, { method: 'GET' }, (res) => {
        res.resume();
        resolve(!!res.statusCode && res.statusCode < 500);
      })
      .on("error", () => resolve(false));
    req.end();
  });
}

function isApiKeyAuthWorking(url: string, apiKey: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname,
      method: 'GET',
      headers: {
        'apikey': apiKey,
      },
    };
    const req = http
      .request(options, (res) => {
        res.resume();
        // 200 means auth worked, 401 means it didn't
        resolve(res.statusCode === 200);
      })
      .on("error", () => resolve(false));
    req.end();
  });
}

async function waitForApiKeyAuth(url: string, apiKey: string, timeoutMs: number): Promise<void> {
  await waitFor(() => isApiKeyAuthWorking(url, apiKey), {
    timeoutMs,
    description: `API key authentication at ${url}`,
    intervalMs: 100,
  });
  backendLogger.info(`✓ API key authentication verified at ${url}`);
}

export function isServerRunning(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, '127.0.0.1');
  });
}

function startBackendLogCapture(child: Child): () => string {
  const chunks: string[] = [];
  const record = (data: unknown) => {
    const text = String(data || "");
    if (!text) return;
    chunks.push(text);
    // keep more lines to aid debugging parallel test runs
    if (chunks.length > 1000) chunks.shift();
    backendLogger.info(text.trim());
  };
  child.stdout?.on("data", record);
  child.stderr?.on("data", record);
  return () => chunks.join("");
}

async function terminateProcess(child: Child | undefined): Promise<void> {
  if (!child || child.killed) return;

  child.kill("SIGTERM");
  const exit = once(child, "exit");

  await Promise.race([
    exit,
    sleep(5000).then(() => !child.killed && child.kill("SIGKILL")),
  ]);

  await exit.catch(() => undefined);
}

export function stopServerProcess(): void {
  const { execSync } = require('child_process');
  const cid = getCid();

  try {
    if (env.DOCKER === '1') {
      execSync('docker-compose stop || true', { stdio: 'ignore' });
    } else {
      execSync(`pkill -SIGINT -f "syngrisi_test_server_${cid}" || true`, { stdio: 'ignore' });
    }
  } catch (e) {
    // Ignore errors
  }
}

export function stopAllServers(): void {
  const { execSync } = require('child_process');
  try {
    if (env.DOCKER === '1') {
      execSync('docker-compose stop || true', { stdio: 'ignore' });
    } else {
      execSync(`pkill -SIGINT -f "syngrisi_test_server_" || true`, { stdio: 'ignore' });
    }
  } catch (e) {
    // Ignore errors
  }
}

export async function findAvailablePort(preferred: number, maxAttempts = 10): Promise<number> {
  let port = preferred;
  for (let i = 0; i < maxAttempts; i++) {
    const free = !(await isServerRunning(port));
    if (free) return port;
    port += 1;
  }
  throw new Error(`No available port found starting from ${preferred} within ${maxAttempts} attempts`);
}
