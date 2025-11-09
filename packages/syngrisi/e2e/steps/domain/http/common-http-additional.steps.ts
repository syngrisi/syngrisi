import { Then, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';

const logger = createLogger('CommonHttpAdditionalSteps');

Then(
  'I expect via http that {string} check exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking checks with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} checks`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I expect via http that {string} test exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/tests?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking tests with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} tests`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I expect via http that {string} snapshot exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/snapshots?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking snapshots with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} snapshots`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I expect via http that {string} run exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/runs?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking runs with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} runs`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I expect via http that {string} suite exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/suites?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    logger.info(`Checking suites with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} suites`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I expect via http {int} baselines',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    num: number
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&filter={}`;
    logger.info('Checking baselines');
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;
    logger.info(`Found ${items.length} baselines`);
    expect(items.length).toBe(num);
  }
);

Then(
  'I expect exact {string} snapshot files',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/screenshots`;
    logger.info('Checking snapshot files');
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    logger.info(`Snapshot API response: ${JSON.stringify(itemsResponse.json)}`);
    const items = itemsResponse.json.json || itemsResponse.json;
    const count = Array.isArray(items) ? items.length : 0;
    logger.info(`Found ${count} snapshot files`);
    expect(count).toBe(parseInt(num, 10));
  }
);

When(
  'I remove via http Inconsistent items',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore }
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/task_handle_database_consistency?clean=true`;
    logger.info(`Removing inconsistent items via ${uri}`);
    const result = await requestWithSession(uri, testData, appServer);
    const statusCode = result.raw?.statusCode;
    logger.info(`Inconsistent items removed, status: ${statusCode}`);
    expect(statusCode).toBe(200);
  }
);

When(
  'I remove via http checks that older than {string} days',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    days: string
  ) => {
    const uri = `${appServer.baseURL}/v1/tasks/task_handle_old_checks?days=${days}&remove=true`;
    logger.info(`Removing checks older than ${days} days via ${uri}`);
    const result = await requestWithSession(uri, testData, appServer);
    const statusCode = result.raw?.statusCode;
    logger.info(`Old checks removed, status: ${statusCode}`);
    expect(statusCode).toBe(200);
  }
);
