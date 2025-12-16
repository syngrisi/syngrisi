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
    const tableRowLocator = page.locator('tr[data-row-name]');
    await expect(tableRowLocator.first()).toBeVisible({ timeout: 30_000 });
    const availableRowNames = await tableRowLocator.evaluateAll((rows) =>
      rows.map((row) => row.getAttribute('data-row-name') ?? '').slice(0, 10)
    );
    logger.info(`Available test rows: ${availableRowNames.join(', ')}`);

    const rowLocator = tableRowLocator.filter({ hasText: testName }).first();
    await expect(rowLocator).toBeVisible({ timeout: 30_000 });
    await rowLocator.scrollIntoViewIfNeeded();
    const rowCount = await rowLocator.count();
    logger.info(`Found ${rowCount} row(s) for test ${testName}`);
    await rowLocator.evaluate((row: HTMLElement) => row.click());

    const collapseRow = rowLocator.locator('xpath=following-sibling::tr[1]');
    const collapseRowCount = await collapseRow.count();
    logger.info(`Collapse rows found after test row: ${collapseRowCount}`);
    const checksContainer = collapseRow.locator(`[data-test-checks-ready="true"]`).first();
    const containerCount = await checksContainer.count();
    logger.info(`Checks container count: ${containerCount}`);
    await expect(checksContainer).toBeVisible({ timeout: 10_000 });

    const previewLink = checksContainer.locator(`[data-check-previw-link="${checkName}"]`).first();
    const previewLinkCount = await previewLink.count();
    logger.info(`Preview links found for check "${checkName}": ${previewLinkCount}`);
    await expect(previewLink).toBeVisible({ timeout: 10_000 });
    logger.info(`Clicking preview link for check "${checkName}"`);
    await previewLink.click({ force: true });
  },
);

Then('I get the current URL', async ({ page }) => {
  const currentUrl = page.url();
  logger.info(`Current URL: ${currentUrl}`);
  // Returning the URL so the MCP scenario can assert on it.
  return `Current URL: ${currentUrl}`;
});
