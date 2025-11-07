import { When } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import * as crypto from 'crypto';

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
    logger.info(`API key set in config: ${apiKey.substring(0, 10)}...`);
  }
);

