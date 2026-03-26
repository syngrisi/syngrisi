import { promises as fs } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import type { Readable, Writable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import { e2eRoot, mcpRoot } from './config';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_ENTRY = path.join(mcpRoot, 'bridge-cli.ts');
const TSX_DIST_ROOT = path.join(e2eRoot, 'node_modules', 'tsx', 'dist');
const TSX_PREFLIGHT = path.join(TSX_DIST_ROOT, 'preflight.cjs');
const TSX_LOADER = `file://${path.join(TSX_DIST_ROOT, 'loader.mjs')}`;

const HELP_TEXT = [
  'Syngrisi MCP Test Engine CLI',
  '',
  'Usage:',
  '  npx tsx support/mcp/test-engine-cli.ts',
  '  npx tsx support/mcp/test-engine-cli.ts help',
  '  npx tsx support/mcp/test-engine-cli.ts --interactive-after-commands --command "start demo --headed"',
  '  npx tsx support/mcp/test-engine-cli.ts --command "start demo" --command "step \"I test\"" --command "shutdown"',
  '',
  'Commands:',
  '  help',
  '  start <sessionName> [--headed]',
  '  attach',
  '  tools',
  '  step <stepText> [--docstring <text>] [--docstring-json <json>] [--docstring-base64 <base64>]',
  '  batch <step1> <step2> [step3 ...]',
  '  clear',
  '  shutdown',
  '  exit',
  '',
  'Rules of thumb:',
  '  - Start or attach first.',
  '  - Use step for single actions and diagnostics.',
  '  - Use batch only for 2 or more sequential steps.',
  '  - With --command, CLI stays non-interactive by default.',
  '  - Use --interactive-after-commands to force mcp> prompt after commands.',
  '  - Use attach to connect to a debug MCP server recorded in logs/ports.',
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
  interactiveAfterCommands: boolean;
  daemonized: boolean;
  statusFile: string | null;
};

type TestEngineCliOptions = {
  stdin?: Readable;
  stdout?: Writable;
  stderr?: Writable;
};

const getCommandName = (command: string): string | null => {
  try {
    const [name] = tokenizeCommand(command);
    return name ?? null;
  } catch {
    return null;
  }
};

const isHeadedStartCommand = (command: string): boolean => {
  try {
    const [name, ...args] = tokenizeCommand(command);
    return name === 'start' && args.includes('--headed');
  } catch {
    return false;
  }
};

const shouldKeepBridgeAliveAfterCommands = (parsed: ParsedCliArgs): boolean => {
  if (parsed.interactiveAfterCommands) {
    return false;
  }

  const hasHeadedStart = parsed.commands.some(isHeadedStartCommand);
  if (!hasHeadedStart) {
    return false;
  }

  return !parsed.commands.some((command) => {
    const name = getCommandName(command);
    return name === 'shutdown' || name === 'exit' || name === 'quit';
  });
};

const shouldDetachIntoBackground = (parsed: ParsedCliArgs): boolean => {
  return shouldKeepBridgeAliveAfterCommands(parsed) && !parsed.daemonized;
};

const writeDetachedStatus = async (
  statusFile: string | null,
  payload: { ok: boolean; pid?: number; error?: string },
): Promise<void> => {
  if (!statusFile) {
    return;
  }

  await fs.mkdir(path.dirname(statusFile), { recursive: true });
  await fs.writeFile(statusFile, JSON.stringify(payload), 'utf8');
};

const waitForDetachedStatus = async (
  statusFile: string,
  timeoutMs = 30_000,
): Promise<{ ok: boolean; pid?: number; error?: string }> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const raw = await fs.readFile(statusFile, 'utf8');
      return JSON.parse(raw) as { ok: boolean; pid?: number; error?: string };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error(`Timed out waiting for detached session status at ${statusFile}`);
};

const spawnDetachedCli = async (argv: string[]): Promise<number> => {
  const statusFile = path.join(
    e2eRoot,
    'support',
    'mcp',
    'logs',
    `detached-status-${Date.now()}-${process.pid}.json`,
  );

  const child = spawn(
    process.execPath,
    [
      '--require',
      TSX_PREFLIGHT,
      '--import',
      TSX_LOADER,
      path.join('support', 'mcp', 'test-engine-cli.ts'),
      '--daemonized',
      '--status-file',
      statusFile,
      ...argv,
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
    const status = await waitForDetachedStatus(statusFile);
    if (!status.ok) {
      writeLine(process.stderr, status.error ?? 'Detached browser session failed to start.');
      return 1;
    }

    writeLine(process.stdout, `Detached browser session started in background (PID ${status.pid ?? 'unknown'}).`);
    return 0;
  } finally {
    await fs.rm(statusFile, { force: true }).catch(() => undefined);
  }
};

const writeLine = (stream: Writable, message: string = '') => {
  stream.write(`${message}\n`);
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

    if (/\s/.test(char)) {
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

const parseCliArgs = (argv: string[]): ParsedCliArgs => {
  const commands: string[] = [];
  let showHelp = false;
  let interactiveAfterCommands = false;
  let daemonized = false;
  let statusFile: string | null = null;
  const passthroughTokens: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      showHelp = true;
      continue;
    }

    if (token === '--interactive-after-commands') {
      interactiveAfterCommands = true;
      continue;
    }

    if (token === '--daemonized') {
      daemonized = true;
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

    if (token === '--command') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value after --command.');
      }
      commands.push(value);
      index += 1;
      continue;
    }

    passthroughTokens.push(token);
  }

  if (passthroughTokens.length > 0) {
    commands.push(passthroughTokens.map((token) => (token.includes(' ') ? `"${token}"` : token)).join(' '));
  }

  return { commands, showHelp, interactiveAfterCommands, daemonized, statusFile };
};

class TestEngineCliRuntime {
  private readonly stdin: Readable;
  private readonly stdout: Writable;
  private readonly stderr: Writable;
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private bridgeStderr = '';
  private connected = false;
  private startedHeadedSession = false;
  private readonly keepBridgeAlive: boolean;

  constructor(options: TestEngineCliOptions, runtimeOptions: { keepBridgeAlive?: boolean } = {}) {
    this.stdin = options.stdin ?? process.stdin;
    this.stdout = options.stdout ?? process.stdout;
    this.stderr = options.stderr ?? process.stderr;
    this.keepBridgeAlive = runtimeOptions.keepBridgeAlive ?? false;
  }

  async close(): Promise<void> {
    const transport = this.transport;
    const client = this.client;

    this.transport = null;
    this.client = null;
    this.connected = false;

    await Promise.allSettled([
      (async () => {
        if (!client) {
          return;
        }
        try {
          await client.close();
        } catch {
          // ignore close errors
        }
      })(),
      (async () => {
        if (!transport) {
          return;
        }
        try {
          await transport.close();
        } catch {
          // ignore close errors
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
      {
        name: 'syngrisi-mcp-test-engine-cli',
        version: '0.0.0',
      },
      {
        capabilities: {},
      },
    );

    await client.connect(transport);
    this.transport = transport;
    this.client = client;
    this.connected = true;
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

    await client.callTool({ name: 'sessions_clear', arguments: {} }, undefined, { timeout: TOOL_TIMEOUTS.execute });
    let result = await startSession();

    const text = extractContentText(result);
    const isError = Boolean(result && typeof result === 'object' && 'isError' in result && (result as { isError?: boolean }).isError);
    if (isError && text.includes('ERR_CONNECTION_REFUSED')) {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
      await client.callTool({ name: 'sessions_clear', arguments: {} }, undefined, { timeout: TOOL_TIMEOUTS.execute });
      result = await startSession();
    }

    this.startedHeadedSession = headed;
    return this.printToolResult(result);
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
    const tools = await client.listTools(undefined, { timeout: TOOL_TIMEOUTS.listTools });
    const lines = tools.tools.map(({ name, description }) => `${name}${description ? ` - ${description}` : ''}`);
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
      {
        name: 'step_execute_single',
        arguments: argumentsPayload,
      },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );

    return this.printToolResult(result);
  }

  private async runBatch(args: string[]): Promise<boolean> {
    if (args.length < 2) {
      throw new Error('batch requires at least 2 steps.');
    }

    const client = await this.ensureConnected();
    const result = await client.callTool(
      {
        name: 'step_execute_many',
        arguments: {
          steps: args,
        },
      },
      undefined,
      { timeout: TOOL_TIMEOUTS.execute },
    );

    return this.printToolResult(result);
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
    await client.notification({
      method: 'notifications/shutdown',
      params: {},
    });
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
        case 'attach':
          return { ok: await this.runAttach(), shouldExit: false };
        case 'tools':
          return { ok: await this.runTools(), shouldExit: false };
        case 'step':
          return { ok: await this.runStep(args), shouldExit: false };
        case 'batch':
          return { ok: await this.runBatch(args), shouldExit: false };
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
      return { ok: false, shouldExit: !options.interactive };
    }
  }

  async executeLine(line: string, options: { interactive: boolean }): Promise<CommandExecutionResult> {
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

  async runPassiveHold(): Promise<number> {
    this.printSuccess('Session is running without interactive prompt. Press Ctrl+C to stop.');
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

  shouldHoldAfterCommands(): boolean {
    return this.connected && this.startedHeadedSession;
  }
}

export const runTestEngineCli = async (argv: string[], options: TestEngineCliOptions = {}): Promise<number> => {
  const parsed = parseCliArgs(argv);

  if (shouldDetachIntoBackground(parsed)) {
    return spawnDetachedCli(argv);
  }

  const runtime = new TestEngineCliRuntime(options, {
    keepBridgeAlive: shouldKeepBridgeAliveAfterCommands(parsed),
  });

  try {
    if (parsed.showHelp && parsed.commands.length === 0) {
      writeLine(options.stdout ?? process.stdout, HELP_TEXT);
      return 0;
    }

    if (parsed.commands.length > 0) {
      let shouldExit = false;
      for (const command of parsed.commands) {
        const result = await runtime.executeLine(command, { interactive: false });
        if (!result.ok) {
          return 1;
        }
        if (result.shouldExit) {
          shouldExit = true;
          break;
        }
      }
      if (shouldExit) {
        return 0;
      }

      if (parsed.interactiveAfterCommands) {
        return runtime.runInteractive();
      }

      if (runtime.shouldHoldAfterCommands()) {
        await writeDetachedStatus(parsed.statusFile, { ok: true, pid: process.pid });
        return runtime.runPassiveHold();
      }

      await writeDetachedStatus(parsed.statusFile, { ok: true, pid: process.pid });
      return 0;
    }

    return runtime.runInteractive();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await writeDetachedStatus(parsed.statusFile, { ok: false, error: message });
    throw error;
  } finally {
    await runtime.close();
  }
};

export { HELP_TEXT, tokenizeCommand, parseCliArgs, extractContentText };
