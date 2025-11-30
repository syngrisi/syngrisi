import fs from 'node:fs/promises';
import path from 'node:path';
import type { ChildProcess } from 'node:child_process';
import process from 'node:process';
import type { Readable, Writable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolResultSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { DEFAULT_PORT } from './config';
import {
  ensurePortFree,
  findAvailablePort,
  waitForHttpAvailability,
} from './utils/port-utils';
import { spawnMcpServer } from './utils/server-spawn';
import { shutdownChildProcess } from './utils/process-shutdown';
import { createErrorResponse, createSuccessResponse } from './utils/responseHelpers';
import { isShutdownNotification, SHUTDOWN_NOTIFICATION_METHOD, formatError } from './utils/common';
// Using relative path instead of @logger alias to allow bridge-cli.ts to run from any directory
// without requiring tsconfig.json path resolution (fixes "Cannot find module '@logger'" errors)
import { bridgeLogger } from './utils/logger';
import { startNewSession } from './utils/stepLogger';
import { BootstrapHandler } from './utils/bootstrap-handler';
import { ProxiedHandler } from './utils/proxied-handler';

const portsLogDir = path.resolve(__dirname, 'logs', 'ports');
type RecordedPortInfo = {
  port: number;
  recordedAt?: string;
  scenario?: {
    title?: string | null;
    titlePath?: string[] | null;
    featurePath?: string | null;
    featureUri?: string | null;
  } | null;
};

interface BridgeOptions {
  preferredPort?: number;
  input: Readable;
  output: Writable;
  logPrefix?: string;
}

type RunBridgeOptions = Partial<Pick<BridgeOptions, 'preferredPort' | 'input' | 'output' | 'logPrefix'>>;

export class SdioSseBridge {
  private readonly options: BridgeOptions;
  private readonly input: Readable;
  private readonly output: Writable;
  private readonly logPrefix: string;

  private child: ChildProcess | null = null;
  private client: Client | null = null;
  private stdioServer: Server | null = null;
  private transport: StreamableHTTPClientTransport | null = null;
  private stdioTransport: StdioServerTransport | null = null;

  private port: number | null = null;

  private closed = false;
  private remoteShutdownNotified = false;
  private childExitExpected = false;
  private suppressCloseHandling = false;

  private readonly closingPromise: Promise<void>;
  private closingResolve!: () => void;
  private closingReject!: (error: Error) => void;

  private bootstrapHandler: BootstrapHandler | null = null;
  private proxiedHandler: ProxiedHandler | null = null;

  constructor(options: BridgeOptions) {
    this.options = options;
    this.input = options.input;
    this.output = options.output;
    this.logPrefix = options.logPrefix ?? '[bridge]';

    this.closingPromise = new Promise<void>((resolve, reject) => {
      this.closingResolve = resolve;
      this.closingReject = reject;
    });
  }

  async run(): Promise<void> {
    try {
      // Bootstrap: start STDIO server exposing only session_start_new, without spawning remote SSE
      await this.startBootstrapServer();
      this.attachLifecycleHandlers();

      await this.closingPromise;
    } catch (rawError) {
      const error = rawError instanceof Error ? rawError : new Error(String(rawError));
      if (!this.closed) {
        await this.stop(error);
      }
      throw error;
    } finally {
      await this.cleanupResources();
    }
  }

  private log(message: string, level: 'info' | 'error' = 'info') {
    const fullMessage = `${this.logPrefix} ${message}`;
    // Log to file only (bridgeLogger is file-only to avoid stdout interference with JSON-RPC)
    if (level === 'error') {
      bridgeLogger.error(fullMessage);
    } else {
      bridgeLogger.info(fullMessage);
    }
  }

  private attachLifecycleHandlers() {
    this.input.on('end', this.handleInputEnd);
    this.input.on('error', this.handleInputError);

    process.on('SIGINT', this.handleSignal);
    process.on('SIGTERM', this.handleSignal);
  }

  private detachLifecycleHandlers() {
    this.input.off('end', this.handleInputEnd);
    this.input.off('error', this.handleInputError);

    process.off('SIGINT', this.handleSignal);
    process.off('SIGTERM', this.handleSignal);
  }

  private readonly handleSignal = (signal: NodeJS.Signals) => {
    this.log(`Received signal ${signal}; stopping bridge`);
    void this.stop();
  };

  private readonly handleInputEnd = () => {
    this.log('STDIN ended; stopping bridge');
    void this.stop();
  };

  private readonly handleInputError = (error: Error) => {
    this.log(`STDIN error: ${formatError(error)}`, 'error');
    void this.stop(error);
  };

  private handleTransportClosed(context: string) {
    if (this.closed) {
      return;
    }
    if (context.startsWith('STDIO')) {
      this.log(`${context} closed; shutting down`);
      void this.stop();
      return;
    }
    if (this.suppressCloseHandling) {
      this.log(`${context} closed (expected)`);
      return;
    }
    this.log(`${context} closed unexpectedly; resetting bridge`);
    void this.resetToBootstrap(`${context} closed unexpectedly`);
  }

  private handleTransportError(context: string, cause: unknown) {
    const error = cause instanceof Error ? cause : new Error(String(cause));
    if (this.closed) {
      return;
    }
    if (context.startsWith('STDIO')) {
      this.log(`${context} error: ${formatError(error)}`, 'error');
      void this.stop(error);
      return;
    }
    if (this.suppressCloseHandling) {
      this.log(`${context} error (expected during shutdown): ${formatError(error)}`);
      return;
    }
    this.log(`${context} error: ${formatError(error)}`, 'error');
    void this.resetToBootstrap(`${context} error: ${formatError(error)}`);
  }

  private async resetToBootstrap(reason: string) {
    if (this.closed) {
      return;
    }
    this.log(`Resetting bridge state: ${reason}`);
    await this.closeRemoteConnections();
    this.port = null;
    this.remoteShutdownNotified = false;
    this.childExitExpected = false;
    if (this.stdioServer) {
      this.installBootstrapHandlers();
    }
  }

  private async closeRemoteConnections() {
    if (!this.client && !this.transport) {
      return;
    }
    this.suppressCloseHandling = true;
    try {
      if (this.client) {
        const client = this.client;
        this.client = null;
        try {
          await client.close();
        } catch (error) {
          this.log(`Error while closing MCP client: ${formatError(error)}`, 'error');
        }
      }
      if (this.transport) {
        const transport = this.transport;
        this.transport = null;
        try {
          await transport.terminateSession();
        } catch {
          // ignore termination failures
        }
        try {
          await transport.close();
        } catch (error) {
          this.log(`Error while closing HTTP transport: ${formatError(error)}`, 'error');
        }
      }
    } finally {
      this.suppressCloseHandling = false;
    }
  }

  private async readLatestDebugPort(): Promise<RecordedPortInfo> {
    let entries;
    try {
      entries = await fs.readdir(portsLogDir, { withFileTypes: true });
    } catch (error) {
      throw new Error(`Unable to read ports log directory at ${portsLogDir}: ${formatError(error)}`);
    }

    const portFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.port'));
    if (portFiles.length === 0) {
      throw new Error(`No port log files found in ${portsLogDir}`);
    }

    portFiles.sort((a, b) => {
      const aTimestamp = Number.parseInt(a.name.replace(/\.port$/u, ''), 10);
      const bTimestamp = Number.parseInt(b.name.replace(/\.port$/u, ''), 10);
      return aTimestamp - bTimestamp;
    });

    const latestFile = portFiles[portFiles.length - 1];
    const filePath = path.join(portsLogDir, latestFile.name);
    const rawContent = (await fs.readFile(filePath, 'utf8')).trim();

    if (!rawContent) {
      throw new Error(`Port log ${filePath} is empty`);
    }

    const parseLegacy = (): RecordedPortInfo | null => {
      const port = Number.parseInt(rawContent, 10);
      if (Number.isFinite(port)) {
        return { port };
      }
      return null;
    };

    const legacy = parseLegacy();
    if (legacy) {
      return legacy;
    }

    try {
      const parsed = JSON.parse(rawContent) as RecordedPortInfo;
      if (!parsed || typeof parsed !== 'object' || !Number.isFinite(parsed.port)) {
        throw new Error('Missing numeric port');
      }
      return parsed;
    } catch (error) {
      throw new Error(`Invalid port record in ${filePath}: ${formatError(error)}`);
    }
  }

  private async startBootstrapServer() {
    this.log('🚀 Starting bootstrap server initialization...');
    const stdioServer = new Server(
      { name: 'zenflow-mcp-bridge', version: '0.0.0' },
      {
        capabilities: {
          tools: {},
        },
      },
    );
    this.stdioServer = stdioServer;
    stdioServer.onclose = () => this.handleTransportClosed('STDIO server');
    stdioServer.onerror = (error: Error) => this.handleTransportError('STDIO server', error);

    const stdioTransport = new StdioServerTransport(this.input, this.output);
    this.stdioTransport = stdioTransport;
    stdioTransport.onclose = () => this.handleTransportClosed('STDIO transport');
    stdioTransport.onerror = (error: Error) => this.handleTransportError('STDIO transport', error);

    this.log('📡 Connecting STDIO transport to server...');
    await stdioServer.connect(stdioTransport);
    this.log('✅ STDIO transport connected successfully');

    // Bootstrap handlers: only list tools with session_start_new and handle it
    this.log('🔧 Installing bootstrap handlers...');
    this.installBootstrapHandlers();

    this.log('✅ Bridge bootstrap ready: waiting for session_start_new');
  }

  private async handleSessionStartNew(toolArgs?: Record<string, unknown>) {
    const sessionName = String(toolArgs?.sessionName ?? '').trim();
    if (!sessionName) {
      return CallToolResultSchema.parse(createErrorResponse('Invalid session name: sessionName'));
    }

    const headless = toolArgs?.headless !== false;

    // Initialize new session tracking
    const sessionId = startNewSession(sessionName);
    this.log(`📝 Session tracking initialized: "${sessionName}" (ID: ${sessionId}), headless: ${headless}`);
    bridgeLogger.info(`🎬 NEW SESSION STARTED: "${sessionName}" (ID: ${sessionId}), headless: ${headless}`);

    await this.restartAndConnectRemote(sessionName, { headless });

    // After connecting to the remote HTTP MCP server, start a new session there as well
    try {
      const client = this.client!;
      const result = await client.callTool({
        name: 'session_start_new',
        arguments: { sessionName, headless },
      });
      return CallToolResultSchema.parse(result);
    } catch (error) {
      const message = formatError(error);
      this.log(`Failed to start remote session: ${message}`, 'error');
      return CallToolResultSchema.parse(createErrorResponse(message));
    }
  }

  private async handleAttachExistingSession() {
    this.log('🔌 Connecting to debug MCP server using recorded ports directory...');
    try {
      const portInfo = await this.connectToDebugServer();
      const scenario = portInfo.scenario;
      const scenarioLines = scenario
        ? [
          `Scenario: ${scenario.title ?? 'unknown'}`,
          scenario.featurePath ? `Feature file: ${scenario.featurePath}` : '',
          // scenario.featureUri  ? `Feature URI: ${scenario.featureUri}` : '',
          Array.isArray(scenario.titlePath) && scenario.titlePath.length
            ? `Title path: ${scenario.titlePath.join(' › ')}`
            : '',
        ].filter(Boolean)
        : [];
      const message = [
        `Connected to debug MCP server on port ${portInfo.port}`,
        ...scenarioLines,
      ].join('\n');
      return CallToolResultSchema.parse(
        createSuccessResponse(message),
      );
    } catch (error) {
      const message = formatError(error);
      this.log(`Failed to connect to debug MCP server: ${message}`, 'error');
      return CallToolResultSchema.parse(createErrorResponse(message));
    }
  }

  private installBootstrapHandlers() {
    const server = this.stdioServer!;
    this.bootstrapHandler = new BootstrapHandler({
      server,
      handleSessionStart: (toolArgs) => this.handleSessionStartNew(toolArgs),
      handleAttachExistingSession: () => this.handleAttachExistingSession(),
      onShutdown: () => {
        this.log('Received shutdown notification (bootstrap); initiating stop');
        void this.stop();
      },
    });
    this.bootstrapHandler.activate();
    this.proxiedHandler = null;
  }

  private installProxiedHandlers() {
    const server = this.stdioServer!;
    const client = this.client!;

    this.proxiedHandler = new ProxiedHandler({
      server,
      client,
      handleSessionStart: (toolArgs) => this.handleSessionStartNew(toolArgs),
      handleAttachExistingSession: () => this.handleAttachExistingSession(),
      log: (message) => this.log(message),
      onNotificationForwardError: (error) => this.handleTransportError('Notification forwarding', error),
      onRemoteShutdown: () => {
        this.remoteShutdownNotified = true;
        this.log('Received shutdown notification; initiating stop');
        void this.stop();
      },
    });
    this.proxiedHandler.activate();
  }

  private async restartAndConnectRemote(sessionName: string, options?: { headless?: boolean }) {
    this.log(`🔄 Starting new session: "${sessionName}"...`);
    this.log('🛑 Shutting down existing child processes...');
    await this.shutdownChild({ expected: true });
    await this.closeRemoteConnections();
    this.remoteShutdownNotified = false;

    const startingPort = this.options.preferredPort ?? DEFAULT_PORT;
    await ensurePortFree(startingPort, (msg) => this.log(msg));
    const port = await findAvailablePort(startingPort);
    this.port = port;

    this.log(`Spawning MCP server on port ${port} for session "${sessionName}"`);
    this.log(
      `Bridge env: MCP_IDLE_TIMEOUT_MS=${process.env.MCP_IDLE_TIMEOUT_MS ?? '(unset)'}, MCP_IDLE_CHECK_INTERVAL_MS=${process.env.MCP_IDLE_CHECK_INTERVAL_MS ?? '(unset)'}`
    );

    // Pass idle timeout configuration to spawned server
    const extraEnv: Record<string, string> = {};
    if (process.env.MCP_IDLE_TIMEOUT_MS) {
      extraEnv.MCP_IDLE_TIMEOUT_MS = process.env.MCP_IDLE_TIMEOUT_MS;
      this.log(`Adding to extraEnv: MCP_IDLE_TIMEOUT_MS=${extraEnv.MCP_IDLE_TIMEOUT_MS}`);
    }
    if (process.env.MCP_IDLE_CHECK_INTERVAL_MS) {
      extraEnv.MCP_IDLE_CHECK_INTERVAL_MS = process.env.MCP_IDLE_CHECK_INTERVAL_MS;
      this.log(`Adding to extraEnv: MCP_IDLE_CHECK_INTERVAL_MS=${extraEnv.MCP_IDLE_CHECK_INTERVAL_MS}`);
    }
    // Pass headless mode - check env first, then options, default to true (headless)
    // IMPORTANT: process.env.E2E_HEADLESS might be '0' or '1' or undefined.
    // If it is defined, we should respect it.
    // If it is undefined, we use the option passed to session_start_new.
    // If that is also undefined, we default to '1' (headless).
    let headlessValue = '1';
    if (process.env.E2E_HEADLESS !== undefined) {
      headlessValue = process.env.E2E_HEADLESS;
    } else if (options?.headless !== undefined) {
      headlessValue = options.headless ? '1' : '0';
    }

    extraEnv.E2E_HEADLESS = headlessValue;
    this.log(`Adding to extraEnv: E2E_HEADLESS=${extraEnv.E2E_HEADLESS}`);
    this.log(`extraEnv keys: ${Object.keys(extraEnv).join(', ')}`);

    await this.spawnServerProcess(port, extraEnv);
    await this.connectToRemoteServerAtPort(this.port!);
  }

  async stop(error?: Error) {
    if (this.closed) {
      this.log('⚠️ Bridge already closed, skipping stop');
      return;
    }
    this.closed = true;
    this.log(`🛑 Stopping bridge... ${error ? `(error: ${error.message})` : ''}`);
    this.detachLifecycleHandlers();

    try {
      await this.notifyRemoteShutdown();
    } catch (notifyError) {
      this.log(`Failed to send shutdown to remote server: ${formatError(notifyError)}`, 'error');
    }

    if (error) {
      this.closingReject(error);
    } else {
      this.closingResolve();
    }
  }

  private async notifyRemoteShutdown() {
    const client = this.client;
    if (!client) {
      return;
    }
    if (this.remoteShutdownNotified) {
      return;
    }
    await client.notification({
      method: SHUTDOWN_NOTIFICATION_METHOD,
      params: {},
    });
    this.remoteShutdownNotified = true;
  }

  private async cleanupResources() {
    await this.shutdownProxy();
    await this.shutdownChild();
  }

  private async shutdownProxy() {
    await this.closeRemoteConnections();
    this.suppressCloseHandling = true;
    try {
      const tasks: Array<Promise<void>> = [];

      if (this.stdioServer) {
        const server = this.stdioServer;
        this.stdioServer = null;
        tasks.push(server.close());
      }

      if (this.stdioTransport) {
        const stdioTransport = this.stdioTransport;
        this.stdioTransport = null;
        tasks.push(stdioTransport.close());
      }

      if (tasks.length) {
        const results = await Promise.allSettled(tasks);
        for (const result of results) {
          if (result.status === 'rejected') {
            this.log(`Error while closing transport: ${formatError(result.reason)}`, 'error');
          }
        }
      }
    } finally {
      this.suppressCloseHandling = false;
    }
  }

  private async spawnServerProcess(port: number, extraEnv?: Record<string, string>) {
    this.log('Server process spawning');

    const result = await spawnMcpServer({
      port,
      extraEnv,
      onStdout: (chunk) => {
        const text = chunk.toString();
        this.log(`[server:stdout] ${text}`.trimEnd());
      },
      onStderr: (chunk) => {
        const text = chunk.toString();
        this.log(`[server:stderr] ${text}`.trimEnd());
      },
      onExit: (code, signal) => {
        const reason = code === null
          ? `Playwright server stopped by signal ${signal ?? 'unknown'}`
          : `Playwright server exited with code ${code}`;
        this.log(reason);
        const wasExpected = this.childExitExpected;
        this.childExitExpected = false;
        this.child = null;
        if (this.closed) {
          return;
        }
        if (wasExpected) {
          return;
        }
        void this.resetToBootstrap(reason);
      },
      onError: (error) => {
        this.log(`Server error: ${error.message}`, 'error');
      },
    });

    this.child = result.child;
    this.port = result.port;
    this.childExitExpected = false;
    this.log(`Server listening on port ${this.port}`);
  }

  private async connectToRemoteServerAtPort(port: number) {
    this.port = port;
    this.log(`⏳ Waiting for MCP server availability on port ${port}`);
    await waitForHttpAvailability(port);

    this.log(`📡 Connecting to MCP server at http://localhost:${port}/mcp...`);
    const endpoint = new URL('/mcp', `http://localhost:${port}`);
    const transport = new StreamableHTTPClientTransport(endpoint);
    this.transport = transport;
    transport.onclose = () => this.handleTransportClosed('HTTP transport');
    transport.onerror = (error: Error) => this.handleTransportError('HTTP transport', error);

    const client = new Client(
      { name: 'zenflow-mcp-bridge', version: '0.0.0' },
      { capabilities: {} },
    );
    this.client = client;
    client.onclose = () => this.handleTransportClosed('MCP client');
    client.onerror = (error: Error) => this.handleTransportError('MCP client', error);
    await client.connect(transport);
    this.log('✅ Successfully connected to MCP server');

    this.log('🔄 Switching to proxied mode...');
    this.installProxiedHandlers();
    this.log('✅ Bridge switched to proxied mode and ready for operations');
  }

  private async connectToDebugServer(): Promise<RecordedPortInfo> {
    await this.shutdownChild({ expected: true });
    await this.closeRemoteConnections();
    this.remoteShutdownNotified = false;

    const portInfo = await this.readLatestDebugPort();
    const { port, scenario } = portInfo;
    const scenarioSummary = scenario?.title
      ? ` (scenario: ${scenario.title}${scenario.featurePath ? ` @ ${scenario.featurePath}` : ''})`
      : '';
    this.log(`Connecting to debug MCP server on port ${port}${scenarioSummary}`);
    this.childExitExpected = false;
    this.child = null;

    await this.connectToRemoteServerAtPort(port);
    return portInfo;
  }


  private async shutdownChild(options: { expected?: boolean } = {}) {
    const child = this.child;
    if (!child) {
      this.childExitExpected = false;
      return;
    }

    this.child = null;
    this.childExitExpected = options.expected ?? false;

    await shutdownChildProcess(child, {
      expected: options.expected,
      logFn: (msg) => this.log(msg),
    });

    this.childExitExpected = false;
  }


}

export async function runBridge(options?: RunBridgeOptions) {
  const bridge = new SdioSseBridge({
    input: options?.input ?? process.stdin,
    output: options?.output ?? process.stdout,
    logPrefix: options?.logPrefix ?? '[bridge]',
    preferredPort: options?.preferredPort,
  });
  await bridge.run();
}
