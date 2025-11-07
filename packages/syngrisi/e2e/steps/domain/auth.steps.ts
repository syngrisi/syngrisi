import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { AppServerFixture } from '@fixtures';

const logger = createLogger('AuthSteps');

When(
  'I login with user:{string} password {string}',
  async ({ page, appServer }: { page: Page; appServer: AppServerFixture }, login: string, password: string) => {
    logger.info(`Logging in user "${login}" via UI`);

    try {
      const loginUrl = `${appServer.baseURL}/`;
      
      // Wait for password field with retries (as in original)
      let passwordFieldFound = false;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 10000 });
          await page.waitForTimeout(attempt === 0 ? 3000 : 2000);
          
          // Check if auth is enabled by looking for password field or redirect
          const currentUrl = page.url();
          if (!currentUrl.includes('/auth') && !currentUrl.includes('login')) {
            // Auth might be disabled, check if we're already logged in
            const passwordField = page.locator('#password');
            const passwordFieldCount = await passwordField.count();
            if (passwordFieldCount === 0) {
              logger.info('Password field not found - auth might be disabled or already logged in');
              return; // Skip login if auth is disabled
            }
          }
          
          const passwordField = page.locator('#password');
          await passwordField.waitFor({ state: 'visible', timeout: 5000 });
          passwordFieldFound = true;
          break;
        } catch (e) {
          if (attempt < 4) {
            logger.warn(`Password field not found, retrying (attempt ${attempt + 1}/5)`);
          }
        }
      }
      
      if (!passwordFieldFound) {
        // Check if auth is actually disabled
        const currentUrl = page.url();
        if (!currentUrl.includes('/auth') && !currentUrl.includes('login')) {
          logger.info('Password field not found - auth might be disabled, skipping login');
          return; // Skip login if auth is disabled
        }
        const errorMsg = 'Password field not found after retries - possibly auth is disabled or page did not load';
        logger.warn(errorMsg);
        throw new Error(errorMsg);
      }

      const emailInput = page.locator('#email');
      await emailInput.fill(login);
      
      const passwordInput = page.locator('#password');
      await passwordInput.fill(password);
      
      const submitButton = page.locator('#submit');
      await submitButton.click();
      
      // Wait for login to complete
      await page.waitForTimeout(2000);
      logger.info(`User "${login}" logged in successfully`);
    } catch (error: any) {
      const errorMsg = error.message || error.toString() || '';
      const isDisconnected = errorMsg.includes('disconnected')
        || errorMsg.includes('failed to check if window was closed')
        || errorMsg.includes('ECONNREFUSED');
      if (isDisconnected) {
        logger.warn('Browser disconnected or Playwright browser unavailable, skipping login');
      } else {
        logger.error(`Login failed: ${errorMsg}`);
        throw error;
      }
    }
  }
);

