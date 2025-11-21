import { Given, When } from '@fixtures';
import { createLogger } from '@lib/logger';
import type { Page } from '@playwright/test';
import type { AppServerFixture } from '@fixtures';
import { clearDatabase } from '@utils/db-cleanup';

const logger = createLogger('AppSteps');

Given('the Syngrisi application is running', async ({ appServer }: { appServer: AppServerFixture }) => {
  if (!appServer.baseURL) {
    throw new Error('Syngrisi application server is not running');
  }
});

Given('the database is cleared', async ({ appServer }: { appServer: AppServerFixture }) => {
  logger.info('Clearing database');
  await clearDatabase();
  // Ensure test users will be created on server restart
  process.env.SYNGRISI_TEST_MODE = '1'; // Backend expects '1', not 'true'
  // Restart server to recreate Guest user and test users (as in original WebdriverIO tests)
  logger.info('Restarting server to recreate Guest user and test users');
  await appServer.restart();
});

When('I open the app', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }) => {
  logger.info(`Opening app at ${appServer.baseURL}`);
  await page.goto(appServer.baseURL);
  await page.waitForLoadState('networkidle');
});

When('I clear local storage', async ({ page }: { page: Page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
  logger.info('Local storage cleared');
});
