import { test as baseTest, expect } from '@playwright/test';
import { mergeTests } from '@playwright/test';
import { testEngineFixture } from '../../fixtures/test-engine.fixture';
import { appServerFixture } from '../../fixtures/app-server.fixture';
import { testDataFixture } from '../../fixtures/test-data.fixture';
import { testManagerFixture } from '../../fixtures/test-manager.fixture';

const test = mergeTests(appServerFixture, testEngineFixture, testDataFixture, testManagerFixture);


test.describe('MCP Session with App Open and UI Check', () => {
  test('should start MCP session, open app, verify user menu, and get URL', async ({ page, testEngine, appServer }) => {
    // 1. Start MCP session
    // For now, using a fixed session name. In a real scenario, you might generate one.
    const sessionName = 'bench_session_direct_test';
    const headless = true; // As per user's request

    // Ensure the MCP server is started if not already
    if (!testEngine.isRunning()) {
      await testEngine.start();
    }
    expect(testEngine.client).not.toBeNull(); // Moved after start()
    const result = await testEngine.client?.callTool('session_start_new', { sessionName, headless });
    console.log(`MCP session start result: ${JSON.stringify(result)}`);
    expect(result?.status).toBe('success');

    // 2. Open the app
    await page.goto(appServer.baseURL);
    console.log(`App opened at: ${appServer.baseURL}`);

    // 3. Verify that there is a button with aria-label "User menu for Syngrisi Guest"
    const userMenuButton = page.locator('button[aria-label="User menu for Syngrisi Guest"]');
    await expect(userMenuButton).toBeVisible();
    console.log('User menu button found and visible.');

    // 4. Return the current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
  });
});
