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
    const uri = `${appServer.baseURL}/v1/logs`;

    // Get session cookie for authentication
    const sessionSid = testData.get('lastSessionId') as string | undefined;
    if (!sessionSid) {
      logger.warn('No session ID found. Creating logs without authentication.');
    }

    // Send requests in chunks to avoid overwhelming the server (ECONNRESET)
    const total = Number(num);
    const chunkSize = 1;

    // Create agents with keepAlive disabled
    const httpAgent = new http.Agent({ keepAlive: false });
    const httpsAgent = new https.Agent({ keepAlive: false });

    for (let i = 0; i < total; i++) {
      try {
        await got.post(uri, {
          headers: createAuthHeaders(appServer, {
            sessionId: sessionSid,
            path: '/v1/logs',
          }),
          json: { ...params, message: params.message?.replace(/\$/g, String(i)) || `Message ${i}` },
          retry: { limit: 5, methods: ['POST'] },
          agent: {
            http: httpAgent,
            https: httpsAgent
          }
        }).json();
      } catch (e: any) {
        logger.error(`Failed to create log message ${i}: ${e.message}`);
        throw e;
      }
      // Add a smaller delay to allow server to process
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logger.info(`Created ${num} log messages`);
  }
);
