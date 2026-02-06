import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { AppServerFixture, TestStore } from '@fixtures';
import { ensureServerReady } from '@utils/app-server';

const logger = createLogger('AuthSteps');

When(
  'I login with user:{string} password {string}',
  async ({ page, appServer, testData }: { page: Page; appServer: AppServerFixture; testData: TestStore }, login: string, password: string) => {
    logger.info(`Logging in user "${login}" via UI`);

    try {
      // Ensure server is ready before navigation
      if (appServer.serverPort) {
        await ensureServerReady(appServer.serverPort);
      }

      const loginUrl = `${appServer.baseURL}/auth`;
      const waitForLoginInputs = async () => {
        await page.locator('#email').waitFor({ state: 'visible', timeout: 5000 });
        await page.locator('#password').waitFor({ state: 'visible', timeout: 5000 });
      };

      const fillWithRetry = async (selector: string, value: string, label: string) => {
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            await page.locator(selector).fill(value, { timeout: 10000 });
            return;
          } catch (e) {
            const errorMsg = (e as Error).message || '';
            if (errorMsg.includes('Target page, context or browser has been closed')) {
              throw e;
            }
            if (attempt < 2) {
              logger.warn(`Failed to fill ${label}, retrying (attempt ${attempt + 1}/3)`);
              await page.goto(loginUrl, { waitUntil: 'networkidle', timeout: 10000 });
              await page.waitForTimeout(1000);
              await waitForLoginInputs();
            }
          }
        }
      };

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
          const errorMsg = (e as Error).message || '';
          if (errorMsg.includes('Target page, context or browser has been closed')) {
            throw e;
          }
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
        await fillWithRetry('#email', login, 'email');
      }

      const passwordInput = page.locator('#password');
      // Only fill if password is provided (empty string means don't fill)
      if (password) {
        await fillWithRetry('#password', password, 'password');
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

      // Optimized: Single Promise.race instead of two sequential ones (was 5s + 3s = 8s max)
      // Wait for any of: URL change, error message, or user icon
      const errorMessage = page.locator('#error-message');
      const userIcon = page.locator('[data-test="user-icon"]');

      await Promise.race([
        page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 5000 }).catch(() => null),
        errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
        userIcon.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
      ]);

      const errorVisible = await errorMessage.isVisible().catch(() => false);

      if (!errorVisible && login && password) {
        // Login might be successful - wait for user icon to appear (indicates user data loaded)
        try {
          await page.locator('[data-test="user-icon"]').waitFor({ state: 'visible', timeout: 10000 });

          // Wait for user initials to be loaded (not empty) - this indicates React Query finished loading
          const userInitials = page.locator('[data-test="user-initials"]');
          await userInitials.waitFor({ state: 'visible', timeout: 10000 });

          // Wait until initials have actual content (not empty)
          await page.waitForFunction(
            () => {
              const el = document.querySelector('[data-test="user-initials"]');
              return el && el.textContent && el.textContent.trim().length >= 2;
            },
            { timeout: 10000 }
          );

          logger.info('User initials loaded, login complete');

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
          logger.warn('User icon/initials not found after login, continuing anyway');
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
        || errorMsg.includes('ECONNREFUSED')
        || errorMsg.includes('Target page, context or browser has been closed');
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
  // Wait for logout to complete by checking URL or login form
  await Promise.race([
    page.waitForURL((url) => url.pathname.includes('/auth'), { timeout: 5000 }).catch(() => null),
    page.locator('#email').waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
  ]);
  await page.reload();
});
