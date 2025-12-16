import { When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import { got } from 'got-cjs';
import * as yaml from 'yaml';

const logger = createLogger('LogsHttpSteps');

When(
  'I create {string} log messages with params:',
  async (
    { appServer }: { appServer: AppServerFixture },
    num: string,
    yml: string
  ) => {
    const params = yaml.parse(yml);
    const uri = `${appServer.baseURL}/v1/logs`;
    const result = [];
    for (const i of Array.from(new Array(Number(num)).keys())) {
      result.push(
        got.post(uri, {
          json: { ...params, message: params.message?.replace(/\$/g, String(i)) || `Message ${i}` },
        }).json()
      );
    }
    await Promise.all(result);
    logger.info(`Created ${num} log messages`);
  }
);


