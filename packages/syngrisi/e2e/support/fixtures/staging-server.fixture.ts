import { test as base } from 'playwright-bdd';
import { createLogger } from '@lib/logger';
import path from 'path';
import dotenv from 'dotenv';

// Load staging environment variables
const syngrisiRoot = path.resolve(__dirname, '..', '..', '..');
dotenv.config({ path: path.join(syngrisiRoot, '.env.staging') });

const logger = createLogger('StagingServer');

const STAGING_PORT = parseInt(process.env.STAGING_PORT || '5252', 10);
const STAGING_HOSTNAME = process.env.STAGING_HOSTNAME || 'localhost';
const STAGING_BASE_URL = `http://${STAGING_HOSTNAME}:${STAGING_PORT}`;

export type StagingServerFixture = {
  baseURL: string;
  backendHost: string;
  serverPort: number;
  credentials: {
    reviewerEmail: string;
    reviewerPassword: string;
    adminUsername: string;
    adminPassword: string;
    guestPassword: string;
  };
};

export const stagingServerFixture = base.extend<{ stagingServer: StagingServerFixture }>({
  stagingServer: [
    async ({}, use) => {
      logger.info(`Using staging server at ${STAGING_BASE_URL}`);

      const fixture: StagingServerFixture = {
        baseURL: STAGING_BASE_URL,
        backendHost: STAGING_HOSTNAME,
        serverPort: STAGING_PORT,
        credentials: {
          reviewerEmail: process.env.STAGING_REGULAR_USER_EMAIL || 'v_haluza_2@exadel.com',
          reviewerPassword: process.env.STAGING_REGULAR_USER_PASSWORD || '',
          adminUsername: process.env.STAGING_ADMIN_USERNAME || 'Administrator',
          adminPassword: process.env.STAGING_ADMIN_PASSWORD || '',
          guestPassword: process.env.STAGING_GUEST_PASSWORD || 'Guest',
        },
      };

      await use(fixture);
    },
    { scope: 'test' },
  ],
});
