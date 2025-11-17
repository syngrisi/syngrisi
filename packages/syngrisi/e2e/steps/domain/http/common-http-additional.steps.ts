import { Then, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import { expect } from '@playwright/test';
import * as yaml from 'yaml';
import { renderTemplate } from '@helpers/template';

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

When(
  'I update via http setting {string} with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    yml: string
  ) => {
    const rendered = renderTemplate(yml, testData);
    const body = yaml.parse(rendered);
    const uri = `${appServer.baseURL}/v1/settings/${name}`;
    logger.info(`Updating setting ${name} via ${uri} with body: ${rendered}`);
    const result = await requestWithSession(uri, testData, appServer, {
      method: 'PATCH',
      json: body,
    });
    const statusCode = result.raw?.statusCode;
    expect(statusCode).toBe(200);
  }
);

Then(
  'I wait up to {int} seconds via http that {string} check exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    timeoutSeconds: number,
    name: string,
    expectedCount: string
  ) => {
    const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;
    const count = parseInt(expectedCount, 10);
    const deadline = Date.now() + timeoutSeconds * 1000;

    while (Date.now() <= deadline) {
      const response = await requestWithSession(uri, testData, appServer);
      const items = response.json.results;
      if (items.length === count) {
        logger.info(`Condition met for "${name}" with ${items.length} checks`);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Timed out waiting for ${name} checks to reach ${count}`);
  }
);

When(
  'I create via http log with params:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    yml: string
  ) => {
    const rendered = renderTemplate(yml, testData);
    const body = yaml.parse(rendered);
    const uri = `${appServer.baseURL}/v1/logs`;
    logger.info(`Creating log via ${uri} with body: ${rendered}`);
    const result = await requestWithSession(uri, testData, appServer, {
      method: 'POST',
      json: body,
    });
    const statusCode = result.raw?.statusCode;
    expect(statusCode).toBe(201);
  }
);

Then(
  'I expect via http logs with message {string} exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    message: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/logs?limit=0&filter={"$and":[{"message":{"$regex":"${message}","$options":"im"}}]}`;
    const response = await requestWithSession(uri, testData, appServer);
    const items = response.json.results;
    expect(items.length).toBe(parseInt(num, 10));
  }
);

Then(
  'I wait up to {int} seconds via http that logs with message {string} exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    timeoutSeconds: number,
    message: string,
    expectedCount: string
  ) => {
    const target = parseInt(expectedCount, 10);
    const uri = `${appServer.baseURL}/v1/logs?limit=0&filter={"$and":[{"message":{"$regex":"${message}","$options":"im"}}]}`;
    const deadline = Date.now() + timeoutSeconds * 1000;

    while (Date.now() <= deadline) {
      const response = await requestWithSession(uri, testData, appServer);
      const items = response.json.results;
      if (items.length === target) {
        logger.info(`Logs count for "${message}" reached ${target}`);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(`Timed out waiting for logs count to reach ${expectedCount}`);
  }
);

Then(
  'I expect via http setting {string} days equals {int}',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    expectedDays: number
  ) => {
    const uri = `${appServer.baseURL}/v1/settings`;
    const response = await requestWithSession(uri, testData, appServer);
    const setting = response.json.find((item: any) => item.name === name);
    if (!setting) {
      throw new Error(`Setting '${name}' not found`);
    }
    const days = Number(setting.value?.days);
    expect(days).toBe(expectedDays);
  }
);
