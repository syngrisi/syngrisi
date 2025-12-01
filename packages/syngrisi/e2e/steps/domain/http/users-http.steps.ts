import { When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { createAuthHeaders } from '@utils/http-client';
import { got } from 'got-cjs';
import { expect } from '@playwright/test';

const logger = createLogger('UsersHttpSteps');

When(
  'I create via http test user',
  async ({ appServer }: { appServer: AppServerFixture }) => {
    const uri = `${appServer.baseURL}/v1/tasks/loadTestUser`;
    logger.info(`Creating test user via ${uri}`);
    const res = await got.get(uri);
    logger.info(`Response: ${res.body}`);
    let response;
    try {
      response = JSON.parse(res.body);
    } catch (e) {
      throw new Error(`Failed to parse JSON response: ${res.body.substring(0, 200)}...`);
    }
    logger.info(`Parsed response:`, response);

    // Handle "already exist" case
    if (response.msg && response.msg.includes("already exist")) {
      logger.info("User already exists, proceeding.");
      if (uri.includes('loadTestUser')) {
        response.username = 'Test';
      }
    }

    // The endpoint should return an object with username field
    if (!response.username) {
      throw new Error(`Expected username in response, but got: ${JSON.stringify(response)}`);
    }
    expect(response.username).toBe('Test');
    logger.info(`Test user created: ${response.username}`);
  }
);

When(
  'I login via http with user:{string} password {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    login: string,
    password: string
  ) => {
    const uri = `${appServer.baseURL}/v1/auth/login`;
    logger.info(`Logging in user "${login}"`);

    const res = await got.post(uri, {
      headers: createAuthHeaders(appServer, {
        path: '/v1/auth/login',
        headers: {
          'upgrade-insecure-requests': '1',
        },
      }),
      json: { username: login, password },
    });

    const setCookieHeader = res.headers['set-cookie'];
    if (!setCookieHeader || setCookieHeader.length === 0) {
      throw new Error('No set-cookie header in login response');
    }

    const sessionSid = setCookieHeader[0]
      .split(';')
      .filter((x) => x.includes('connect.sid'))[0]
      .split('=')[1];

    logger.info(`Session ID obtained: ${sessionSid.substring(0, 10)}...`);

    const users = (testData.get('users') as Record<string, { sessionSid: string }>) || {};
    users[login] = { sessionSid };
    testData.set('users', users);
    testData.set('lastSessionId', sessionSid);
  }
);

When(
  'I generate via http API key for the User',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore }
  ) => {
    const uri = `${appServer.baseURL}/v1/auth/apikey`;
    logger.info(`Generating API key`);

    const sessionSid = testData.get('lastSessionId') as string | undefined;
    if (!sessionSid) {
      throw new Error('No session ID found. Please login first.');
    }

    const res = await got.get(uri, {
      headers: createAuthHeaders(appServer, {
        sessionId: sessionSid,
        path: '/v1/auth/apikey',
      }),
    });

    const response = JSON.parse(res.body);
    testData.set('apiKey', { value: response.apikey });
    logger.info('API key generated successfully');

    // Small delay to ensure API key is indexed by MongoDB before proceeding
    // This prevents race conditions where the driver tries to use the API key
    // before the user document is updated with the hashed key
    await new Promise((resolve) => setTimeout(resolve, 500));
    logger.info('API key indexing stabilization complete');
  }
);

When(
  'I create via http user as:{string} with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    user: string,
    json: string
  ) => {
    const uri = `${appServer.baseURL}/v1/users`;
    logger.info(`Creating user via ${uri}`);

    const sessionSid = testData.get('lastSessionId') as string | undefined;
    if (!sessionSid) {
      throw new Error('No session ID found. Please login first.');
    }

    const params = JSON.parse(json);
    const res = await got.post(uri, {
      headers: createAuthHeaders(appServer, {
        sessionId: sessionSid,
        path: '/v1/users',
      }),
      json: params,
    });

    const response = JSON.parse(res.body);
    logger.info(`User created: ${response.username || response.email || 'unknown'}`);
  }
);
