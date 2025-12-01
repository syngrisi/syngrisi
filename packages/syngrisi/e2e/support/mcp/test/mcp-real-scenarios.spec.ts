import fs from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import type { Readable } from 'node:stream';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { findEphemeralPort } from '../utils/port-utils';

const NPX_BIN = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const BRIDGE_RELATIVE_PATH = ['support', 'mcp', 'bridge-cli.ts'];

const TIMEOUTS = {
    LIST_TOOLS: 120_000,
    CALL_TOOL: 60_000,
    START_SESSION: 120_000,
    EXECUTE_STEP: 180_000,
    TEST_SUITE: 240_000,
} as const;

const extractContentText = (payload: unknown): string => {
    if (!payload || typeof payload !== 'object') {
        return '';
    }

    const container = 'result' in payload && payload.result && typeof payload.result === 'object'
        ? payload.result
        : payload;

    if (!container || typeof container !== 'object') {
        return '';
    }

    const content = (container as { content?: unknown }).content;
    if (!Array.isArray(content) || !content.length) {
        return '';
    }

    const firstBlock = content[0];
    if (!firstBlock || typeof firstBlock !== 'object') {
        return '';
    }

    const text = (firstBlock as { text?: unknown }).text;
    return typeof text === 'string' ? text : '';
};

type BridgeCliOptions = {
    env?: Record<string, string>;
    attachmentName?: string;
};

type BridgeCliSetup = {
    client: Client;
    asyncErrors: Error[];
    cleanup: () => Promise<void>;
    transportClosed: Promise<void>;
};

const startBridgeCli = async (
    testInfo: TestInfo,
    options: BridgeCliOptions = {},
): Promise<BridgeCliSetup> => {
    const { env: envOverrides = {}, attachmentName = 'bridge-cli-stderr' } = options;

    const e2eRoot = path.resolve(__dirname, '..', '..', '..');
    const commandArgs = ['tsx', path.join(...BRIDGE_RELATIVE_PATH)];
    const workerInstanceId = `bridge-${testInfo.workerIndex}-${testInfo.retry}-${randomUUID()}`;
    const portOverride = envOverrides.MCP_DEFAULT_PORT;
    const preferredPort = portOverride ?? String(await findEphemeralPort());

    // Compute unique worker index for isolation in parallel tests
    // Use high offset (100+) per worker to avoid conflicts with main Playwright workers
    const parentWorkerIndex = testInfo.parallelIndex;
    const uniqueWorkerIndex = 100 + (parentWorkerIndex * 100);

    const transport = new StdioClientTransport({
        command: NPX_BIN,
        args: commandArgs,
        cwd: e2eRoot,
        env: {
            ...(process.env as Record<string, string>),
            MCP_KEEP_ALIVE: '0', // Default to non-keepalive mode for tests
            ZENFLOW_WORKER_INSTANCE: workerInstanceId,
            MCP_DEFAULT_PORT: preferredPort,
            E2E_HEADLESS: process.env.PLAYWRIGHT_HEADED === '1' ? '0' : '1',
            // Pass unique worker index for proper isolation in spawned MCP servers
            TEST_WORKER_INDEX: String(uniqueWorkerIndex),
            ...envOverrides,
        },
        stderr: 'pipe',
    });

    const stderrChunks: string[] = [];
    const stderrStream = transport.stderr;
    if (stderrStream && 'setEncoding' in stderrStream) {
        (stderrStream as Readable).setEncoding('utf8');
    }
    stderrStream?.on('data', (chunk: string | Buffer) => {
        stderrChunks.push(typeof chunk === 'string' ? chunk : chunk.toString('utf8'));
    });

    const asyncErrors: Error[] = [];
    transport.onerror = (error: Error | unknown) => {
        asyncErrors.push(error instanceof Error ? error : new Error(String(error)));
    };

    const transportClosed = new Promise<void>((resolve) => {
        transport.onclose = () => resolve();
    });

    const client = new Client(
        {
            name: 'zenflow-bridge-cli-test-real',
            version: '0.0.0',
        },
        {
            capabilities: {},
        },
    );

    client.onerror = (error: Error | unknown) => {
        asyncErrors.push(error instanceof Error ? error : new Error(String(error)));
    };

    await client.connect(transport);

    const cleanup = async () => {
        await Promise.allSettled([
            (async () => {
                try {
                    await client.close();
                } catch {
                    // ignore double-close errors
                }
            })(),
            (async () => {
                try {
                    await transport.close();
                } catch {
                    // ignore double-close errors
                }
            })(),
        ]);
        await transportClosed.catch(() => {
            /* ignore */
        });

        if (testInfo.status !== 'passed' && stderrChunks.length) {
            await testInfo.attach(attachmentName, {
                body: stderrChunks.join(''),
                contentType: 'text/plain',
            });
        }
    };

    return { client, asyncErrors, cleanup, transportClosed };
};

const startNewSession = async (client: Client, sessionName: string) => {
    const result = await client.callTool(
        {
            name: 'session_start_new',
            arguments: { sessionName },
        },
        undefined,
        { timeout: TIMEOUTS.START_SESSION },
    );
    return { result, text: extractContentText(result) };
};

const executeStep = async (client: Client, stepText: string, stepDocstring?: string) => {
    const result = await client.callTool(
        {
            name: 'step_execute_single',
            arguments: { stepText, stepDocstring },
        },
        undefined,
        { timeout: TIMEOUTS.EXECUTE_STEP },
    );
    return { result, text: extractContentText(result) };
};

const executeBatch = async (
    client: Client,
    steps: Array<{ stepText: string; stepDocstring?: unknown } | string>,
) => {
    const result = await client.callTool(
        {
            name: 'step_execute_many',
            arguments: { steps },
        },
        undefined,
        { timeout: TIMEOUTS.EXECUTE_STEP },
    );
    return { result, text: extractContentText(result) };
};

const shutdownSession = async (client: Client) => {
    await client.notification({
        method: 'notifications/shutdown',
        params: {},
    });
};

test.describe('MCP Real Scenarios', () => {
    // Run serially to avoid port conflicts - these tests start real app servers
    test.describe.configure({ mode: 'serial' });

    // Strict instructions for Gemini (simulated):
    // "You are a QA automation agent. Your goal is to verify the visual regression workflow.
    // 1. Start a new session named 'mcp-real-scenario-1'.
    // 2. Create a new test with a check using 'files/A.png'.
    // 3. Once created, perform a batch execution to:
    //    a. Refresh the page to see the new test.
    //    b. Unfold the test row.
    //    c. Open the check.
    //    d. Accept the check.
    // Ensure all steps pass."

    test('Real user flow: Create, Open, and Accept Check using MCP tools', async ({ }, testInfo) => {
        test.setTimeout(TIMEOUTS.TEST_SUITE);

        const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
            attachmentName: 'mcp-real-scenario-stderr',
        });

        try {
            // 1. Start Session
            const { text: sessionText } = await startNewSession(client, 'mcp-real-scenario-1');
            expect(sessionText, 'Session should start successfully').toContain('Status: Success');

            // Wait for server to be fully ready (socket hang up mitigation)
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Start the app server explicitly before creating tests
            const { text: startServerText } = await executeStep(client, 'I start Server');
            expect(startServerText, 'Server should start successfully').toContain('Status: Success');

            // Wait for server to be fully ready (needs more time in CI/parallel environment)
            await new Promise(resolve => setTimeout(resolve, 15000));

            // 2. Create Test with Check (Single Step with DocString)
            // Using 'I create "1" tests with:' uses keepOriginalTestNames=true
            const runName = `mcp-run-${randomUUID()}`;
            const createTestStep = 'I create "1" tests with:';
            const createTestYaml = `
testName: "mcp-test"
run: "${runName}"
checks:
  - checkName: "mcp-check-1"
    filePath: "files/A.png"
`;
            const { text: createText } = await executeStep(client, createTestStep, createTestYaml);
            expect(createText, 'Test creation step should succeed').toContain('Status: Success');

            // 3. Accept Check via HTTP (more reliable than UI)
            const { text: acceptText } = await executeStep(client, 'I accept via http the 1st check with name "mcp-check-1"');
            expect(acceptText, 'Check acceptance should succeed').toContain('Status: Success');

            // 4. Navigate and verify the accepted check
            const runSelector = `//*[@data-test='navbar-item-name' and contains(., '${runName}')]`;
            const batchSteps = [
                'I go to "runs" page',
                'I wait 5 seconds',
                'I refresh page',
                `Then the element with locator "${runSelector}" should be visible for 30 sec`,
                `I click element with locator "${runSelector}"`,
                'I wait 3 seconds',
                'I unfold the test "mcp-test"',
                // Verify the check is accepted (check icon should be green/filled)
                `Then the element with locator "[data-test='check-accept-icon'][data-popover-icon-name='mcp-check-1'] svg" should have has attribute "data-test-icon-type=fill"`
            ];

            const { result: batchResult, text: batchText } = await executeBatch(client, batchSteps);

            console.log('Batch Execution Result:', batchText);

            expect(batchResult.isError ?? false, 'Batch execution should succeed').toBe(false);
            expect(batchText, 'Batch execution should return success status').toContain('Status: Success');
            expect(batchText, 'Batch execution summary should list steps').toContain('Executed 8 steps successfully');
            expect(batchText, 'Batch execution summary should verify check acceptance').toContain('data-test-icon-type=fill');

            await shutdownSession(client);

            expect(asyncErrors, 'No async errors should occur').toEqual([]);
        } finally {
            // Print backend logs if available (need to access fixture somehow, but client doesn't expose it directly)
            // However, the test runner output usually includes logs if configured.
            // We can't easily access appServer fixture here because it's inside the bridge.
            await cleanup();
        }
    });

    test('Real user flow: Handle invalid step in batch', async ({ }, testInfo) => {
        test.setTimeout(TIMEOUTS.TEST_SUITE);
        const { client, asyncErrors, cleanup } = await startBridgeCli(testInfo, {
            attachmentName: 'mcp-real-scenario-invalid-stderr',
        });

        try {
            await startNewSession(client, 'mcp-real-scenario-2');

            const batchSteps = [
                'I do something impossible',
            ];
            const { result, text } = await executeBatch(client, batchSteps);

            expect(result.isError).toBe(true);
            expect(text).toContain('ERROR: Step validation failed');

            await shutdownSession(client);
        } finally {
            await cleanup();
        }
    });
});
