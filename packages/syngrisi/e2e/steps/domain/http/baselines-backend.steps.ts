import { Given, Then, When } from '@fixtures';
import type { AppServerFixture, TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession, createAuthHeaders } from '@utils/http-client';
import { expect } from '@playwright/test';
import { got } from 'got-cjs';
import * as yaml from 'yaml';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

const logger = createLogger('BaselinesBackendSteps');

type SeedContext = {
  usageSnapshotId?: string;
  orphanSnapshotId?: string;
  usedBaselineName?: string;
  orphanBaselineName?: string;
};

Then(
  'via http baselines with includeUsage filtered by name {string} should match:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    nameFilter: string,
    yml: string
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?includeUsage=true&limit=0&filter={"$and":[{"name":{"$regex":"${nameFilter}","$options":"im"}}]}`;
    logger.info(`Fetching baselines from: ${uri}`);
    const response = await requestWithSession(uri, testData, appServer);
    const baselines = response.json.results;
    logger.info(`Response totalResults: ${response.json.totalResults}, results count: ${baselines?.length}`);
    logger.info(`Received baselines: ${JSON.stringify(baselines?.map((b: any) => b.name))}`);
    const expected = JSON.parse(yml);

    expected.forEach((item: any) => {
      const found = baselines.find((b: any) => b.name === item.name);
      logger.info(`Looking for "${item.name}", found: ${found ? 'yes' : 'no'}`);
      expect(found).toBeTruthy();
      expect(found.usageCount).toBe(item.usageCount);
    });
  }
);

Then(
  'via http tests filtered by seeded baseline snapshot should return {int} items',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    expected: number
  ) => {
    const seed = testData.get('baselineSeed') as SeedContext;
    if (!seed?.usageSnapshotId) {
      throw new Error('Missing seeded snapshot id');
    }
    const uri = `${appServer.baseURL}/v1/tests?limit=0&baselineSnapshotId=${seed.usageSnapshotId}`;
    const response = await requestWithSession(uri, testData, appServer);
    expect(response.json.results.length).toBe(expected);
  }
);

When(
  'I run orphan baselines task via http with dryRun {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    dryRun: string
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/task_handle_orphan_baselines?dryRun=${dryRun}`;
    const response = await requestWithSession(uri, testData, appServer);
    expect(response.raw?.statusCode).toBe(200);
  }
);

Then(
  'via http baseline named {string} exist exactly {int} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    count: number
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking baseline count for "${name}" at: ${uri}`);
    const response = await requestWithSession(uri, testData, appServer);
    logger.info(`Baseline "${name}" count: totalResults=${response.json.totalResults}, results.length=${response.json.results?.length}`);
    if (response.json.results?.length) {
      logger.info(`Found baselines: ${JSON.stringify(response.json.results.map((b: any) => b.name))}`);
    }
    expect(response.json.results.length).toBe(count);
  }
);

// =============================================================================
// Universal HTTP-based seeding steps with YAML docstring
// =============================================================================

function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha512').update(apiKey).digest('hex');
}

interface BaselineConfig {
  name: string;
  checkName?: string;
  filePath?: string;
  browserName?: string;
  viewport?: string;
  os?: string;
}

interface UserConfig {
  username: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  baselines?: BaselineConfig[];
}

interface SeedConfig {
  adminUser?: {
    username: string;
    password: string;
  };
  users: UserConfig[];
}

/**
 * Universal step for seeding baselines with different owners via HTTP API.
 *
 * Example usage:
 * ```gherkin
 * Given I seed via http baselines with owners:
 *     """
 *     adminUser:
 *       username: Test
 *       password: "123456aA-"
 *     users:
 *       - username: admin@test.com
 *         password: Password-123
 *         role: admin
 *         firstName: Admin
 *         lastName: User
 *         baselines:
 *           - name: baseline-admin
 *             checkName: Check Admin
 *             filePath: files/A.png
 *       - username: user@test.com
 *         password: Password-123
 *         role: user
 *         firstName: Regular
 *         lastName: User
 *         baselines:
 *           - name: baseline-user
 *             checkName: Check User
 *             filePath: files/A.png
 *     """
 * ```
 */
Given(
  'I seed via http baselines with owners:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ymlConfig: string
  ) => {
    const config: SeedConfig = yaml.parse(ymlConfig);

    // Step 1: Login as admin user to create other users
    const adminUsername = config.adminUser?.username || 'Test';
    const adminPassword = config.adminUser?.password || '123456aA-';

    logger.info(`Logging in as admin user "${adminUsername}"`);
    const loginUri = `${appServer.baseURL}/v1/auth/login`;
    const loginRes = await got.post(loginUri, {
      headers: createAuthHeaders(appServer, {
        path: '/v1/auth/login',
        headers: { 'upgrade-insecure-requests': '1' },
      }),
      json: { username: adminUsername, password: adminPassword },
    });

    const setCookieHeader = loginRes.headers['set-cookie'];
    if (!setCookieHeader || setCookieHeader.length === 0) {
      throw new Error('No set-cookie header in login response');
    }
    const adminSessionSid = setCookieHeader[0]
      .split(';')
      .filter((x) => x.includes('connect.sid'))[0]
      .split('=')[1];

    logger.info(`Admin session obtained`);

    // Store sessions for each user
    const userSessions: Map<string, { sessionSid: string; apiKey: string }> = new Map();

    // Step 2: Create users and get their sessions/API keys
    for (const user of config.users) {
      // Create user via HTTP API
      logger.info(`Creating user "${user.username}" with role "${user.role}"`);
      const createUserUri = `${appServer.baseURL}/v1/users`;

      try {
        await got.post(createUserUri, {
          headers: createAuthHeaders(appServer, {
            sessionId: adminSessionSid,
            path: '/v1/users',
          }),
          json: {
            username: user.username,
            password: user.password,
            role: user.role,
            firstName: user.firstName || user.username.split('@')[0],
            lastName: user.lastName || 'TestUser',
          },
        });
        logger.info(`User "${user.username}" created`);
      } catch (err: any) {
        // User might already exist
        if (err.response?.statusCode === 400 || err.response?.body?.includes('already exist')) {
          logger.info(`User "${user.username}" already exists, continuing`);
        } else {
          throw err;
        }
      }

      // Login as this user
      logger.info(`Logging in as "${user.username}"`);
      const userLoginRes = await got.post(loginUri, {
        headers: createAuthHeaders(appServer, {
          path: '/v1/auth/login',
          headers: { 'upgrade-insecure-requests': '1' },
        }),
        json: { username: user.username, password: user.password },
      });

      const userSetCookie = userLoginRes.headers['set-cookie'];
      if (!userSetCookie || userSetCookie.length === 0) {
        throw new Error(`No set-cookie header for user "${user.username}"`);
      }
      const userSessionSid = userSetCookie[0]
        .split(';')
        .filter((x) => x.includes('connect.sid'))[0]
        .split('=')[1];

      // Generate API key for this user
      logger.info(`Generating API key for "${user.username}"`);
      const apiKeyUri = `${appServer.baseURL}/v1/auth/apikey`;
      const apiKeyRes = await got.get(apiKeyUri, {
        headers: createAuthHeaders(appServer, {
          sessionId: userSessionSid,
          path: '/v1/auth/apikey',
        }),
      });
      const apiKeyResponse = JSON.parse(apiKeyRes.body);
      const userApiKey = apiKeyResponse.apikey;

      userSessions.set(user.username, { sessionSid: userSessionSid, apiKey: userApiKey });
      logger.info(`API key obtained for "${user.username}"`);
    }

    // Step 3: Create baselines for each user
    for (const user of config.users) {
      if (!user.baselines || user.baselines.length === 0) {
        continue;
      }

      const session = userSessions.get(user.username);
      if (!session) {
        throw new Error(`No session found for user "${user.username}"`);
      }

      for (const baseline of user.baselines) {
        logger.info(`Creating baseline "${baseline.name}" for user "${user.username}"`);

        // Create a test session
        const testName = `Test-${baseline.name}-${Date.now()}`;
        const runIdent = `run-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Start test session via client API
        const startSessionUri = `${appServer.baseURL}/v1/client/startSession`;
        const startRes = await got.post(startSessionUri, {
          headers: {
            apikey: hashApiKey(session.apiKey),
            'Content-Type': 'application/json',
          },
          json: {
            name: testName,
            app: 'Baseline Test App',
            run: 'baseline-seed-run',
            runident: runIdent,
            branch: 'main',
            suite: 'Baseline Seed Suite',
            os: baseline.os || 'linux',
            browser: baseline.browserName || 'chromium',
            browserVersion: '1',
            browserFullVersion: '1.0.0',
            viewport: baseline.viewport || '800x600',
          },
        });
        const testSession = JSON.parse(startRes.body);
        const testId = testSession._id || testSession.id;
        logger.info(`Test session created: ${testId}`);

        // Create check with image
        const repoRoot = path.resolve(__dirname, '..', '..', '..', '..', '..');
        const filePath = baseline.filePath || 'files/A.png';
        const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);

        if (!fs.existsSync(fullPath)) {
          throw new Error(`Test file not found: ${fullPath}`);
        }

        const imageBuffer = fs.readFileSync(fullPath);
        const form = new FormData();
        form.append('testid', testId);
        form.append('name', baseline.checkName || baseline.name);
        form.append('appName', 'Baseline Test App');
        form.append('branch', 'main');
        form.append('suitename', 'Baseline Seed Suite');
        form.append('viewport', baseline.viewport || '800x600');
        form.append('browserName', baseline.browserName || 'chromium');
        form.append('browserVersion', '1');
        form.append('browserFullVersion', '1.0.0');
        form.append('os', baseline.os || 'linux');
        const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
        form.append('hashcode', hashcode);
        form.append('file', imageBuffer, path.basename(fullPath));

        const checkRes = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
          body: form,
          headers: {
            apikey: hashApiKey(session.apiKey),
          },
        });
        const checkResult = JSON.parse(checkRes.body);
        const checkId = checkResult._id || checkResult.id;
        logger.info(`Check created: ${checkId}`);

        // Accept the check to create baseline (using user's session)
        const acceptUri = `${appServer.baseURL}/v1/checks/${checkId}/accept`;
        await got.put(acceptUri, {
          headers: createAuthHeaders(appServer, {
            sessionId: session.sessionSid,
            path: `/v1/checks/${checkId}/accept`,
          }),
          json: {
            baselineId: checkResult.actualSnapshotId?._id || checkResult.actualSnapshotId,
          },
        });
        logger.info(`Check ${checkId} accepted, baseline created for "${baseline.name}"`);

        // Stop test session (testId must be in URL path, not body)
        const stopUri = `${appServer.baseURL}/v1/client/stopSession/${testId}`;
        await got.post(stopUri, {
          headers: {
            apikey: hashApiKey(session.apiKey),
            'Content-Type': 'application/json',
          },
        });
        logger.info(`Test session stopped`);
      }
    }

    // Store user sessions in testData for later use
    const users: Record<string, { sessionSid: string }> = {};
    for (const [username, session] of userSessions) {
      users[username] = { sessionSid: session.sessionSid };
    }
    testData.set('users', users);
    testData.set('seededUserSessions', Object.fromEntries(userSessions));

    logger.info('Finished seeding baselines with owners via HTTP');
  }
);

/**
 * Step to update user role via HTTP API (requires admin session)
 */
When(
  'I update via http user {string} role to {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    username: string,
    role: string
  ) => {
    // First get the user ID
    const usersUri = `${appServer.baseURL}/v1/users?filter={"username":"${username}"}`;
    const usersRes = await requestWithSession(usersUri, testData, appServer);
    const users = usersRes.json.results || usersRes.json;

    if (!users || users.length === 0) {
      throw new Error(`User "${username}" not found`);
    }

    const userId = users[0]._id;

    // Update user role
    const updateUri = `${appServer.baseURL}/v1/users/${userId}`;
    const result = await requestWithSession(updateUri, testData, appServer, {
      method: 'PATCH',
      json: { role },
    });

    logger.info(`Updated user "${username}" role to "${role}"`);
  }
);

// =============================================================================
// Universal HTTP-based seeding steps for baselines with usage counts
// =============================================================================

interface BaselineWithUsageConfig {
  name: string;
  checkName?: string;
  filePath?: string;
  browserName?: string;
  viewport?: string;
  os?: string;
  usageCount?: number; // Number of checks to create referencing this baseline
}

interface SeedBaselinesConfig {
  baselines: BaselineWithUsageConfig[];
}

/**
 * Helper function to create a baseline via HTTP API with specified number of usages.
 * Creates test session, check, accepts it to create baseline, then creates additional
 * checks referencing the same snapshot to increase usage count.
 */
async function createBaselineWithUsage(
  appServer: AppServerFixture,
  apiKey: string,
  sessionSid: string,
  baseline: BaselineWithUsageConfig
): Promise<{ snapshotId: string; baselineId: string }> {
  logger.info(`createBaselineWithUsage called for "${baseline.name}"`);
  const hashedApiKey = hashApiKey(apiKey);

  // Create a test session
  const testName = `Test-${baseline.name}-${Date.now()}`;
  const runIdent = `run-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Start test session via client API
  const startSessionUri = `${appServer.baseURL}/v1/client/startSession`;
  const startRes = await got.post(startSessionUri, {
    headers: {
      apikey: hashedApiKey,
      'Content-Type': 'application/json',
    },
    json: {
      name: testName,
      app: 'Baseline Test App',
      run: 'baseline-seed-run',
      runident: runIdent,
      branch: 'main',
      suite: 'Baseline Seed Suite',
      os: baseline.os || 'linux',
      browser: baseline.browserName || 'chromium',
      browserVersion: '1',
      browserFullVersion: '1.0.0',
      viewport: baseline.viewport || '800x600',
    },
  });
  const testSession = JSON.parse(startRes.body);
  const testId = testSession._id || testSession.id;
  logger.info(`Test session created: ${testId}`);

  // Create check with image
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..', '..');
  const filePath = baseline.filePath || 'files/A.png';
  const fullPath = path.join(repoRoot, 'syngrisi', 'tests', filePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test file not found: ${fullPath}`);
  }

  const imageBuffer = fs.readFileSync(fullPath);
  const form = new FormData();
  form.append('testid', testId);
  form.append('name', baseline.checkName || baseline.name);
  form.append('appName', 'Baseline Test App');
  form.append('branch', 'main');
  form.append('suitename', 'Baseline Seed Suite');
  form.append('viewport', baseline.viewport || '800x600');
  form.append('browserName', baseline.browserName || 'chromium');
  form.append('browserVersion', '1');
  form.append('browserFullVersion', '1.0.0');
  form.append('os', baseline.os || 'linux');
  const hashcode = crypto.createHash('sha512').update(imageBuffer).digest('hex');
  form.append('hashcode', hashcode);
  form.append('file', imageBuffer, path.basename(fullPath));

  logger.info(`Creating check at ${appServer.baseURL}/v1/client/createCheck with testId=${testId}`);
  let checkRes;
  try {
    checkRes = await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
      body: form,
      headers: {
        apikey: hashedApiKey,
      },
    });
  } catch (err: any) {
    logger.error(`Failed to create check: ${err.message}`);
    if (err.response) {
      logger.error(`Response body: ${err.response.body}`);
    }
    throw err;
  }
  const checkResult = JSON.parse(checkRes.body);
  const checkId = checkResult._id || checkResult.id;
  const snapshotId = checkResult.actualSnapshotId?._id || checkResult.actualSnapshotId;
  logger.info(`Check created: ${checkId}, snapshot: ${snapshotId}`);

  // Accept the check to create baseline (using user's session or API key)
  const acceptUri = `${appServer.baseURL}/v1/checks/${checkId}/accept`;
  logger.info(`Accepting check at ${acceptUri} with snapshotId=${snapshotId}`);
  try {
    await got.put(acceptUri, {
      headers: {
        ...createAuthHeaders(appServer, {
          sessionId: sessionSid || undefined,
          path: `/v1/checks/${checkId}/accept`,
        }),
        apikey: hashedApiKey,
      },
      json: {
        baselineId: snapshotId,
      },
    });
    logger.info(`Check ${checkId} accepted, baseline created for "${baseline.name}"`);
  } catch (err: any) {
    logger.error(`Failed to accept check ${checkId}: ${err.message}`);
    if (err.response) {
      logger.error(`Response body: ${err.response.body}`);
    }
    throw err;
  }

  // Stop test session - testid goes in URL path, not body
  const stopUri = `${appServer.baseURL}/v1/client/stopSession/${testId}`;
  logger.info(`Stopping test session ${testId}`);
  try {
    await got.post(stopUri, {
      headers: {
        apikey: hashedApiKey,
        'Content-Type': 'application/json',
      },
    });
    logger.info(`Test session ${testId} stopped`);
  } catch (err: any) {
    logger.error(`Failed to stop session: ${err.message}`);
    if (err.response) {
      logger.error(`Response: ${err.response.body}`);
    }
    throw err;
  }

  // Create additional checks to increase usage count
  const usageCount = baseline.usageCount ?? 1;
  for (let i = 1; i < usageCount; i++) {
    // Create new test session for each additional usage
    const additionalTestName = `Test-${baseline.name}-usage-${i}-${Date.now()}`;
    const additionalRunIdent = `run-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const additionalStartRes = await got.post(startSessionUri, {
      headers: {
        apikey: hashedApiKey,
        'Content-Type': 'application/json',
      },
      json: {
        name: additionalTestName,
        app: 'Baseline Test App',
        run: 'baseline-usage-run',
        runident: additionalRunIdent,
        branch: 'main',
        suite: 'Baseline Seed Suite',
        os: baseline.os || 'linux',
        browser: baseline.browserName || 'chromium',
        browserVersion: '1',
        browserFullVersion: '1.0.0',
        viewport: baseline.viewport || '800x600',
      },
    });
    const additionalTestSession = JSON.parse(additionalStartRes.body);
    const additionalTestId = additionalTestSession._id || additionalTestSession.id;

    // Create check with same image (will match existing baseline)
    const additionalForm = new FormData();
    additionalForm.append('testid', additionalTestId);
    additionalForm.append('name', baseline.checkName || baseline.name);
    additionalForm.append('appName', 'Baseline Test App');
    additionalForm.append('branch', 'main');
    additionalForm.append('suitename', 'Baseline Seed Suite');
    additionalForm.append('viewport', baseline.viewport || '800x600');
    additionalForm.append('browserName', baseline.browserName || 'chromium');
    additionalForm.append('browserVersion', '1');
    additionalForm.append('browserFullVersion', '1.0.0');
    additionalForm.append('os', baseline.os || 'linux');
    additionalForm.append('hashcode', hashcode);
    additionalForm.append('file', imageBuffer, path.basename(fullPath));

    await got.post(`${appServer.baseURL}/v1/client/createCheck`, {
      body: additionalForm,
      headers: {
        apikey: hashedApiKey,
      },
    });

    // Stop additional test session - testid goes in URL path
    const additionalStopUri = `${appServer.baseURL}/v1/client/stopSession/${additionalTestId}`;
    await got.post(additionalStopUri, {
      headers: {
        apikey: hashedApiKey,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Created additional usage ${i + 1} for baseline "${baseline.name}"`);
  }

  // Get the baseline ID
  const baselinesUri = `${appServer.baseURL}/v1/baselines?limit=0&filter={"$and":[{"name":{"$regex":"${baseline.checkName || baseline.name}","$options":"im"}}]}`;
  const baselinesRes = await got.get(baselinesUri, {
    headers: {
      ...createAuthHeaders(appServer, { sessionId: sessionSid || undefined }),
      apikey: hashedApiKey,
    },
  });
  const baselinesData = JSON.parse(baselinesRes.body);
  const baselineRecord = baselinesData.results?.[0];

  return {
    snapshotId,
    baselineId: baselineRecord?._id,
  };
}

/**
 * Universal step for seeding baselines with configurable usage counts via HTTP API.
 *
 * Example usage:
 * ```gherkin
 * Given I seed via http baselines with usage:
 *     """
 *     baselines:
 *       - name: api-baseline-usage
 *         usageCount: 2
 *         filePath: files/A.png
 *       - name: api-baseline-unused
 *         usageCount: 0
 *         filePath: files/B.png
 *     """
 * ```
 */
Given(
  'I seed via http baselines with usage:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ymlConfig: string
  ) => {
    const config: SeedBaselinesConfig = yaml.parse(ymlConfig);

    // Get or create API key - use default test API key
    const apiKey = process.env.SYNGRISI_API_KEY || '123';

    // Login to get session (needed for accepting checks)
    const loginUri = `${appServer.baseURL}/v1/auth/login`;
    let sessionSid: string;

    try {
      const loginRes = await got.post(loginUri, {
        headers: createAuthHeaders(appServer, {
          path: '/v1/auth/login',
          headers: { 'upgrade-insecure-requests': '1' },
        }),
        json: { username: 'Guest', password: 'Guest' },
      });

      const setCookieHeader = loginRes.headers['set-cookie'];
      if (setCookieHeader && setCookieHeader.length > 0) {
        sessionSid = setCookieHeader[0]
          .split(';')
          .filter((x) => x.includes('connect.sid'))[0]
          .split('=')[1];
      } else {
        // No auth mode - generate a dummy session
        sessionSid = '';
      }
    } catch {
      // Auth might be disabled
      sessionSid = '';
    }

    const seededBaselines: Array<{ name: string; snapshotId: string; baselineId: string }> = [];

    for (const baseline of config.baselines) {
      logger.info(`Creating baseline "${baseline.name}" with usageCount=${baseline.usageCount ?? 1}`);

      // Special case: usageCount = 0 means create baseline but then delete all checks
      if (baseline.usageCount === 0) {
        // Create with 1 usage first, then we'll handle orphan case
        const result = await createBaselineWithUsage(appServer, apiKey, sessionSid, {
          ...baseline,
          usageCount: 1,
        });
        seededBaselines.push({
          name: baseline.name,
          snapshotId: result.snapshotId,
          baselineId: result.baselineId,
        });

        // Delete checks that reference this baseline's snapshot to make usageCount = 0
        // This is done via direct API call to delete checks
        const checksUri = `${appServer.baseURL}/v1/checks?limit=0&filter={"baselineId":"${result.snapshotId}"}`;
        logger.info(`Fetching checks to delete from: ${checksUri}`);
        const checksRes = await got.get(checksUri, {
          headers: createAuthHeaders(appServer, { sessionId: sessionSid || undefined }),
        });
        const checksData = JSON.parse(checksRes.body);
        const checks = checksData.results || [];
        logger.info(`Found ${checks.length} checks to delete`);

        for (const check of checks) {
          const deleteUri = `${appServer.baseURL}/v1/checks/${check._id}`;
          try {
            await got.delete(deleteUri, {
              headers: createAuthHeaders(appServer, { sessionId: sessionSid || undefined }),
            });
            logger.info(`Deleted check ${check._id} to create orphan baseline`);
          } catch (err: any) {
            logger.warn(`Failed to delete check ${check._id}: ${err.message}`);
            if (err.response) {
              logger.warn(`Response: ${err.response.body}`);
            }
          }
        }
      } else {
        const result = await createBaselineWithUsage(appServer, apiKey, sessionSid, baseline);
        seededBaselines.push({
          name: baseline.name,
          snapshotId: result.snapshotId,
          baselineId: result.baselineId,
        });
      }
    }

    // Store seeded data in testData for later use
    testData.set('seededBaselines', seededBaselines);
    if (seededBaselines.length > 0) {
      testData.set('baselineSeed', {
        usageSnapshotId: seededBaselines[0].snapshotId,
      });
    }

    logger.info(`Finished seeding ${seededBaselines.length} baselines via HTTP`);
  }
);

/**
 * Universal step for seeding orphan baselines data via HTTP API.
 * Creates one orphan baseline (no checks reference it) and one used baseline (has checks).
 *
 * Example usage:
 * ```gherkin
 * Given I seed via http orphan baselines data:
 *     """
 *     orphanBaseline:
 *       name: orphan-baseline-deleteme
 *       filePath: files/A.png
 *     usedBaseline:
 *       name: orphan-baseline-keep
 *       filePath: files/B.png
 *     """
 * ```
 */
Given(
  'I seed via http orphan baselines data:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ymlConfig: string
  ) => {
    const config = yaml.parse(ymlConfig);
    const apiKey = process.env.SYNGRISI_API_KEY || '123';

    // Login to get session
    const loginUri = `${appServer.baseURL}/v1/auth/login`;
    let sessionSid = '';

    try {
      const loginRes = await got.post(loginUri, {
        headers: createAuthHeaders(appServer, {
          path: '/v1/auth/login',
          headers: { 'upgrade-insecure-requests': '1' },
        }),
        json: { username: 'Guest', password: 'Guest' },
      });

      const setCookieHeader = loginRes.headers['set-cookie'];
      if (setCookieHeader && setCookieHeader.length > 0) {
        sessionSid = setCookieHeader[0]
          .split(';')
          .filter((x) => x.includes('connect.sid'))[0]
          .split('=')[1];
      }
    } catch {
      // Auth might be disabled
    }

    // Create orphan baseline (will delete checks after creation)
    const orphanConfig = config.orphanBaseline || {
      name: 'orphan-baseline-deleteme',
      filePath: 'files/A.png',
    };

    logger.info(`Creating orphan baseline "${orphanConfig.name}"`);
    const orphanResult = await createBaselineWithUsage(appServer, apiKey, sessionSid, {
      ...orphanConfig,
      usageCount: 1,
    });

    // Delete checks to make it orphan
    const checksUri = `${appServer.baseURL}/v1/checks?limit=0&filter={"baselineId":"${orphanResult.snapshotId}"}`;
    const checksRes = await got.get(checksUri, {
      headers: sessionSid ? createAuthHeaders(appServer, { sessionId: sessionSid }) : {},
    });
    const checksData = JSON.parse(checksRes.body);
    const checks = checksData.results || [];

    for (const check of checks) {
      const deleteUri = `${appServer.baseURL}/v1/checks/${check._id}`;
      try {
        await got.delete(deleteUri, {
          headers: sessionSid ? createAuthHeaders(appServer, { sessionId: sessionSid }) : {},
        });
        logger.info(`Deleted check ${check._id} to create orphan baseline`);
      } catch (err: any) {
        logger.warn(`Failed to delete check ${check._id}: ${err.message}`);
      }
    }

    // Create used baseline (keeps its checks)
    const usedConfig = config.usedBaseline || {
      name: 'orphan-baseline-keep',
      filePath: 'files/B.png',
    };

    logger.info(`Creating used baseline "${usedConfig.name}"`);
    const usedResult = await createBaselineWithUsage(appServer, apiKey, sessionSid, {
      ...usedConfig,
      usageCount: 1,
    });

    // Store seed context
    testData.set('orphanSeed', {
      orphanSnapshotId: orphanResult.snapshotId,
      usedBaselineName: usedConfig.name,
      orphanBaselineName: orphanConfig.name,
    });

    logger.info('Finished seeding orphan baselines data via HTTP');
  }
);

/**
 * Universal step for seeding diverse baselines for UI testing via HTTP API.
 *
 * Example usage:
 * ```gherkin
 * Given I seed via http diverse baselines:
 *     """
 *     baselines:
 *       - name: ui-base-alpha
 *         browserName: firefox
 *         viewport: "1920x1080"
 *         os: Windows
 *         usageCount: 1
 *       - name: ui-base-beta
 *         browserName: safari
 *         viewport: "1440x900"
 *         os: macOS
 *         usageCount: 0
 *       - name: ui-base-gamma
 *         browserName: chrome
 *         viewport: "800x600"
 *         os: Linux
 *         usageCount: 2
 *     """
 * ```
 */
Given(
  'I seed via http diverse baselines:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ymlConfig: string
  ) => {
    const config: SeedBaselinesConfig = yaml.parse(ymlConfig);
    const apiKey = process.env.SYNGRISI_API_KEY || '123';

    // Login to get session
    const loginUri = `${appServer.baseURL}/v1/auth/login`;
    let sessionSid = '';

    try {
      const loginRes = await got.post(loginUri, {
        headers: createAuthHeaders(appServer, {
          path: '/v1/auth/login',
          headers: { 'upgrade-insecure-requests': '1' },
        }),
        json: { username: 'Guest', password: 'Guest' },
      });

      const setCookieHeader = loginRes.headers['set-cookie'];
      if (setCookieHeader && setCookieHeader.length > 0) {
        sessionSid = setCookieHeader[0]
          .split(';')
          .filter((x) => x.includes('connect.sid'))[0]
          .split('=')[1];
      }
    } catch {
      // Auth might be disabled
    }

    for (const baseline of config.baselines) {
      logger.info(`Creating diverse baseline "${baseline.name}" (${baseline.browserName}/${baseline.os})`);

      if (baseline.usageCount === 0) {
        // Create and then delete checks
        const result = await createBaselineWithUsage(appServer, apiKey, sessionSid, {
          ...baseline,
          usageCount: 1,
        });

        // Delete checks to make usageCount = 0
        const checksUri = `${appServer.baseURL}/v1/checks?limit=0&filter={"baselineId":"${result.snapshotId}"}`;
        const checksRes = await got.get(checksUri, {
          headers: sessionSid ? createAuthHeaders(appServer, { sessionId: sessionSid }) : {},
        });
        const checksData = JSON.parse(checksRes.body);
        const checks = checksData.results || [];

        for (const check of checks) {
          try {
            await got.delete(`${appServer.baseURL}/v1/checks/${check._id}`, {
              headers: sessionSid ? createAuthHeaders(appServer, { sessionId: sessionSid }) : {},
            });
          } catch {
            // Ignore delete errors
          }
        }
      } else {
        await createBaselineWithUsage(appServer, apiKey, sessionSid, baseline);
      }
    }

    logger.info(`Finished seeding ${config.baselines.length} diverse baselines via HTTP`);
  }
);

/**
 * Step to log user info via HTTP API (replaces direct DB access)
 */
Then(
  'I log via http user {string} info',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    username: string
  ) => {
    const usersUri = `${appServer.baseURL}/v1/users?filter={"username":"${username}"}`;
    const usersRes = await requestWithSession(usersUri, testData, appServer);
    const users = usersRes.json.results || usersRes.json;

    if (users && users.length > 0) {
      const user = users[0];
      logger.info(`User "${username}" info: role=${user.role}, id=${user._id}`);
    } else {
      logger.info(`User "${username}" not found`);
    }
  }
);
