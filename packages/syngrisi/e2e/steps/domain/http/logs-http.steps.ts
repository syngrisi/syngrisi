import { When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import { createLogger } from '@lib/logger';
import { got } from 'got-cjs';
import * as yaml from 'yaml';
import http from 'http';
import https from 'https';

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

    // Send requests in chunks to avoid overwhelming the server (ECONNRESET)
    const total = Number(num);
    const chunkSize = 1;

    // Create agents with keepAlive disabled
    const httpAgent = new http.Agent({ keepAlive: false });
    const httpsAgent = new https.Agent({ keepAlive: false });

    for (let i = 0; i < total; i += chunkSize) {
      const chunk = Array.from({ length: Math.min(chunkSize, total - i) }, (_, j) => i + j);
      try {
        await Promise.all(chunk.map(idx =>
          got.post(uri, {
            json: { ...params, message: params.message?.replace(/\$/g, String(idx)) || `Message ${idx}` },
            retry: { limit: 5, methods: ['POST'] },
            agent: {
              http: httpAgent,
              https: httpsAgent
            }
          }).json()
        ));
      } catch (e: any) {
        logger.error(`Failed to create log message chunk ${i}: ${e.message}`);
        throw e;
      }
      // Add a delay to allow server to process
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    logger.info(`Created ${num} log messages`);
  }
);
