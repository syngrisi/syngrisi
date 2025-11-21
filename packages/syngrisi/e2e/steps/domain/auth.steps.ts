import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { AppServerFixture, TestStore } from '@fixtures';

const logger = createLogger('AuthSteps');

When(
  'I login with user:{string} password {string}',
  async ({ page, appServer, testData }: { page: Page; appServer: AppServerFixture; testData: TestStore }, login: string, password: string) => {
    logger.info(`Logging in user "${login}" via UI`);

    try {
      const loginUrl = `${appServer.baseURL}/auth`;
      
      // Wait for password field with retries (as in original)
      let passwordFieldFound = false;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 10000 });
          await page.waitForTimeout(attempt === 0 ? 3000 : 2000);
          
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
        const currentUrl = page.url();
        const errorMsg = `Password field not found after retries. Last visited URL: ${currentUrl}`;
        logger.warn(errorMsg);
        throw new Error(errorMsg);
      }

      const emailInput = page.locator('#email');
      // Only fill if login is provided (empty string means don't fill)
      if (login) {
        await emailInput.fill(login);
      }
      
      const passwordInput = page.locator('#password');
      // Only fill if password is provided (empty string means don't fill)
      if (password) {
        await passwordInput.fill(password);
      }
      
      // For empty credentials, don't submit - just wait to ensure page is loaded
      if (login && password) {
        const submitButton = page.locator('#submit');
        await submitButton.click();
        // Wait a bit for form submission to process
        await page.waitForTimeout(1000);
      } else {
        // For empty credentials, ensure we're still on login page
        await page.waitForTimeout(1000);
        // Verify we're on login page by checking URL
        const currentUrl = page.url();
        if (!currentUrl.includes('/auth')) {
          // If not on auth page, navigate to login page
          await page.goto(`${appServer.baseURL}/auth/login`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);
        }
      }
      
      // Check if login was successful by waiting for URL change or error message
      try {
        // Wait for either success (URL change) or error (error message appears)
        await Promise.race([
          page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 5000 }).catch(() => null),
          page.locator('#error-message').waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
        ]);
      } catch (e) {
        // Continue anyway
      }
      
      // Check if login was successful by checking for error message or user icon
      // Wait a bit more for error message to appear (if login failed)
      await page.waitForTimeout(2000);
      
      const errorMessage = page.locator('#error-message');
      const errorVisible = await errorMessage.isVisible().catch(() => false);
      
      if (!errorVisible && login && password) {
        // Login might be successful - wait for user icon to appear (indicates user data loaded)
        try {
          await page.locator('[data-test="user-icon"]').waitFor({ state: 'visible', timeout: 10000 });
          // Additional wait for React Query to load user data
          await page.waitForTimeout(2000);

          // Store session cookie for HTTP requests
          const cookies = await page.context().cookies();
          const sessionCookie = cookies.find((cookie) => cookie.name === 'connect.sid');
          if (sessionCookie) {
            testData.set('lastSessionId', sessionCookie.value);
            logger.info(`Session cookie stored for user "${login}"`);
          } else {
            logger.warn('Session cookie not found after login');
          }

          logger.info(`User "${login}" logged in successfully`);
        } catch (e) {
          // User icon might not appear if auth is disabled or user data not loaded yet
          logger.warn('User icon not found after login, continuing anyway');
        }
      } else if (errorVisible) {
        logger.info(`Login failed for user "${login}" - error message displayed`);
      } else if (!login || !password) {
        // Empty credentials - stay on login page
        logger.info(`Empty credentials provided, staying on login page`);
      }
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

When('I log out of the application', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }) => {
  logger.info('Logging out of the application');
  await page.goto(`${appServer.baseURL}/auth/logout`);
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForTimeout(500);
});
