import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { Writable } from 'node:stream';
import type { Readable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { e2eRoot, mcpRoot } from './config';
import { resolveAgentIdentity, type ResolvedAgentIdentity, isProcessAlive } from './test-engine-agent-resolver';
import {
  appendSessionEvent,
  cleanupSessionStates,
  getTestEngineEventLogPath,
  getAllSessionStates,
  patchSessionState,
  getTestEngineStatePath,
  readSessionState,
  removeSessionState,
  removeSessionStateIfOwned,
  updateSessionActivity,
  waitForSessionStateReady,
  writeSessionState,
  type TestEngineSessionHealth,
  type TestEngineSessionState,
} from './test-engine-state';
import { simpleTokenSearch } from './utils/simpleTokenSearch';
import type { StepExecutorParams } from './utils/stepExecutor';
import type { Data } from './utils/types';
import { getStepDefinitions } from './utils/stepDefinitions';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_ENTRY = path.join(mcpRoot, 'bridge-cli.ts');
const TSX_DIST_ROOT = path.join(e2eRoot, 'node_modules', 'tsx', 'dist');
const TSX_PREFLIGHT = path.join(TSX_DIST_ROOT, 'preflight.cjs');
const TSX_LOADER = `file://${path.join(TSX_DIST_ROOT, 'loader.mjs')}`;
const LOCALHOST = '127.0.0.1';
const DAEMON_START_TIMEOUT_MS = 120_000;
const DAEMON_REQUEST_TIMEOUT_MS = 180_000;

const HELP_TEXT = [
  'Syngrisi MCP Test Engine CLI',
  '',
  'Usage:',
  '  npx tsx support/mcp/test-engine-cli.ts help',
  '  npx tsx support/mcp/test-engine-cli.ts start demo --headed [--system-thread <id>]',
  '  npx tsx support/mcp/test-engine-cli.ts step "I test" [--system-thread <id>]',
  '  npx tsx support/mcp/test-engine-cli.ts batch "I test" "I get current URL" [--system-thread <id>]',
  '  npx tsx support/mcp/test-engine-cli.ts status [--system-thread <id>]',
  '  npx tsx support/mcp/test-engine-cli.ts shutdown [--system-thread <id>]',
  '',
  'Commands:',
  '  help',
  '  start <sessionName> [--headed]',
  '  attach',
  '  status',
  '  resolve',
  '  tools',
  '  step <stepText> [--docstring <text>] [--docstring-json <json>] [--docstring-base64 <base64>]',
  '  step-json <json>',
  '  batch <step1> <step2> [step3 ...]',
  '  batch-json <json>',
  '  restart [sessionName] [--headed]',
  '  steps find <query>',
  '  clear',
  '  shutdown',
  '',
  'Global options:',
  '  --system-thread <id>  Override SYSTEM_THREAD / PID heuristic lookup.',
  '  --json                Print machine-readable JSON.',
  '',
  'Rules of thumb:',
  '  - Use start once; every next CLI call reuses the same session via local state.',
  '  - Use step for single actions and diagnostics.',
  '  - Use batch only for 2 or more sequential steps.',
  '  - Use attach to connect the daemon to an existing debug MCP session.',
  '  - Use shutdown only when you explicitly want to close the session.',
].join('\n');

const TOOL_TIMEOUTS = {
  listTools: 120_000,
  startSession: 120_000,
  execute: 180_000,
} as const;

type CommandExecutionResult = {
  ok: boolean;
  shouldExit: boolean;
};

type ParsedCliArgs = {
  commands: string[];
  showHelp: boolean;
  daemonServer: boolean;
  daemonAttach: boolean;
  daemonHeaded: boolean;
  statusFile: string | null;
  agentId: string | null;
  jsonOutput: boolean;
};

type TestEngineCliOptions = {
  stdin?: Readable;
  stdout?: Writable;
  stderr?: Writable;
};

type DaemonCommandResponse = {
  ok: boolean;
  shouldExit: boolean;
  stdout: string;
  stderr: string;
  state?: TestEngineSessionState | null;
};

type DaemonStatusResponse = {
  ok: boolean;
  state: TestEngineSessionState | null;
};

type DaemonCommandTaskResult = {
  result: CommandExecutionResult;
  stdout: string;
  stderr: string;
};

type JsonCommandPayload = {
  ok: boolean;
  command: string;
  systemThread?: string | null;
  health?: TestEngineSessionHealth;
  reused?: boolean;
  stdout?: string;
  stderr?: string;
  state?: TestEngineSessionState | null;
  artifacts?: string[];
  eventLogFile?: string;
};

class BufferingWritable extends Writable {
  private readonly chunks: string[] = [];

  override _write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    this.chunks.push(typeof chunk === 'string' ? chunk : chunk.toString('utf8'));
    callback();
  }

  clear() {
    this.chunks.length = 0;
  }

  readText(): string {
    return this.chunks.join('');
  }
}

const writeLine = (stream: Writable, message: string = '') => {
  stream.write(`${message}\n`);
};

const readDocstringFile = async (filePath: string): Promise<string> => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  return fs.readFile(absolutePath, 'utf8');
};

const extractContentText = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const content = (payload as { content?: unknown }).content;
  if (!Array.isArray(content) || content.length === 0) {
    return '';
  }

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== 'object' || !('text' in firstBlock)) {
    return '';
  }

  return String((firstBlock as { text: unknown }).text ?? '');
};

const tokenizeCommand = (line: string): string[] => {
  const tokens: string[] = [];
  let current = '';
  let quote: 'single' | 'double' | null = null;
  let escaped = false;

  for (const char of line.trim()) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\' && quote !== 'single') {
      escaped = true;
      continue;
    }

    if (quote) {
      if ((quote === 'single' && char === '\'') || (quote === 'double' && char === '"')) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '\'') {
      quote = 'single';
      continue;
    }

    if (char === '"') {
      quote = 'double';
      continue;
    }

    if (/\s/u.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (escaped) {
    throw new Error('Command ended with an unfinished escape sequence.');
  }

  if (quote) {
    throw new Error('Command contains an unterminated quote.');
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
};

const quoteCommandToken = (value: string): string => {
  if (!/[\s"]/u.test(value)) {
    return value;
  }
  return `"${value.replace(/\\/gu, '\\\\').replace(/"/gu, '\\"')}"`;
};

const parseCommandLine = (line: string): string[] => {
  const trimmed = line.trim();
  if (trimmed.startsWith('step-json ')) {
    return ['step-json', trimmed.slice('step-json '.length)];
  }
  if (trimmed.startsWith('batch-json ')) {
    return ['batch-json', trimmed.slice('batch-json '.length)];
  }
  return tokenizeCommand(trimmed);
};

const parseCliArgs = (argv: string[]): ParsedCliArgs => {
  const commands: string[] = [];
  let showHelp = false;
  let daemonServer = false;
  let daemonAttach = false;
  let daemonHeaded = false;
  let statusFile: string | null = null;
  let agentId: string | null = null;
  let jsonOutput = false;
  const passthroughTokens: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--help' || token === '-h') {
      showHelp = true;
      continue;
    }

    if (token === '--daemon-server') {
      daemonServer = true;
      continue;
    }

    if (token === '--json') {
      jsonOutput = true;
      continue;
    }

    if (token === '--daemon-attach') {
      daemonAttach = true;
      continue;
    }

    if (token === '--status-file') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value after --status-file.');
      }
      statusFile = value;
      index += 1;
      continue;
    }

    if (token === '--system-thread') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value after --system-thread.');
      }
      agentId = value;
      index += 1;
      continue;
    }

    if (token === '--command') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value after --command.');
      }
      commands.push(value);
      index += 1;
      continue;
    }

    if (daemonServer && token === '--headed') {
      daemonHeaded = true;
      continue;
    }

    passthroughTokens.push(token);
  }

  if (passthroughTokens.length > 0) {
    commands.push(passthroughTokens.map((token) => quoteCommandToken(token)).join(' '));
  }

  return {
    commands,
    showHelp,
    daemonServer,
    daemonAttach,
    daemonHeaded,
    statusFile,
    agentId,
    jsonOutput,
  };
};

const parseStructuredJson = (raw: string): unknown => {
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed === 'string') {
    const trimmed = parsed.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return JSON.parse(trimmed) as unknown;
    }
  }
  return parsed;
};

const parseStepJsonInput = (raw: string): StepExecutorParams => {
  const parsed = parseStructuredJson(raw) as string | StepExecutorParams;
  if (typeof parsed === 'string') {
    return { stepText: parsed };
  }

  if (!parsed || typeof parsed !== 'object' || typeof parsed.stepText !== 'string') {
    throw new Error('step-json expects a JSON string or object with a string stepText field.');
  }

  return {
    stepText: parsed.stepText,
    ...(parsed.stepDocstring !== undefined ? { stepDocstring: parsed.stepDocstring } : {}),
  };
};

const parseBatchJsonInput = (raw: string): StepExecutorParams[] => {
  const parsed = parseStructuredJson(raw) as Array<string | StepExecutorParams>;
  if (!Array.isArray(parsed) || parsed.length < 2) {
    throw new Error('batch-json expects a JSON array with at least 2 items.');
  }

  return parsed.map((item, index) => {
    if (typeof item === 'string') {
      return { stepText: item };
    }

    if (!item || typeof item !== 'object' || typeof item.stepText !== 'string') {
      throw new Error(`batch-json item at index ${index} must be a string or object with a string stepText field.`);
    }

    return {
      stepText: item.stepText,
      ...(item.stepDocstring !== undefined ? { stepDocstring: item.stepDocstring } : {}),
    };
  });
};

const formatStepSearchResults = (query: string, data: Data): string => {
  const results = simpleTokenSearch(data, query).slice(0, 20);
  if (results.length === 0) {
    return `No step definitions found for query: "${query}"`;
  }

  const lines = results.map((result, index) => {
    const lineSuffix = result.line ? `:${result.line}` : '';
    const matchedTokens = result.matchedTokens.length > 0
      ? ` [matched: ${result.matchedTokens.join(', ')}]`
      : '';
    return `${index + 1}. ${result.pattern}\n   file: ${result.file}${lineSuffix}\n   score: ${result.score.toFixed(2)}${matchedTokens}\n   description: ${result.description}`;
  });

  return `Found ${results.length} matching step definitions for "${query}":\n${lines.join('\n')}`;
};

const loadLiveStepDefinitions = (): Data => {
  const raw = getStepDefinitions();
  return JSON.parse(raw) as Data;
};

const parseGlobalAgentId = (tokens: string[]): { tokens: string[]; agentId: string | null } => {
  const stripped: string[] = [];
  let agentId: string | null = null;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--system-thread') {
      const value = tokens[index + 1];
      if (!value) {
        throw new Error('Missing value after --system-thread.');
      }
      agentId = value;
      index += 1;
      continue;
    }
    stripped.push(token);
  }

  return { tokens: stripped, agentId };
};

const validateCommandUsage = (command: string, args: string[]) => {
  if (command === 'batch' && args.length < 2) {
    throw new Error('batch requires at least 2 steps.');
  }
  if (command === 'step-json' && args.length !== 1) {
    throw new Error('step-json expects exactly 1 JSON argument.');
  }
  if (command === 'batch-json' && args.length !== 1) {
    throw new Error('batch-json expects exactly 1 JSON argument.');
  }
};

const parseSessionMetadata = (stdout: string): Pick<TestEngineSessionState, 'sessionId' | 'logFile'> => {
  const sessionIdMatch = stdout.match(/with ID ([^\s.]+)/u);
  const logFileMatch = stdout.match(/Logs at ([^\s]+\.jsonl)/u);
  return {
    ...(sessionIdMatch?.[1] ? { sessionId: sessionIdMatch[1] } : {}),
    ...(logFileMatch?.[1] ? { logFile: logFileMatch[1] } : {}),
  };
};

const stripLeadingSuccessLine = (stdout: string): string => {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.replace(/^Status:\s+Success\s*/u, '').trim();
};

const normalizeStartupDetails = (stdout: string): string => {
  const stripped = stripLeadingSuccessLine(stdout);
  if (!stripped) {
    return '';
  }

  const [summary] = stripped.split(/\nAvailable test steps\b/iu, 1);
  return (summary ?? '').trim();
};

const formatResolvedIdentity = (identity: ResolvedAgentIdentity): string[] => {
  const lines = [
    `System thread: ${identity.agentId}`,
    `Resolved via: ${identity.source}`,
  ];
  if (identity.warning) {
    lines.push(`Warning: ${identity.warning}`);
  }
  return lines;
};

const makeCommandId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const extractArtifacts = (text: string): string[] => {
  const matches = text.match(/\/Users\/[^\s"]+\.(?:png|jsonl|log|yml|yaml|json)/gu) ?? [];
  return [...new Set(matches)];
};

const shouldMarkBrokenFromText = (text: string): boolean => (
  text.includes('Session not started') ||
  text.includes('Request timed out') ||
  text.includes('Connection closed') ||
  text.includes('Failed to reach session daemon') ||
  text.includes('MCP error -32001') ||
  text.includes('Session daemon for agent')
);

const getHealthLabel = (state: TestEngineSessionState): string => {
  if (state.health) {
    return state.health;
  }
  if (state.initializing) {
    return 'initializing';
  }
  return 'ready';
};

const sanitizeToolList = (tools: Array<{ name: string; description?: string }>): string[] => (
  tools.map(({ name, description }) => `${name}${description ? ` - ${description}` : ''}`)
);

const fallbackToolList = (): string[] => [
  'session_start_new - Starts a new MCP browser session.',
  'sessions_clear - Clears existing Playwright browser contexts/pages.',
  'step_execute_single - Executes a single BDD step.',
  'step_execute_many - Executes multiple BDD steps in sequence.',
  'attach_existing_session - Attaches to an existing debug MCP session.',
];

const formatStableToolList = (): string => fallbackToolList().join('\n');

const writeJson = (stream: Writable, payload: JsonCommandPayload) => {
  stream.write(`${JSON.stringify(payload, null, 2)}\n`);
};

const fetchJson = async <T>(
  url: string,
  options: {
    method?: 'GET' | 'POST';
    body?: unknown;
    timeoutMs?: number;
  } = {},
): Promise<T> => {
  const timeoutMs = options.timeoutMs ?? DAEMON_REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method ?? 'GET',
        headers: options.body !== undefined ? { 'content-type': 'application/json' } : undefined,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Daemon request timed out after ${timeoutMs}ms: ${url}`);
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to reach session daemon at ${url}: ${message}`);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Daemon request failed: HTTP ${response.status}${text ? ` - ${text}` : ''}`);
    }

    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
};

const isStateReachable = async (state: TestEngineSessionState): Promise<boolean> => {
  if (!(await isProcessAlive(state.daemonPid))) {
    return false;
  }

  try {
    const response = await fetchJson<DaemonStatusResponse>(
      `http://${LOCALHOST}:${state.daemonPort}/status`,
      { timeoutMs: 3000 },
    );
    return Boolean(response.ok);
  } catch {
    return false;
  }
};

class TestEngineCliRuntime {
  private readonly stdin: Readable;
  private readonly stdout: Writable;
  private readonly stderr: Writable;
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private bridgeStderr = '';

  constructor(options: TestEngineCliOptions, runtimeOptions: { keepBridgeAlive?: boolean } = {}) {
    this.stdin = options.stdin ?? process.stdin;
    this.stdout = options.stdout ?? process.stdout;
    this.stderr = options.stderr ?? process.stderr;
    this.keepBridgeAlive = runtimeOptions.keepBridgeAlive ?? false;
  }

  private readonly keepBridgeAlive: boolean;

  async close(): Promise<void> {
    const transport = this.transport;
    const client = this.client;

    this.transport = null;
    this.client = null;

    await Promise.allSettled([
      (async () => {
        if (client) {
          await client.close().catch(() => undefined);
        }
      })(),
      (async () => {
        if (transport) {
          await transport.close().catch(() => undefined);
        }
      })(),
    ]);
  }

  private async ensureConnected(): Promise<Client> {
    if (this.client) {
      return this.client;
    }

    const transport = new StdioClientTransport({
      command: NPX_BIN,
      args: ['tsx', BRIDGE_ENTRY],
      cwd: e2eRoot,
      env: {
        ...(process.env as Record<string, string>),
        ...(this.keepBridgeAlive ? { MCP_BRIDGE_IGNORE_STDIN_END: '1' } : {}),
      },
      stderr: 'pipe',
    });

    const stderrStream = transport.stderr as Readable | undefined;
    stderrStream?.setEncoding('utf8');
    stderrStream?.on('data', (chunk: string | Buffer) => {
      this.bridgeStderr += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
    });

    const client = new Client(
      { name: 'syngrisi-mcp-test-engine-cli', version: '0.0.0' },
      { capabilities: {} },
    );

    await client.connect(transport);
    this.transport = transport;
    this.client = client;
    return client;
  }

  private printSuccess(message: string) {
    writeLine(this.stdout, message);
  }

  private printError(message: string) {
    writeLine(this.stderr, message);
  }

  private async printToolResult(result: unknown): Promise<boolean> {
    const text = extractContentText(result);
    const isError = Boolean(result && typeof result === 'object' && 'isError' in result && (result as { isError?: boolean }).isError);

    if (text) {
      if (isError) {
        this.printError(text);
      } else {
        this.printSuccess(text);
      }
      return !isError;
    }

    const serialized = JSON.stringify(result, null, 2);
    if (isError) {
      this.printError(serialized);
    } else {
      this.printSuccess(serialized);
    }
    return !isError;
  }

  private async runStart(args: string[]): Promise<boolean> {
    let headed = false;
    const sessionNameTokens: string[] = [];

    for (const token of args) {
      if (token === '--headed') {
        headed = true;
        continue;
      }
      sessionNameTokens.push(token);
    }

    const sessionName = sessionNameTokens.join(' ').trim();
    if (!sessionName) {
      throw new Error('start requires a session name.');
    }

    const client = await this.ensureConnected();
    const startSession = async () => client.callTool(
      {
        name: 'session_start_new',
        arguments: {
          sessionName,
          headless: !headed,
        },
      },
      undefined,
      { timeout: TOOL_TIMEOUTS.startSession },
    );

    let result: Awaited<ReturnType<typeof startSession>> | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await client.callTool({ name: 'sessions_clear', arguments: {} }, undefined, { timeout: TOOL_TIMEOUTS.execute });
      result = await startSession();

      const text = extractContentText(result);
      const isError = Boolean(result && typeof result === 'object' && 'isError' in result && (result as { isError?: boolean }).isError);
      const transient = isError && (
        text.includes('ERR_CONNECTION_REFUSED') ||
        text.includes('Request timed out') ||
        text.includes('Connection closed')
      );

      if (!transient || attempt === 3) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!result) {
      throw new Error('Failed to start MCP session: no result returned.');
    }

    const started = await this.printToolResult(result);
    if (!started) {
      return false;
    }

    const smokeCommands: StepExecutorParams[] = [
      { stepText: 'I test' },
      { stepText: 'I get current URL' },
    ];

    for (const smokeCommand of smokeCommands) {
      const smokeOk = await this.executeStructuredStep(smokeCommand);
      if (smokeOk) {
        return true;
      }
    }

    return false;
  }

  private async runAttach(): Promise<boolean> {
    const client = await this.ensureConnected();
    const result = await client.callTool(
      { name: 'attach_existing_session', arguments: {} },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );
    return this.printToolResult(result);
  }

  private async runTools(): Promise<boolean> {
    const client = await this.ensureConnected();
    let lines: string[];
    try {
      const tools = await client.listTools(undefined, { timeout: TOOL_TIMEOUTS.listTools });
      lines = sanitizeToolList(tools.tools);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('inputSchema') || !message.includes('expected "object"')) {
        throw error;
      }
      lines = fallbackToolList();
    }
    this.printSuccess(lines.join('\n'));
    return true;
  }

  private async runStep(args: string[]): Promise<boolean> {
    const stepTokens: string[] = [];
    let stepDocstring: unknown;

    for (let index = 0; index < args.length; index += 1) {
      const token = args[index];
      if (token === '--docstring') {
        const value = args[index + 1];
        if (value === undefined) {
          throw new Error('Missing value after --docstring.');
        }
        stepDocstring = value;
        index += 1;
        continue;
      }

      if (token === '--docstring-json') {
        const value = args[index + 1];
        if (value === undefined) {
          throw new Error('Missing value after --docstring-json.');
        }
        stepDocstring = JSON.parse(value);
        index += 1;
        continue;
      }

      if (token === '--docstring-base64') {
        const value = args[index + 1];
        if (value === undefined) {
          throw new Error('Missing value after --docstring-base64.');
        }
        stepDocstring = Buffer.from(value, 'base64').toString('utf8');
        index += 1;
        continue;
      }

      if (token === '--docstring-file') {
        const value = args[index + 1];
        if (value === undefined) {
          throw new Error('Missing value after --docstring-file.');
        }
        stepDocstring = await readDocstringFile(value);
        index += 1;
        continue;
      }

      stepTokens.push(token);
    }

    const stepText = stepTokens.join(' ').trim();
    if (!stepText) {
      throw new Error('step requires a step text.');
    }

    const client = await this.ensureConnected();
    const argumentsPayload: Record<string, unknown> = { stepText };
    if (stepDocstring !== undefined) {
      argumentsPayload.stepDocstring = stepDocstring;
    }

    const result = await client.callTool(
      { name: 'step_execute_single', arguments: argumentsPayload },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );

    return this.printToolResult(result);
  }

  private async runStepJson(args: string[]): Promise<boolean> {
    if (args.length !== 1) {
      throw new Error('step-json expects exactly 1 JSON argument.');
    }
    return this.executeStructuredStep(parseStepJsonInput(args[0]));
  }

  private async runBatch(args: string[]): Promise<boolean> {
    if (args.length < 2) {
      throw new Error('batch requires at least 2 steps.');
    }

    const client = await this.ensureConnected();
    const result = await client.callTool(
      { name: 'step_execute_many', arguments: { steps: args } },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );

    return this.printToolResult(result);
  }

  private async runBatchJson(args: string[]): Promise<boolean> {
    if (args.length !== 1) {
      throw new Error('batch-json expects exactly 1 JSON argument.');
    }

    const steps = parseBatchJsonInput(args[0]);
    const client = await this.ensureConnected();
    const result = await client.callTool(
      { name: 'step_execute_many', arguments: { steps } },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );

    return this.printToolResult(result);
  }

  private async executeStructuredStep(step: StepExecutorParams): Promise<boolean> {
    const client = await this.ensureConnected();
    const argumentsPayload: Record<string, unknown> = { stepText: step.stepText };
    if (step.stepDocstring !== undefined) {
      argumentsPayload.stepDocstring = step.stepDocstring;
    }

    const result = await client.callTool(
      { name: 'step_execute_single', arguments: argumentsPayload },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );
    return this.printToolResult(result);
  }

  private async runSteps(args: string[]): Promise<boolean> {
    const [subcommand, ...rest] = args;
    if (subcommand !== 'find') {
      throw new Error(`Unknown steps subcommand: ${subcommand ?? '(empty)'}`);
    }

    const query = rest.join(' ').trim();
    if (!query) {
      throw new Error('steps find requires a query.');
    }

    this.printSuccess(formatStepSearchResults(query, loadLiveStepDefinitions()));
    return true;
  }

  private async runClear(): Promise<boolean> {
    const client = await this.ensureConnected();
    const result = await client.callTool(
      { name: 'sessions_clear', arguments: {} },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );
    return this.printToolResult(result);
  }

  private async runShutdown(): Promise<boolean> {
    const client = await this.ensureConnected();
    await client.notification({ method: 'notifications/shutdown', params: {} });
    this.printSuccess('Shutdown notification sent.');
    return true;
  }

  async executeTokens(tokens: string[], options: { interactive: boolean }): Promise<CommandExecutionResult> {
    if (tokens.length === 0) {
      return { ok: true, shouldExit: false };
    }

    const [command, ...args] = tokens;

    try {
      switch (command) {
        case 'help':
          this.printSuccess(HELP_TEXT);
          return { ok: true, shouldExit: false };
        case 'start':
          return { ok: await this.runStart(args), shouldExit: false };
        case 'restart':
          return { ok: await this.runStart(args), shouldExit: false };
        case 'attach':
          return { ok: await this.runAttach(), shouldExit: false };
        case 'tools':
          return { ok: await this.runTools(), shouldExit: false };
        case 'step':
          return { ok: await this.runStep(args), shouldExit: false };
        case 'step-json':
          return { ok: await this.runStepJson(args), shouldExit: false };
        case 'batch':
          return { ok: await this.runBatch(args), shouldExit: false };
        case 'batch-json':
          return { ok: await this.runBatchJson(args), shouldExit: false };
        case 'steps':
          return { ok: await this.runSteps(args), shouldExit: false };
        case 'clear':
          return { ok: await this.runClear(), shouldExit: false };
        case 'shutdown':
          return { ok: await this.runShutdown(), shouldExit: true };
        case 'exit':
        case 'quit':
          return { ok: true, shouldExit: true };
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.printError(message);
      if (this.bridgeStderr.trim()) {
        this.printError(this.bridgeStderr.trim());
        this.bridgeStderr = '';
      }
      return { ok: false, shouldExit: options.interactive ? false : !this.keepBridgeAlive };
    }
  }

  async executeLine(line: string, options: { interactive: boolean }): Promise<CommandExecutionResult> {
    const trimmed = line.trim();
    if (trimmed.startsWith('step-json ')) {
      return this.executeTokens(['step-json', trimmed.slice('step-json '.length)], options);
    }
    if (trimmed.startsWith('batch-json ')) {
      return this.executeTokens(['batch-json', trimmed.slice('batch-json '.length)], options);
    }
    return this.executeTokens(tokenizeCommand(line), options);
  }

  async runInteractive(): Promise<number> {
    const isTTY = 'isTTY' in this.stdin && Boolean(this.stdin.isTTY);
    if (!isTTY) {
      this.printSuccess('Session is running. Press Ctrl+C to stop.');
      return new Promise<number>((resolve) => {
        const keepAlive = setInterval(() => {}, 60_000);
        const onSignal = () => {
          clearInterval(keepAlive);
          resolve(0);
        };
        process.once('SIGINT', onSignal);
        process.once('SIGTERM', onSignal);
      });
    }

    this.printSuccess('Syngrisi MCP Test Engine CLI');
    this.printSuccess('Type "help" to see commands. Type "shutdown" or "exit" to leave.');

    const rl = readline.createInterface({
      input: this.stdin,
      output: this.stdout,
      terminal: true,
    });

    let exitCode = 0;
    try {
      while (true) {
        const line = await rl.question('mcp> ');
        const result = await this.executeLine(line, { interactive: true });
        if (!result.ok) {
          exitCode = 1;
        }
        if (result.shouldExit) {
          break;
        }
      }
    } finally {
      rl.close();
    }

    return exitCode;
  }
}

const cleanUpStaleState = async (state: TestEngineSessionState | null): Promise<boolean> => {
  if (!state) {
    return false;
  }
  const alive = await isStateReachable(state);
  if (alive) {
    return true;
  }
  await removeSessionState(state.agentId);
  return false;
};

const startDaemonProcess = async (
  identity: ResolvedAgentIdentity,
  sessionName: string,
  headed: boolean,
  attachMode: boolean,
): Promise<{ state: TestEngineSessionState; startupStdout: string }> => {
  const statusFile = path.join(e2eRoot, 'support', 'mcp', 'logs', `daemon-status-${Date.now()}-${process.pid}.json`);
  const child = spawn(
    process.execPath,
    [
      '--require',
      TSX_PREFLIGHT,
      '--import',
      TSX_LOADER,
      path.join('support', 'mcp', 'test-engine-cli.ts'),
      '--daemon-server',
      '--status-file',
      statusFile,
      '--system-thread',
      identity.agentId,
      ...(attachMode ? ['--daemon-attach'] : []),
      ...(headed ? ['--headed'] : []),
      ...(attachMode ? [] : [sessionName]),
    ],
    {
      cwd: e2eRoot,
      env: {
        ...(process.env as Record<string, string>),
        MCP_BRIDGE_IGNORE_STDIN_END: '1',
      },
      detached: true,
      stdio: 'ignore',
    },
  );

  child.unref();

  try {
    const startedAt = Date.now();
    let state: TestEngineSessionState | null = null;

    while (Date.now() - startedAt < DAEMON_START_TIMEOUT_MS) {
      const candidate = await readSessionState(identity.agentId);
      if (candidate && candidate.daemonPid === child.pid && !candidate.initializing) {
        state = candidate;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    if (!state) {
      state = await waitForSessionStateReady(identity.agentId, 1000, 100).catch(() => null);
    }

    if (!state || state.daemonPid !== child.pid) {
      throw new Error(`Timed out waiting for daemon ${child.pid} to publish a ready session state for agent ${identity.agentId}.`);
    }

    const startupStdout = await fs.readFile(statusFile, 'utf8').catch(() => '');
    const parsed = startupStdout ? JSON.parse(startupStdout) as { startupStdout?: string } : {};
    return { state, startupStdout: parsed.startupStdout ?? '' };
  } finally {
    await fs.rm(statusFile, { force: true }).catch(() => undefined);
  }
};

const ensureActiveState = async (agentId: string): Promise<TestEngineSessionState> => {
  const state = await readSessionState(agentId);
  if (!state) {
    throw new Error(`No active session found for agent "${agentId}". Run start first.`);
  }
  const alive = await cleanUpStaleState(state);
  if (!alive) {
    throw new Error(`No active session found for agent "${agentId}". Run start first.`);
  }
  const refreshed = (await readSessionState(agentId)) ?? state;
  if (getHealthLabel(refreshed) === 'broken') {
    throw new Error(
      `Session "${agentId}" is marked broken. ${refreshed.brokenReason ?? 'Run start again to create a fresh session.'}`,
    );
  }
  return refreshed;
};

const sendDaemonCommand = async (state: TestEngineSessionState, command: string): Promise<DaemonCommandResponse> => {
  let response: DaemonCommandResponse;
  try {
    response = await fetchJson<DaemonCommandResponse>(
      `http://${LOCALHOST}:${state.daemonPort}/command`,
      {
        method: 'POST',
        body: { command },
      },
    );
  } catch (error) {
    const alive = await cleanUpStaleState(state);
    const message = error instanceof Error ? error.message : String(error);
    if (!alive) {
      throw new Error(
        `Session daemon for agent "${state.agentId}" is no longer reachable. Run start again. Last error: ${message}`,
      );
    }
    throw new Error(`Failed to execute "${command}" for agent "${state.agentId}": ${message}`);
  }

  if (response.ok) {
    await updateSessionActivity(state.agentId);
  } else if (shouldMarkBrokenFromText(`${response.stdout}\n${response.stderr}`)) {
    await patchSessionState(state.agentId, {
      health: 'broken',
      brokenReason: response.stderr.trim() || response.stdout.trim() || 'Session became unusable.',
      currentCommand: undefined,
      lastActivity: new Date().toISOString(),
    });
  }

  return response;
};

const printDaemonResponse = (streams: { stdout: Writable; stderr: Writable }, response: DaemonCommandResponse): boolean => {
  if (response.stdout.trim()) {
    streams.stdout.write(response.stdout);
    if (!response.stdout.endsWith('\n')) {
      streams.stdout.write('\n');
    }
  }
  if (response.stderr.trim()) {
    streams.stderr.write(response.stderr);
    if (!response.stderr.endsWith('\n')) {
      streams.stderr.write('\n');
    }
  }
  return response.ok;
};

const formatStateSummary = (identity: ResolvedAgentIdentity, state: TestEngineSessionState | null): string => {
  const lines = formatResolvedIdentity(identity);
  lines.push(`State file: ${getTestEngineStatePath(identity.agentId)}`);
  if (!state) {
    lines.push('Has active session: no');
    return lines.join('\n');
  }

  lines.push('Has active session: yes');
  lines.push(`Session name: ${state.sessionName}`);
  lines.push(`Daemon PID: ${state.daemonPid}`);
  lines.push(`Daemon port: ${state.daemonPort}`);
  lines.push(`Health: ${getHealthLabel(state)}`);
  lines.push(`Mode: ${state.mode}`);
  lines.push(`Headed: ${state.headed ? 'yes' : 'no'}`);
  lines.push(`Started at: ${state.startedAt}`);
  lines.push(`Last activity: ${state.lastActivity}`);
  if (state.sessionId) {
    lines.push(`Session ID: ${state.sessionId}`);
  }
  if (state.logFile) {
    lines.push(`Log file: ${state.logFile}`);
  }
  if (state.initError) {
    lines.push(`Init error: ${state.initError}`);
  }
  if (state.brokenReason) {
    lines.push(`Broken reason: ${state.brokenReason}`);
  }
  if (state.currentCommand) {
    lines.push(`Current command: ${state.currentCommand}`);
  }
  if (state.lastCommand) {
    lines.push(`Last command: ${state.lastCommand}`);
  }
  if (state.smokeStep) {
    lines.push(`Smoke step: ${state.smokeStep}`);
  }
  if (state.smokeCheckedAt) {
    lines.push(`Smoke checked at: ${state.smokeCheckedAt}`);
  }
  if (state.eventLogFile) {
    lines.push(`Event log: ${state.eventLogFile}`);
  }
  if (state.lastArtifacts?.length) {
    lines.push(`Last artifacts: ${state.lastArtifacts.join(', ')}`);
  }
  return lines.join('\n');
};

const formatSessionStartSummary = (
  identity: ResolvedAgentIdentity,
  state: TestEngineSessionState,
  reused: boolean,
): string => {
  const lines = [
    ...formatResolvedIdentity(identity),
    'Status: Success',
    `Reused: ${reused ? 'yes' : 'no'}`,
    `Session name: ${state.sessionName}`,
    `Daemon PID: ${state.daemonPid}`,
    `Daemon port: ${state.daemonPort}`,
    `Health: ${getHealthLabel(state)}`,
  ];
  if (state.sessionId) {
    lines.push(`Session ID: ${state.sessionId}`);
  }
  if (state.logFile) {
    lines.push(`Log file: ${state.logFile}`);
  }
  return lines.join('\n');
};

const resolveIdentityForCommand = async (
  explicitAgentId: string | null,
  fallbackAgentId: string | null,
): Promise<ResolvedAgentIdentity> => resolveAgentIdentity({
  envAgentId: explicitAgentId ?? fallbackAgentId ?? undefined,
});

const handleDirectCommand = async (
  commandLine: string,
  streams: { stdout: Writable; stderr: Writable },
  fallbackAgentId: string | null,
  options: { jsonOutput: boolean },
): Promise<{ ok: boolean; resolvedAgentId: string | null }> => {
  const tokens = parseCommandLine(commandLine);
  if (tokens.length === 0) {
    return { ok: true, resolvedAgentId: fallbackAgentId };
  }

  const [command, ...rest] = tokens;
  const { tokens: strippedArgs, agentId: explicitAgentId } = parseGlobalAgentId(rest);
  validateCommandUsage(command, strippedArgs);

  if (command === 'help') {
    if (options.jsonOutput) {
      writeJson(streams.stdout, { ok: true, command: 'help', stdout: HELP_TEXT });
    } else {
      writeLine(streams.stdout, HELP_TEXT);
    }
    return { ok: true, resolvedAgentId: fallbackAgentId };
  }

  if (command === 'steps') {
    const runtime = new TestEngineCliRuntime({ stdout: streams.stdout, stderr: streams.stderr });
    try {
      const result = await runtime.executeTokens([command, ...strippedArgs], { interactive: false });
      return { ok: result.ok, resolvedAgentId: fallbackAgentId };
    } finally {
      await runtime.close();
    }
  }

  if (command === 'tools') {
    const identity = await resolveIdentityForCommand(explicitAgentId, fallbackAgentId);
    const state = await ensureActiveState(identity.agentId);
    const stdout = formatStableToolList();
    if (options.jsonOutput) {
      writeJson(streams.stdout, {
        ok: true,
        command,
        systemThread: identity.agentId,
        health: getHealthLabel(state),
        stdout,
        stderr: '',
        artifacts: [],
        state,
        eventLogFile: getTestEngineEventLogPath(identity.agentId),
      });
    } else {
      writeLine(streams.stdout, stdout);
    }
    return { ok: true, resolvedAgentId: identity.agentId };
  }

  const identity = await resolveIdentityForCommand(explicitAgentId, fallbackAgentId);

  if (command === 'status' || command === 'resolve') {
    const state = await readSessionState(identity.agentId);
    const alive = await cleanUpStaleState(state);
    const refreshed = alive ? await readSessionState(identity.agentId) : null;
    if (options.jsonOutput) {
      writeJson(streams.stdout, {
        ok: true,
        command,
        systemThread: identity.agentId,
        health: refreshed ? getHealthLabel(refreshed) : undefined,
        state: refreshed,
        eventLogFile: getTestEngineEventLogPath(identity.agentId),
      });
    } else {
      writeLine(streams.stdout, formatStateSummary(identity, refreshed));
    }
    return { ok: true, resolvedAgentId: identity.agentId };
  }

  if (command === 'start' || command === 'restart') {
    let headed = false;
    const sessionNameTokens: string[] = [];
    for (const token of strippedArgs) {
      if (token === '--headed') {
        headed = true;
        continue;
      }
      sessionNameTokens.push(token);
    }

    const sessionName = sessionNameTokens.join(' ').trim();
    if (!sessionName) {
      throw new Error(`${command} requires a session name.`);
    }

    const existingState = await readSessionState(identity.agentId);
    if (command === 'start' && await cleanUpStaleState(existingState) && getHealthLabel((await readSessionState(identity.agentId)) ?? existingState!) !== 'broken') {
      const activeState = await ensureActiveState(identity.agentId);
      if (options.jsonOutput) {
        writeJson(streams.stdout, {
          ok: true,
          command,
          systemThread: identity.agentId,
          health: getHealthLabel(activeState),
          state: activeState,
          reused: true,
          eventLogFile: getTestEngineEventLogPath(identity.agentId),
        });
      } else {
        writeLine(streams.stdout, formatSessionStartSummary(identity, activeState, true));
      }
      return { ok: true, resolvedAgentId: identity.agentId };
    }

    if (existingState) {
      if (command === 'restart') {
        try {
          const response = await sendDaemonCommand(existingState, 'shutdown');
          printDaemonResponse(streams, response);
        } catch {
          // stale/broken session is being replaced anyway
        }
      }
      await removeSessionState(identity.agentId);
    }

    const { state, startupStdout } = await startDaemonProcess(identity, sessionName, headed, false);
    if (options.jsonOutput) {
      writeJson(streams.stdout, {
        ok: true,
        command,
        systemThread: identity.agentId,
        health: getHealthLabel(state),
        state,
        reused: false,
        stdout: startupStdout,
        artifacts: extractArtifacts(startupStdout),
        eventLogFile: getTestEngineEventLogPath(identity.agentId),
      });
    } else {
      writeLine(streams.stdout, formatSessionStartSummary(identity, state, false));
      const startupDetails = normalizeStartupDetails(startupStdout);
      if (startupDetails) {
        writeLine(streams.stdout, startupDetails);
      }
    }
    return { ok: true, resolvedAgentId: identity.agentId };
  }

  if (command === 'attach') {
    const existingState = await readSessionState(identity.agentId);
    if (await cleanUpStaleState(existingState) && getHealthLabel((await readSessionState(identity.agentId)) ?? existingState!) !== 'broken') {
      const activeState = await ensureActiveState(identity.agentId);
      if (options.jsonOutput) {
        writeJson(streams.stdout, {
          ok: true,
          command,
          systemThread: identity.agentId,
          health: getHealthLabel(activeState),
          state: activeState,
          reused: true,
          eventLogFile: getTestEngineEventLogPath(identity.agentId),
        });
      } else {
        writeLine(streams.stdout, formatSessionStartSummary(identity, activeState, true));
      }
      return { ok: true, resolvedAgentId: identity.agentId };
    }

    if (existingState) {
      await removeSessionState(identity.agentId);
    }

    const { state, startupStdout } = await startDaemonProcess(identity, `attached-${identity.agentId}`, false, true);
    if (options.jsonOutput) {
      writeJson(streams.stdout, {
        ok: true,
        command,
        systemThread: identity.agentId,
        health: getHealthLabel(state),
        state,
        reused: false,
        stdout: startupStdout,
        artifacts: extractArtifacts(startupStdout),
        eventLogFile: getTestEngineEventLogPath(identity.agentId),
      });
    } else {
      writeLine(streams.stdout, formatSessionStartSummary(identity, state, false));
      const startupDetails = normalizeStartupDetails(startupStdout);
      if (startupDetails) {
        writeLine(streams.stdout, startupDetails);
      }
    }
    return { ok: true, resolvedAgentId: identity.agentId };
  }

  const state = await ensureActiveState(identity.agentId);
  const daemonCommand = command === 'step-json' || command === 'batch-json'
    ? `${command} ${strippedArgs[0] ?? ''}`.trimEnd()
    : [command, ...strippedArgs.map(quoteCommandToken)].join(' ');
  const response = await sendDaemonCommand(state, daemonCommand);
  const artifacts = extractArtifacts(`${response.stdout}\n${response.stderr}`);
  const responseState = response.state ?? await readSessionState(identity.agentId);
  const ok = options.jsonOutput
    ? (writeJson(streams.stdout, {
      ok: response.ok,
      command,
      systemThread: identity.agentId,
      health: responseState ? getHealthLabel(responseState) : undefined,
      stdout: response.stdout,
      stderr: response.stderr,
      artifacts,
      state: responseState,
      eventLogFile: getTestEngineEventLogPath(identity.agentId),
    }), response.ok)
    : printDaemonResponse(streams, response);
  return { ok, resolvedAgentId: identity.agentId };
};

const runDaemonServer = async (parsed: ParsedCliArgs): Promise<number> => {
  if (!parsed.agentId) {
    throw new Error('Daemon server requires --system-thread.');
  }

  const initialCommand = parsed.daemonAttach
    ? 'attach'
    : (() => {
      const [sessionName] = parsed.commands;
      if (!sessionName) {
        throw new Error('Daemon start requires a session name.');
      }
      return `start ${quoteCommandToken(sessionName)}${parsed.daemonHeaded ? ' --headed' : ''}`;
    })();

  const stdoutBuffer = new BufferingWritable();
  const stderrBuffer = new BufferingWritable();
  const runtime = new TestEngineCliRuntime({ stdout: stdoutBuffer, stderr: stderrBuffer }, { keepBridgeAlive: true });
  let currentState: TestEngineSessionState = {
    agentId: parsed.agentId,
    sessionName: parsed.daemonAttach ? `attached-${parsed.agentId}` : parsed.commands[0] ?? `agent-${parsed.agentId}`,
    daemonPid: process.pid,
    daemonPort: 0,
    headed: parsed.daemonHeaded,
    mode: parsed.daemonAttach ? 'attach' : 'start',
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    initializing: true,
    health: 'initializing',
  };
  let commandQueue: Promise<void> = Promise.resolve();

  const persistState = async (patch: Partial<TestEngineSessionState>) => {
    currentState = {
      ...currentState,
      ...patch,
    };
    await writeSessionState(parsed.agentId, currentState);
  };

  const markBroken = async (reason: string) => {
    await persistState({
      health: 'broken',
      brokenReason: reason,
      currentCommand: undefined,
      initializing: false,
      lastActivity: new Date().toISOString(),
    });
    await appendSessionEvent(parsed.agentId, { type: 'session_broken', reason, health: 'broken' });
  };

  const executeDaemonCommand = async (commandLine: string): Promise<DaemonCommandTaskResult> => {
    const commandId = makeCommandId();
    stdoutBuffer.clear();
    stderrBuffer.clear();

    await persistState({
      health: 'busy',
      currentCommand: commandLine,
      lastCommand: commandLine,
      lastCommandId: commandId,
      brokenReason: undefined,
      lastActivity: new Date().toISOString(),
    });
    await appendSessionEvent(parsed.agentId, {
      type: 'command_started',
      commandId,
      command: commandLine,
    });

    let result: CommandExecutionResult;
    if (
      commandLine === 'status' ||
      commandLine === 'resolve' ||
      commandLine === 'tools' ||
      commandLine === 'help' ||
      commandLine.startsWith('steps ')
    ) {
      result = await handleDirectCommand(
        commandLine,
        { stdout: stdoutBuffer, stderr: stderrBuffer },
        parsed.agentId,
        { jsonOutput: false },
      )
        .then((value) => ({ ok: value.ok, shouldExit: false }));
    } else {
      result = await runtime.executeLine(commandLine, { interactive: false });
    }

    const stdout = stdoutBuffer.readText();
    const stderr = stderrBuffer.readText();
    const combinedText = `${stdout}\n${stderr}`;
    const broken = !result.ok && shouldMarkBrokenFromText(combinedText);
    const artifacts = extractArtifacts(combinedText);

    const smokeMatch = stdout.match(/Result:\s+"([^"]+)"/u);
    await persistState({
      health: broken ? 'broken' : 'ready',
      brokenReason: broken ? (stderr.trim() || stdout.trim() || 'Session became unusable.') : undefined,
      currentCommand: undefined,
      lastActivity: new Date().toISOString(),
      lastArtifacts: artifacts,
      ...(commandLine.startsWith('start ') || commandLine === 'attach'
        ? {
          smokeCheckedAt: new Date().toISOString(),
          smokeStep: stdout.includes('Result: "Test message from diagnostic step"') ? 'I test' : (
            smokeMatch ? 'I get current URL' : undefined
          ),
        }
        : {}),
    });
    await appendSessionEvent(parsed.agentId, {
      type: broken ? 'command_broken' : 'command_finished',
      commandId,
      command: commandLine,
      ok: result.ok,
      shouldExit: result.shouldExit,
      artifacts,
      stderr: stderr.trim() || undefined,
    });

    return { result, stdout, stderr };
  };

  const server = http.createServer(async (request, response) => {
    const sendJson = (status: number, payload: unknown) => {
      response.statusCode = status;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(payload));
    };

    try {
      if (request.method === 'GET' && request.url === '/status') {
        sendJson(200, { ok: true, state: currentState } satisfies DaemonStatusResponse);
        return;
      }

      if (request.method === 'POST' && request.url === '/command') {
        let body = '';
        for await (const chunk of request) {
          body += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        }

        const payload = JSON.parse(body || '{}') as { command?: string };
        if (!payload.command?.trim()) {
          sendJson(400, { ok: false, shouldExit: false, stdout: '', stderr: 'Missing command.' } satisfies DaemonCommandResponse);
          return;
        }

        let resolveTask: ((value: DaemonCommandResponse) => void) | null = null;
        let rejectTask: ((reason?: unknown) => void) | null = null;
        const taskResponse = new Promise<DaemonCommandResponse>((resolve, reject) => {
          resolveTask = resolve;
          rejectTask = reject;
        });

        commandQueue = commandQueue
          .catch(() => undefined)
          .then(async () => {
            try {
              const { result, stdout, stderr } = await executeDaemonCommand(payload.command.trim());
              resolveTask?.({
                ok: result.ok,
                shouldExit: result.shouldExit,
                stdout,
                stderr,
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              await markBroken(message);
              rejectTask?.(new Error(message));
            }
          });

        try {
          const commandResponse = await taskResponse;
          sendJson(200, {
            ...commandResponse,
            state: currentState,
          } satisfies DaemonCommandResponse);

          if (payload.command.trim().startsWith('shutdown') || commandResponse.shouldExit) {
            setImmediate(async () => {
              await appendSessionEvent(parsed.agentId!, {
                type: 'shutdown',
                lastCommand: payload.command.trim(),
              });
              await persistState({
                health: 'shutting_down',
                currentCommand: undefined,
                lastActivity: new Date().toISOString(),
              });
              await removeSessionStateIfOwned(parsed.agentId!, process.pid);
              await runtime.close();
              await new Promise<void>((resolve) => server.close(() => resolve()));
              process.exit(0);
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          sendJson(500, {
            ok: false,
            shouldExit: false,
            stdout: '',
            stderr: message,
          } satisfies DaemonCommandResponse);
        }
        return;
      }

      sendJson(404, { ok: false, error: 'Not found' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(500, { ok: false, error: message });
    }
  });

  try {
    await new Promise<void>((resolve, reject) => {
      server.listen(0, LOCALHOST, () => resolve());
      server.once('error', reject);
    });
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Failed to determine daemon port.');
    }

    currentState.daemonPort = address.port;
    currentState.eventLogFile = getTestEngineEventLogPath(parsed.agentId);
    await writeSessionState(parsed.agentId, currentState);
    await appendSessionEvent(parsed.agentId, {
      type: 'daemon_started',
      daemonPid: process.pid,
      daemonPort: currentState.daemonPort,
      eventLogFile: currentState.eventLogFile,
    });

    const { result, stdout: stdoutText, stderr: stderrText } = await executeDaemonCommand(initialCommand);

    if (!result.ok) {
      currentState.initializing = false;
      currentState.initError = stderrText || stdoutText || 'Failed to initialize session daemon.';
      await markBroken(currentState.initError);
      throw new Error(currentState.initError);
    }

    currentState = {
      ...currentState,
      ...parseSessionMetadata(stdoutText),
      initializing: false,
      health: 'ready',
      initError: undefined,
      lastActivity: new Date().toISOString(),
    };
    await writeSessionState(parsed.agentId, currentState);
    await appendSessionEvent(parsed.agentId, {
      type: 'session_ready',
      sessionId: currentState.sessionId,
      logFile: currentState.logFile,
      smokeStep: currentState.smokeStep,
    });

    if (parsed.statusFile) {
      await fs.mkdir(path.dirname(parsed.statusFile), { recursive: true });
      await fs.writeFile(
        parsed.statusFile,
        JSON.stringify({ ok: true, pid: process.pid, startupStdout: stdoutText }),
        'utf8',
      );
    }

    await new Promise<void>((resolve) => {
      server.on('close', () => resolve());
    });
    return 0;
  } catch (error) {
    if (parsed.statusFile) {
      await fs.mkdir(path.dirname(parsed.statusFile), { recursive: true });
      const message = error instanceof Error ? error.message : String(error);
      await fs.writeFile(parsed.statusFile, JSON.stringify({ ok: false, error: message }), 'utf8');
    }
    throw error;
  } finally {
    await runtime.close();
    if (currentState.initError) {
      await removeSessionStateIfOwned(parsed.agentId, process.pid).catch(() => undefined);
    }
  }
};

export const runTestEngineCli = async (argv: string[], options: TestEngineCliOptions = {}): Promise<number> => {
  const parsed = parseCliArgs(argv);
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;

  await cleanupSessionStates({ isProcessAlive });

  if (parsed.daemonServer) {
    return runDaemonServer(parsed);
  }

  if (parsed.showHelp || parsed.commands.length === 0) {
    if (parsed.jsonOutput) {
      writeJson(stdout, { ok: true, command: 'help', stdout: HELP_TEXT });
    } else {
      writeLine(stdout, HELP_TEXT);
    }
    return 0;
  }

  let fallbackAgentId: string | null = parsed.agentId;
  for (const command of parsed.commands) {
    const result = await handleDirectCommand(command, { stdout, stderr }, fallbackAgentId, {
      jsonOutput: parsed.jsonOutput,
    });
    if (!result.ok) {
      return 1;
    }
    fallbackAgentId = result.resolvedAgentId;
  }

  return 0;
};

export { HELP_TEXT, tokenizeCommand, parseCliArgs, extractContentText, getAllSessionStates, getTestEngineStatePath, parseCommandLine };
