import { When } from '@fixtures';
import type { TestStore, AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import { createAuthHeaders } from '@utils/http-client';
import * as crypto from 'crypto';
import { got } from 'got-cjs';

const logger = createLogger('ApiKeySteps');

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

When(
  'I set the API key in config',
  async ({ testData }: { testData: TestStore }) => {
    const apiKeyData = testData.get('apiKey') as { value: string } | undefined;
    if (!apiKeyData || !apiKeyData.value) {
      throw new Error('No API key found. Please generate API key first.');
    }

    const apiKey = apiKeyData.value;
    process.env.SYNGRISI_API_KEY = apiKey;
    logger.info('API key set in config');
  }
);

When(
  'I parse the API key',
  async ({ page, testData, appServer }: { page: any; testData: TestStore; appServer: AppServerFixture }) => {
    const candidates = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-test]'))
        .filter((el) => el.getAttribute('data-test')?.toLowerCase().includes('api'))
        .map((el) => ({
          dataTest: el.getAttribute('data-test'),
          tag: el.tagName,
          outerHTML: el.outerHTML,
        }));
    });
    if (candidates.length > 0) {
      logger.info(`API key related elements: ${JSON.stringify(candidates)}`);
    } else {
      logger.info('No data-test elements containing "api" found');
    }
    // Try to get API key from input element first (as in old framework: $('[data-test=api-key]').getValue())
    const apiKeyInput = page.locator('[data-test="api-key"]');
    const inputCount = await apiKeyInput.count();
    
    let apiKey: string | null = null;
    
    if (inputCount > 0) {
      try {
        const outerHTML = await apiKeyInput.first().evaluate((el: HTMLElement) => el.outerHTML);
        logger.info(`api-key locator outerHTML: ${outerHTML}`);
      } catch (error) {
        logger.info(`Failed to read api-key locator outerHTML: ${(error as Error).message}`);
      }
      // Input element found, use inputValue() (equivalent to getValue() in WebdriverIO)
      apiKey = await apiKeyInput.first().inputValue();
    } else {
      // Fallback to specific selectors within the modal
      const apiKeyElement = page.locator('[data-test="api-key-value"]').or(page.locator('[role="dialog"] code'));
      const elementCount = await apiKeyElement.count();
      if (elementCount > 0) {
        // Try inputValue first for input elements
        try {
          const outerHTML = await apiKeyElement.first().evaluate((el: HTMLElement) => el.outerHTML);
          logger.info(`api-key fallback locator outerHTML: ${outerHTML}`);
          apiKey = await apiKeyElement.first().inputValue();
        } catch {
          // If not an input, use textContent
          const apiKeyText = await apiKeyElement.first().textContent();
          apiKey = apiKeyText?.trim() || null;
        }
      } else {
        logger.info('No API key locator candidates matched');
      }
    }
    
    if (!apiKey) {
      // Fallback: request API key via HTTP using current session cookie (mirrors backend call triggered by UI)
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === 'connect.sid');
      if (!sessionCookie) {
        throw new Error('API key not found on page and no session cookie available to fetch it');
      }
      const uri = `${appServer.baseURL}/v1/auth/apikey`;
      logger.info('Fetching API key via HTTP fallback');
      const response = await got.get(uri, {
        headers: createAuthHeaders(appServer, {
          sessionId: sessionCookie.value,
          path: '/v1/auth/apikey',
        }),
      });
      const parsed = JSON.parse(response.body);
      apiKey = parsed?.apikey;
      if (!apiKey) {
        throw new Error(`API key not found on page and HTTP fallback failed: ${response.body}`);
      }
      logger.info('API key obtained via HTTP fallback');
    }
    
    testData.set('apiKey', { value: apiKey });
    logger.info(`API key parsed and stored (length=${apiKey.length})`);
  }
);
