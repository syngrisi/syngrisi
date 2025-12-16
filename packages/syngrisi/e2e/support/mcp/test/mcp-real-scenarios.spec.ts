import fs from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import type { Readable } from 'node:stream';

import { TIMEOUTS, startBridgeCli, startNewSession, executeStep, executeBatch, shutdownSession, extractContentText } from './utils';

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
            const sessionName = 'mcp-real-scenario-1';
            // 1. Start Session before triggering any server restarts.
            await client.callTool({ name: 'sessions_clear', arguments: {} });
            const { text: initialSessionText } = await startNewSession(client, sessionName);
            expect(initialSessionText, 'Session should start successfully').toContain('Status: Success');

            // Ensure the app server is running after session startup; this step may restart the server.
            const { text: startServerText } = await executeStep(client, 'I start Server');
            expect(startServerText, 'Server should start successfully').toContain('Status: Success');
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Start a fresh session now that the server restart is complete.
            await client.callTool({ name: 'sessions_clear', arguments: {} });
            const { text: sessionText } = await startNewSession(client, sessionName);
            expect(sessionText, 'Session should start successfully after server restart').toContain('Status: Success');

            // Give the MCP session a moment to stabilize
            await new Promise((resolve) => setTimeout(resolve, 3000));

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
            await client.callTool({ name: 'sessions_clear', arguments: {} });
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
