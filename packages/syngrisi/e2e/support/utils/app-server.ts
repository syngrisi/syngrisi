import path from "path";
import { spawn } from "child_process";
import { once } from "events";
import http from "http";
import { env } from '@config';
import { sleep, waitFor } from "@utils/common";
import { resolveRepoRoot, ensurePathExists } from "@utils/fs";
import { createLogger } from "@lib/logger";

const REPO_ROOT = resolveRepoRoot();

const backendLogger = createLogger('backend', { fileLevel: 'debug', consoleLevel: 'error' });

type Child = ReturnType<typeof spawn>;

export interface RunningAppServer {
  baseURL: string;
  backendHost: string;
  serverPort: number;
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
  return parseInt(process.env.TEST_PARALLEL_INDEX || '0', 10);
}

export async function launchAppServer(
  options: LaunchAppServerOptions = {},
): Promise<RunningAppServer> {
  const { env: additionalEnv, cid: providedCid } = options;
  const cid = providedCid ?? getCid();

  const databaseName = 'SyngrisiDbTest';
  const cmdPath = path.resolve(REPO_ROOT);
  const cidPort = 3002 + cid;
  const runtimeEnv = process.env;
  const dockerMode = runtimeEnv.DOCKER ?? env.DOCKER;
  const backendHost = runtimeEnv.E2E_BACKEND_HOST ?? env.E2E_BACKEND_HOST;
  const baseURL = `http://${backendHost}:${cidPort}`;

  const serverScriptPath = path.join(cmdPath, 'dist', 'server', 'server.js');
  await ensurePathExists(serverScriptPath, "file");

  const disableFirstRun = runtimeEnv.SYNGRISI_DISABLE_FIRST_RUN ?? env.SYNGRISI_DISABLE_FIRST_RUN ?? 'true';
  const authEnabled = runtimeEnv.SYNGRISI_AUTH ?? env.SYNGRISI_AUTH ?? 'false';
  const coverageFlag = runtimeEnv.SYNGRISI_COVERAGE ?? env.SYNGRISI_COVERAGE ?? 'false';

  const nodeEnv = (additionalEnv?.NODE_ENV || runtimeEnv.NODE_ENV || 'test') as string;

  const spawnEnv: Record<string, string> = {
    ...runtimeEnv,
    NODE_ENV: nodeEnv,
    SYNGRISI_DISABLE_FIRST_RUN: disableFirstRun,
    SYNGRISI_AUTH: authEnabled,
    SYNGRISI_APP_PORT: String(cidPort),
    SYNGRISI_COVERAGE: coverageFlag === 'true' ? 'true' : 'false',
    ...additionalEnv,
  };

  if (dockerMode !== '1') {
    spawnEnv.SYNGRISI_DB_URI =
      runtimeEnv.SYNGRISI_DB_URI ||
      env.SYNGRISI_DB_URI ||
      `mongodb://localhost/${databaseName}${cid}`;
    spawnEnv.SYNGRISI_IMAGES_PATH =
      runtimeEnv.SYNGRISI_IMAGES_PATH ||
      env.SYNGRISI_IMAGES_PATH ||
      path.resolve(REPO_ROOT, 'baselinesTest', String(cid));
  }

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

  const backend = spawn(command, args, {
    cwd: cmdPath,
    env: spawnEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const backendLogs = startBackendLogCapture(backend);

  await Promise.race([
    waitForHttp(`${baseURL}/v1/app/info`, 120_000),
    once(backend, "exit").then(([code, signal]) => {
      throw new Error(
        `Backend exited early (code=${code} signal=${signal}).\n${backendLogs()}`,
      );
    }),
  ]);

  return {
    baseURL,
    backendHost,
    serverPort: cidPort,
    stop: () => terminateProcess(backend),
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

function startBackendLogCapture(child: Child): () => string {
  const chunks: string[] = [];
  const record = (data: unknown) => {
    const text = String(data || "");
    if (!text) return;
    chunks.push(text);
    if (chunks.length > 200) chunks.shift();
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
