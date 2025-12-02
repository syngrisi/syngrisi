import { Given, Then, When } from '@fixtures';
import type { TestEngineFixture } from '@fixtures/test-engine.fixture';
import { expect } from '@playwright/test';
import { createLogger } from '@lib/logger';

const logger = createLogger('McpSteps');

Given(
  'I start a new MCP session named {string} with headless {word}',
  async ({ testEngine }: { testEngine: TestEngineFixture }, sessionName: string, headlessStr: string) => {
    const headless = headlessStr === 'true';
    expect(testEngine.client).not.toBeNull();
    // Ensure the MCP server is started if not already
    if (!testEngine.isRunning()) {
      await testEngine.start();
    }
    const result = await testEngine.client?.callTool('session_start_new', { sessionName, headless });
    logger.info(`MCP session start result: ${JSON.stringify(result)}`);
    expect(result?.status).toBe('success');
  },
);



When(
  'I find test {string} in the table, expand it, and open the first check {string}',
  async ({ page }: { page: any }, testName: string, checkName: string) => {
    // Find the test in the table
    const testRow = page.locator(`[aria-label="Test row for ${testName}"]`);
    await expect(testRow).toBeVisible();

    // Expand the test row
    const expandButton = testRow.locator('[aria-label="Expand test row"]');
    await expandButton.click();

    // Open the first check
    const checkRow = page.locator(`[aria-label="Check row for ${checkName}"]`).first();
    await expect(checkRow).toBeVisible();
    await checkRow.click();
  },
);

Then('I get the current URL', async ({ page }) => {
  const currentUrl = page.url();
  logger.info(`Current URL: ${currentUrl}`);
  // In a real scenario, you might want to return this URL to the user or assert something.
  // For now, we'll just log it.
});
