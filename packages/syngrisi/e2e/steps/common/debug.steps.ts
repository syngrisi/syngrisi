import fs from 'fs/promises';
import path from 'path';
import * as fsSync from 'fs';
import { spawn, type ChildProcess } from 'node:child_process';
import { When, Then } from '@fixtures';
import type { TestEngineFixture } from '@fixtures';
import { env } from '@config';
import { expect } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { BddContext } from 'playwright-bdd/dist/runtime/bddContext';
import type { Page } from '@playwright/test';
import type { AppServerFixture, TestStore } from '@fixtures';
import { got } from 'got-cjs';
import FormData from 'form-data';
import * as crypto from 'crypto';
import { requestWithSession } from '@utils/http-client';

const logger = createLogger('DebugSteps');

// Check if demo should be skipped
const SKIP_DEMO = process.env.SKIP_DEMO_TESTS === 'true';

/**
 * Step definition: `When I PAUSE`
 *
 * Pauses the current Playwright runner, opening the inspector.
 * This step is a no-op in CI environments.
 *
 * @example
 * ```gherkin
 * When I PAUSE
 * ```
 */
const logMcpStatus = (testEngine: TestEngineFixture) => {
  logger.info('=== MCP Server Status ===');
  logger.info('Running:', testEngine.isRunning());
  logger.info('Port:', testEngine.getPort());
  logger.info('Base URL:', testEngine.getBaseUrl());
  logger.info('========================');
};

const describeScenario = ($bddContext: unknown) => {
  const ctx = $bddContext as BddContext | undefined;
  const testInfo = ctx?.testInfo;
  if (!ctx || !testInfo) {
    return null;
  }

  const featureUri = ctx.featureUri;
  const titlePath = typeof testInfo.titlePath === 'function' ? testInfo.titlePath() : [testInfo.title];
  const scenarioTitle = titlePath.at(-1) ?? testInfo.title ?? 'Unknown scenario';

  const normalizeFilePath = (input?: string | null): string | null => {
    if (!input) {
      return null;
    }
    if (input.startsWith('file://')) {
      return input.replace('file://', '');
    }
    return input;
  };

  const absoluteFeaturePath = normalizeFilePath(featureUri) ?? normalizeFilePath(testInfo.file);
  const relativeFeaturePath =
    absoluteFeaturePath && !absoluteFeaturePath.startsWith('mcp://')
      ? path.relative(process.cwd(), absoluteFeaturePath)
      : null;

  return {
    scenarioTitle,
    titlePath,
    absoluteFeaturePath,
    relativeFeaturePath,
    featureUri,
  };
};

type ScenarioDescription = ReturnType<typeof describeScenario>;
type RecordedScenario = NonNullable<ScenarioDescription>;

let activeCodexProcess: ChildProcess | null = null;
let codexExitHandlerAttached = false;

const ensureCodexProcessTerminationOnExit = () => {
  if (codexExitHandlerAttached) {
    return;
  }

  process.once('exit', () => {
    if (activeCodexProcess && !activeCodexProcess.killed) {
      activeCodexProcess.kill('SIGTERM');
    }
  });

  codexExitHandlerAttached = true;
};

const terminateCodexProcess = () => {
  if (!activeCodexProcess) {
    return;
  }

  if (!activeCodexProcess.killed) {
    activeCodexProcess.kill('SIGTERM');
  }

  activeCodexProcess = null;
};

const logScenarioDetails = (scenarioInfo: ScenarioDescription): RecordedScenario | null => {
  if (!scenarioInfo) {
    logger.info('Could not determine scenario context for debug session.');
    return null;
  }

  const { scenarioTitle, titlePath, absoluteFeaturePath, relativeFeaturePath, featureUri } = scenarioInfo;
  const titlePathDisplay = titlePath.join(' › ');
  const locationDisplay =
    relativeFeaturePath ?? absoluteFeaturePath ?? featureUri ?? 'unknown feature location';

  logger.info(`Debug session triggered from scenario: ${locationDisplay} › ${scenarioTitle}`);
  logger.info(`Scenario title path: ${titlePathDisplay}`);

  if (absoluteFeaturePath && relativeFeaturePath && absoluteFeaturePath !== relativeFeaturePath) {
    logger.info(`Absolute feature path: ${absoluteFeaturePath}`);
  }

  return scenarioInfo;
};

const buildPortLogPayload = (port: number, recordedScenario: RecordedScenario | null) => ({
  port,
  recordedAt: new Date().toISOString(),
  scenario: recordedScenario
    ? {
      title: recordedScenario.scenarioTitle,
      titlePath: recordedScenario.titlePath,
      featurePath: recordedScenario.relativeFeaturePath ?? recordedScenario.absoluteFeaturePath,
      featureUri: recordedScenario.featureUri,
    }
    : null,
});

const recordPortLog = async (port: number | null | undefined, recordedScenario: RecordedScenario | null) => {
  if (port == null) {
    logger.warn('MCP test engine port unavailable; skipping port log');
    return null;
  }

  try {
    await fs.mkdir(portsLogDir, { recursive: true });
    const timestampSeconds = Math.floor(Date.now() / 1000);
    const filePath = path.join(portsLogDir, `${timestampSeconds}.port`);
    const payload = buildPortLogPayload(port, recordedScenario);

    await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}
`, 'utf8');
    logger.info(`Recorded MCP port ${port} at ${filePath}`);
    return filePath;
  } catch (error) {
    logger.error('Failed to record MCP port', error);
    return null;
  }
};

const buildCodexPrompt = (basePrompt: string | undefined, scenario: RecordedScenario | null) => {
  const sections = [
    basePrompt?.trim(),
    'Important: operate exclusively through the MCP Test Engine debug server for this session.',
    'After connecting, perform every action via the MCP Test Engine; do not execute commands outside that connection.',
    scenario?.relativeFeaturePath
      ? `You are working within scenario file: ${scenario.relativeFeaturePath}.`
      : scenario?.absoluteFeaturePath
        ? `You are working within scenario file: ${scenario.absoluteFeaturePath}.`
        : null,
  ].filter((section): section is string => Boolean(section));

  return sections.join('\n\n');
};

const shellEscape = (value: string) => `'${value.replace(/'/g, `'\''`)}'`;

const encodePromptForShell = (prompt: string | undefined) => {
  if (!prompt) {
    return { assignment: '', invocation: 'codex' };
  }
  const encoded = Buffer.from(prompt).toString('base64');
  const assignment = `PROMPT=$(printf %s ${shellEscape(encoded)} | base64 --decode); `;
  return { assignment, invocation: 'codex "$PROMPT"' };
};

const buildAppleScriptCommand = (prompt: string | undefined) => {
  const { assignment, invocation } = encodePromptForShell(prompt);
  const shellCommand = `cd ${shellEscape(process.cwd())}; ${assignment}${invocation}`;
  const escapedShellCommand = shellCommand.replace(/\\/g, '\\\\').replace(/"/g, '\"');
  return `
    tell application "Terminal"
      activate
      do script "${escapedShellCommand}"
    end tell
  `.trim();
};

const buildCodexInvocation = (prompt: string | undefined) => {
  const codexArgs = prompt ? [prompt] : [];

  if (process.stdin.isTTY && process.stdout.isTTY) {
    return { mode: 'tty' as const, command: 'codex', args: codexArgs, detached: false };
  }

  if (process.platform === 'darwin') {
    return {
      mode: 'osascript' as const,
      command: 'osascript',
      args: ['-e', buildAppleScriptCommand(prompt)],
      detached: true,
    };
  }

  /**
   * `script` allocates a pseudo-tty, which Codex requires for interactive sessions.
   * The `-q` flag suppresses the startup banner and `/dev/null` disables transcript logging.
   */
  return {
    mode: 'script' as const,
    command: 'script',
    args: ['-q', '/dev/null', 'codex', ...codexArgs] as string[],
    detached: false,
  };
};

const startCodexInteractiveSession = (prompt: string | undefined) => {
  ensureCodexProcessTerminationOnExit();
  terminateCodexProcess();

  const { command, args } = buildCodexInvocation(prompt);
  if (!command) {
    logger.warn('Interactive Codex session is unavailable in this environment. Please start Codex manually.');
    return;
  }

  if (command === 'osascript') {
    logger.info('No TTY detected; launching a new Terminal window for the Codex CLI via AppleScript.');
  } else if (command === 'script') {
    logger.info('No TTY detected; wrapping Codex CLI with `script` for pseudo-terminal support.');
  }

  try {
    activeCodexProcess = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });

    activeCodexProcess.once('exit', (code, signal) => {
      const outcome =
        code === null
          ? `stopped by signal ${signal ?? 'unknown'}`
          : `exited with code ${code}`;
      logger.info(`Codex CLI session ${outcome}`);
      activeCodexProcess = null;
    });

    activeCodexProcess.once('error', (error) => {
      logger.error('Failed to launch Codex CLI', error);
      activeCodexProcess = null;
    });
  } catch (error) {
    logger.error('Unable to spawn Codex CLI', error);
    activeCodexProcess = null;
  }
};

When('I PAUSE', async ({ page, testEngine }) => {
  if (env.CI) {
    return;
  }

  logMcpStatus(testEngine);
  await page.pause();
});

Then('I pause', async ({ page }) => {
  if (env.CI) {
    return;
  }
  await page.pause();
});

When('I pause with phrase: {string}', async ({ page, testEngine }, phrase: string) => {
  if (env.CI) {
    return;
  }
  const { exec } = await import('node:child_process');
  const voice = process.env.E2E_SAY_VOICE || 'Alex';
  exec(`say -v ${voice} "${phrase}"`);

  logMcpStatus(testEngine);
  await page.pause();
});

/**
 * Pauses execution for a specified number of milliseconds.
 * Useful for waiting for async operations or animations to complete.
 *
 * @example
 * ```gherkin
 * When I pause for 1000 ms
 * When I pause for 500 ms
 * ```
 */
When('I pause for {int} ms', async ({ page }, ms: number) => {
  if (SKIP_DEMO) {
    logger.info(`Skipping pause for ${ms}ms (SKIP_DEMO_TESTS=true)`);
    return;
  }
  logger.info(`Pausing for ${ms}ms`);
  await page.waitForTimeout(ms);
});

When('I fail', async ({ page }) => {
  logger.info('Failing as requested');
  expect(false).toBe(true);
});

When('I log current URL', async ({ page }) => {
  const currentUrl = page.url();
  logger.info(`Current URL: ${currentUrl}`);
  return currentUrl;
});

When('I test', async () => {
  logger.info('Test message from diagnostic step');
  return 'Test message from diagnostic step';
});

When('I start the debug MCP Test Engine', async ({ testEngine, page, $bddContext }) => {
  await testEngine.start();

  const recordedScenario = logScenarioDetails(describeScenario($bddContext));
  await recordPortLog(testEngine.getPort(), recordedScenario);
  logMcpStatus(testEngine);
  await page.pause();
});


// ⚠️ experimental, not used widely yet
When('I start the MCP test engine with "codex":', async ({ testEngine, page, $bddContext }, docString?: string) => {
  await testEngine.start();

  const recordedScenario = logScenarioDetails(describeScenario($bddContext));
  await recordPortLog(testEngine.getPort(), recordedScenario);
  const prompt = buildCodexPrompt(docString, recordedScenario);

  logger.info('Launching Codex CLI for MCP debug session.');
  startCodexInteractiveSession(prompt);
  logMcpStatus(testEngine);
  await page.pause();
});

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

async function createCheck(
  appServer: AppServerFixture,
  testId: string,
  checkName: string,
  imagePath: string,
  apiKey: string
) {
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
  const fullPath = path.join(repoRoot, 'syngrisi', 'tests', imagePath);

  // Verify file exists using sync fs
  if (!fsSync.existsSync(fullPath)) {
    logger.warn(`Image file not found at ${fullPath}`);
    // Try to list directory to see what's there
    try {
      const dir = path.dirname(fullPath);
      if (fsSync.existsSync(dir)) {
        logger.info(`Contents of ${dir}:`, fsSync.readdirSync(dir));
      } else {
        logger.warn(`Directory ${dir} does not exist`);
      }
    } catch (e) {
      logger.error('Error checking directory', e);
    }
    throw new Error(`Image file not found: ${fullPath}`);
  }

  const imageBuffer = fsSync.readFileSync(fullPath);
  const form = new FormData();
  form.append('testid', testId);
  form.append('name', checkName);
  form.append('appName', 'Seed App');
  form.append('branch', 'master');
  form.append('suitename', 'Seed Suite');
  form.append('viewport', '1366x768');
  form.append('browserName', 'chrome');
  form.append('browserVersion', '11');
  form.append('browserFullVersion', '11.0.0.0');
  form.append('os', 'macOS');

  const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
  form.append('hashcode', hashcode);
  form.append('file', imageBuffer, path.basename(fullPath));

  const headers: Record<string, string> = {
    apikey: hashApiKey(apiKey),
  };

  const response = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
    body: form,
    headers,
  });

  return JSON.parse(response.body);
}

/**
 * Step definition: `When I seed test environment with example data`
 *
 * Seeds the test environment with a demo test session containing:
 * - A "New Check" (no baseline)
 * - A "Passed Check" (matching baseline)
 * - A "Failed Check" (differs from baseline)
 *
 * @example
 * ```gherkin
 * When I seed test environment with example data
 * ```
 */
When('I seed test environment with example data', async ({ appServer, testData }: { appServer: AppServerFixture; testData: TestStore }) => {
  const apiKey = process.env.SYNGRISI_API_KEY || '123';

  // 1. Start a test session
  const runIdent = `seed-${Date.now()}`;

  const startSessionBody = {
    app: 'Seed App',
    name: 'Seed Test Data',
    run: 'Seed Run',
    runident: `seed-${Date.now()}`,
    branch: 'master',
    suite: 'Seed Suite',
    tags: JSON.stringify(['seed']),
    os: 'macOS',
    browser: 'chrome',
    browserVersion: '11',
    browserFullVersion: '11.0.0.0',
    viewport: '1366x768',
  };

  const headers = {
    apikey: hashApiKey(apiKey),
  };

  logger.info('Starting seed test session...');
  const sessionResponse = await got.post(`${appServer.baseURL}/v1/client/startSession`, {
    json: startSessionBody,
    headers,
  });
  const sessionData = JSON.parse(sessionResponse.body);
  const testId = sessionData.id || sessionData._id;
  logger.info(`Seed test session started: ${testId}`);

  // 2. Create Checks

  // 2.1 New Check
  logger.info('Creating "New Check"...');
  await createCheck(appServer, testId, 'New Check', 'files/A.png', apiKey);

  // 2.2 Passed Check
  logger.info('Creating "Passed Check" (baseline)...');
  const passedCheck1 = await createCheck(appServer, testId, 'Passed Check', 'files/A.png', apiKey);

  // Accept it
  logger.info('Accepting "Passed Check"...');
  await requestWithSession(`${appServer.baseURL}/v1/checks/${passedCheck1._id}/accept`, testData, appServer, {
    method: 'PUT',
    json: { baselineId: passedCheck1.actualSnapshotId },
    headers: { apikey: hashApiKey(apiKey) }
  });

  logger.info('Creating "Passed Check" (match)...');
  await createCheck(appServer, testId, 'Passed Check', 'files/A.png', apiKey);

  // 2.3 Failed Check
  logger.info('Creating "Failed Check" (baseline)...');
  const failedCheck1 = await createCheck(appServer, testId, 'Failed Check', 'files/A.png', apiKey);

  // Accept it
  logger.info('Accepting "Failed Check"...');
  await requestWithSession(`${appServer.baseURL}/v1/checks/${failedCheck1._id}/accept`, testData, appServer, {
    method: 'PUT',
    json: { baselineId: failedCheck1.actualSnapshotId },
    headers: { apikey: hashApiKey(apiKey) }
  });

  logger.info('Creating "Failed Check" (diff)...');
  await createCheck(appServer, testId, 'Failed Check', 'files/B.png', apiKey);

  // Stop session
  logger.info('Stopping seed test session...');
  await got.post(`${appServer.baseURL}/v1/client/stopSession/${testId}`, {
    headers,
  });

  logger.info('Seeding complete.');
});