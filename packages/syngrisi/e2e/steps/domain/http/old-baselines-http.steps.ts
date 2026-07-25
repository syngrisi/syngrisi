import { Then, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';
import * as yaml from 'yaml';
import { renderTemplate } from '@helpers/template';

const logger = createLogger('OldBaselinesHttpSteps');

async function fetchBaselinesByName(
  appServer: AppServerFixture,
  testData: TestStore,
  name: string,
) {
  const uri = `${appServer.baseURL}/v1/baselines?limit=0&sortBy=createdDate:desc&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
  const response = await requestWithSession(uri, testData, appServer);
  return response.json.results || [];
}

When(
  'I remove via http baselines older than {string} days keeping last {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    days: string,
    keepLast: string,
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/task_handle_old_baselines?days=${days}&keepLast=${keepLast}&remove=true`;
    logger.info(`Removing old baselines via ${uri}`);
    const result = await requestWithSession(uri, testData, appServer);
    expect(result.raw?.statusCode).toBe(200);
  },
);

When(
  'I dry-run via http baselines older than {string} days keeping last {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    days: string,
    keepLast: string,
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/task_handle_old_baselines?days=${days}&keepLast=${keepLast}&dryRun=true`;
    logger.info(`Dry-run old baselines via ${uri}`);
    const result = await requestWithSession(uri, testData, appServer);
    expect(result.raw?.statusCode).toBe(200);
  },
);

/**
 * Backdate the oldest N baselines for a check name (sorted createdDate asc),
 * leaving newer ones untouched. Used to set up age+rank retention scenarios.
 */
When(
  'I update via http the oldest {string} baselines named {string} with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    countStr: string,
    name: string,
    yml: string,
  ) => {
    const count = parseInt(countStr, 10);
    const rendered = renderTemplate(yml, testData);
    const params = yaml.parse(rendered);
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&sortBy=createdDate:asc&filter={"$and":[{"name":{"$regex":"^${name}$","$options":"im"}}]}`;
    const response = await requestWithSession(uri, testData, appServer);
    const baselines = response.json.results || [];
    if (baselines.length < count) {
      throw new Error(
        `Expected at least ${count} baselines named "${name}", found ${baselines.length}`,
      );
    }
    const targets = baselines.slice(0, count);
    for (const baseline of targets) {
      const id = baseline.id || baseline._id;
      const updateUri = `${appServer.baseURL}/v1/baselines/${id}`;
      logger.info(`Backdating baseline ${id} with`, params);
      const result = await requestWithSession(updateUri, testData, appServer, {
        method: 'PUT',
        json: params,
      });
      expect(result.raw?.statusCode).toBe(200);
    }
  },
);

/**
 * Backdate ALL baselines for a name (including the newest) — used for the
 * hard-guard scenario where a single / all baselines are ancient.
 */
When(
  'I update via http all baselines named {string} with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    yml: string,
  ) => {
    const rendered = renderTemplate(yml, testData);
    const params = yaml.parse(rendered);
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&filter={"$and":[{"name":{"$regex":"^${name}$","$options":"im"}}]}`;
    const response = await requestWithSession(uri, testData, appServer);
    const baselines = response.json.results || [];
    if (!baselines.length) {
      throw new Error(`No baselines named "${name}" found`);
    }
    for (const baseline of baselines) {
      const id = baseline.id || baseline._id;
      const result = await requestWithSession(
        `${appServer.baseURL}/v1/baselines/${id}`,
        testData,
        appServer,
        { method: 'PUT', json: params },
      );
      expect(result.raw?.statusCode).toBe(200);
    }
  },
);

Then(
  'I expect via http that baselines named {string} exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string,
  ) => {
    const items = await fetchBaselinesByName(appServer, testData, `^${name}$`);
    logger.info(`Found ${items.length} baselines named "${name}"`);
    expect(items.length).toBe(parseInt(num, 10));
  },
);

Then(
  'I wait up to {int} seconds via http that baselines named {string} exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    timeoutSeconds: number,
    name: string,
    expectedCount: string,
  ) => {
    const target = parseInt(expectedCount, 10);
    const deadline = Date.now() + timeoutSeconds * 1000;
    while (Date.now() <= deadline) {
      const items = await fetchBaselinesByName(appServer, testData, `^${name}$`);
      if (items.length === target) {
        logger.info(`Baselines named "${name}" reached count ${target}`);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Timed out waiting for baselines named "${name}" to reach ${target}`);
  },
);

When(
  'I mark via http the oldest baseline named {string} as {string}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    markedAs: string,
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&sortBy=createdDate:asc&filter={"$and":[{"name":{"$regex":"^${name}$","$options":"im"}}]}`;
    const response = await requestWithSession(uri, testData, appServer);
    const baselines = response.json.results || [];
    if (!baselines.length) {
      throw new Error(`No baselines named "${name}" found`);
    }
    const oldest = baselines[0];
    const id = oldest.id || oldest._id;
    const result = await requestWithSession(
      `${appServer.baseURL}/v1/baselines/${id}`,
      testData,
      appServer,
      { method: 'PUT', json: { markedAs } },
    );
    expect(result.raw?.statusCode).toBe(200);
  },
);
