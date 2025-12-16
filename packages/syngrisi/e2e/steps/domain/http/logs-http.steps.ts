import { When } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { createAuthHeaders } from '@utils/http-client';
import { got } from 'got-cjs';
import * as yaml from 'yaml';
import http from 'http';
import https from 'https';

const logger = createLogger('LogsHttpSteps');

When(
  'I create {string} log messages with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    num: string,
    yml: string
  ) => {
    const params = yaml.parse(yml);


    // Get session cookie for authentication
    const sessionSid = testData.get('lastSessionId') as string | undefined;
    if (!sessionSid) {
      logger.warn('No session ID found. Creating logs without authentication.');
    }

    const total = Number(num);
    const logs = [];

    for (let i = 0; i < total; i++) {
      logs.push({ ...params, message: params.message?.replace(/\$/g, String(i)) || `Message ${i}` });
    }

    // Create agents with keepAlive disabled
    const httpAgent = new http.Agent({ keepAlive: false });
    const httpsAgent = new https.Agent({ keepAlive: false });

    try {
      await got.post(`${appServer.baseURL}/v1/logs/bulk`, {
        headers: createAuthHeaders(appServer, {
          sessionId: sessionSid,
          path: '/v1/logs/bulk',
        }),
        json: logs,
        retry: { limit: 5, methods: ['POST'] },
        agent: {
          http: httpAgent,
          https: httpsAgent
        }
      }).json();
    } catch (e: any) {
      logger.error(`Failed to create logs: ${e.message}`);
      throw e;
    }

    logger.info(`Created ${num} log messages`);
  }
);
