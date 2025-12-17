import { Given, When } from '@fixtures';
import { createLogger } from '@lib/logger';
import type { Page } from '@playwright/test';
import type { AppServerFixture } from '@fixtures';
import { clearDatabase } from '@utils/db-cleanup';
import { ensureServerReady } from '@utils/app-server';

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
  // IMPORTANT: Force restart to ensure users are recreated after database clear
  await appServer.restart(true);

  // Wait for server to be fully ready with users created
  logger.info('Waiting for users to be created in database...');
  const got = (await import('got-cjs')).got;
  const maxAttempts = 30;
  let attempt = 0;
  let usersReady = false;

  while (attempt < maxAttempts && !usersReady) {
    attempt++;
    try {
      // Try to get app info which will only work when server is fully initialized
      const response = await got(`${appServer.baseURL}/v1/app/info`, {
        timeout: { request: 2000 },
        retry: { limit: 0 },
      });

      if (response.statusCode === 200) {
        logger.info(`Server is responding (attempt ${attempt}/${maxAttempts})`);
        // Give a bit more time for users to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
        usersReady = true;
      }
    } catch (error) {
      if (attempt < maxAttempts) {
        logger.warn(`Server not ready yet, waiting... (attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  if (!usersReady) {
    throw new Error('Server did not become ready in time after restart');
  }

  logger.info('✓ Server is ready with users created');
});

When('I open the app', async ({ page, appServer, testData }: { page: Page; appServer: AppServerFixture; testData: any }) => {
  logger.info(`Opening app at ${appServer.baseURL}`);
  logger.info(`SSO_ENABLED=${process.env.SSO_ENABLED}, SSO_PROTOCOL=${process.env.SSO_PROTOCOL}`);

  if (!appServer.baseURL) {
    logger.warn('App server baseURL is empty, starting server before navigation');
    await appServer.start();
  }

  // Ensure server is ready before navigation to avoid ERR_CONNECTION_REFUSED
  const ensureReadyWithRetry = async () => {
    if (!appServer.serverPort) return;
    try {
      await ensureServerReady(appServer.serverPort);
    } catch (error) {
      logger.warn(`Server not ready on port ${appServer.serverPort}, restarting once. Error: ${String(error)}`);
      await appServer.restart(true);
      if (appServer.serverPort) {
        await ensureServerReady(appServer.serverPort);
      }
    }
  };

  await ensureReadyWithRetry();

  const navigate = async () => {
    await page.goto(appServer.baseURL);
  };

  try {
    await navigate();
  } catch (error) {
    logger.warn(`Navigation failed (likely server not ready). Restarting server and retrying. Error: ${String(error)}`);
    await appServer.restart(true);
    await ensureReadyWithRetry();
    await navigate();
  }
  logger.info(`After goto - URL: ${page.url()}`);

  await page.waitForLoadState('networkidle');
  logger.info(`After networkidle - URL: ${page.url()}, Title: ${await page.title()}`);

  // Ensure templated URLs work (e.g., <syngrisiUrl> in features)
  const normalizedUrl = appServer.baseURL.endsWith('/') ? appServer.baseURL : `${appServer.baseURL}/`;
  testData?.set?.('syngrisiUrl', normalizedUrl);
});

When('I clear local storage', async ({ page }: { page: Page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
  logger.info('Local storage cleared');
});
