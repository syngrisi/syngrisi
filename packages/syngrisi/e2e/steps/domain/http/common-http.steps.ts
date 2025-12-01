import { Then, When } from '@fixtures';
import type { AppServerFixture } from '@fixtures';
import type { TestStore } from '@fixtures';
import { createLogger } from '@lib/logger';
import { requestWithSession } from '@utils/http-client';
import * as yaml from 'yaml';
import { expect } from '@playwright/test';
import { got } from 'got-cjs';

const logger = createLogger('CommonHttpSteps');

function convertQueryToMongoFilter(inputString: string): string {
  const [key, value] = inputString.split('=');
  const result = [{
    [key]: {
      $regex: `${value}`,
      $options: 'im',
    },
  }];
  return JSON.stringify(result);
}

Then(
  'I expect via http that {string} {string} exist exactly {string} times',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    name: string,
    itemName: string,
    num: string
  ) => {
    const uri = `${appServer.baseURL}/v1/${itemName}s?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;

    logger.info(`Checking ${itemName}s with name "${name}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} ${itemName}s`);
    expect(items.length).toBe(parseInt(num, 10));
  }
);

// Support both Then and When for compatibility with original feature files
const expectViaHttpCheckMatched = async (
  appServer: AppServerFixture,
  testData: TestStore,
  ordinal: number,
  filter: string,
  yml: string
) => {
  const uri = `${appServer.baseURL}/v1/checks?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;
  const params = yaml.parse(yml);

  await expect.poll(async () => {
    logger.info(`Fetching checks with filter "${filter}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} checks`);

    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const item = items[ordinal];
    return item;
  }, {
    timeout: 30000,
    intervals: [500, 1000, 2000],
    message: `Check #${ordinal} matching ${JSON.stringify(params)} not found`
  }).toMatchObject(params);
};

Then(
  'I expect via http {ordinal} check filtered as {string} matched:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    filter: string,
    yml: string
  ) => {
    await expectViaHttpCheckMatched(appServer, testData, ordinal, filter, yml);
  }
);


Then(
  'I expect via http {ordinal} baseline filtered as {string} matched:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    filter: string,
    yml: string
  ) => {
    const uri = `${appServer.baseURL}/v1/baselines?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;

    logger.info(`Fetching baselines with filter "${filter}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} baselines`);

    const params = yaml.parse(yml);
    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const item = items[ordinal];
    if (!item) {
      throw new Error(`Baseline #${ordinal + 1} (${ordinal}-based index) not found. Found ${items.length} baselines.`);
    }
    expect(item).toMatchObject(params);
  }
);

Then(
  'I expect via http {ordinal} {string} filtered as {string} matched:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    itemName: string,
    filter: string,
    yml: string
  ) => {
    const uri = `${appServer.baseURL}/v1/${itemName}s?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;

    logger.info(`Fetching ${itemName}s with filter "${filter}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} ${itemName}s`);

    const params = yaml.parse(yml);
    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const item = items[ordinal];
    if (!item) {
      throw new Error(`${itemName} #${ordinal + 1} (${ordinal}-based index) not found. Found ${items.length} ${itemName}s.`);
    }
    expect(item).toMatchObject(params);
  }
);

When(
  'I expect via http {ordinal} test filtered as {string} matched:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    filter: string,
    yml: string
  ) => {
    const uri = `${appServer.baseURL}/v1/tests?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;

    const params = yaml.parse(yml);
    
    // If checking status, wait for status to change from "Running" using polling
    if (params.status && params.status !== 'Running') {
      const maxAttempts = 90; // 90 seconds with 1 second intervals (tests may take time to process)
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        logger.info(`Fetching tests with filter "${filter}" (attempt ${attempt + 1}/${maxAttempts})`);
        const itemsResponse = await requestWithSession(uri, testData, appServer);
        const items = itemsResponse.json.results;

        if (items.length > ordinal) {
          const item = items[ordinal];
          // Handle array status like [passed]
          const expectedStatus = Array.isArray(params.status) ? params.status[0] : params.status;
          if (item.status === expectedStatus) {
            logger.info(`Test status changed to "${expectedStatus}" after ${attempt + 1} attempts`);
            expect(item).toMatchObject(params);
            return;
          }
        }
        
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    logger.info(`Fetching tests with filter "${filter}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} tests`);

    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const item = items[ordinal];
    if (!item) {
      throw new Error(`Test #${ordinal + 1} (${ordinal}-based index) not found. Found ${items.length} tests.`);
    }
    expect(item).toMatchObject(params);
  }
);

When(
  'I expect via http {ordinal} {string} filtered as {string} matched:',
  async (
    { appServer, testData }: { appServer: AppServerFixture; testData: TestStore },
    ordinal: number,
    itemName: string,
    filter: string,
    yml: string
  ) => {
    const uri = `${appServer.baseURL}/v1/${itemName}s?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;

    logger.info(`Fetching ${itemName}s with filter "${filter}"`);
    const itemsResponse = await requestWithSession(uri, testData, appServer);
    const items = itemsResponse.json.results;

    logger.info(`Found ${items.length} ${itemName}s`);

    const params = yaml.parse(yml);
    // Playwright BDD ordinal is 0-based: "1st" = 0, "2nd" = 1, etc.
    const item = items[ordinal];
    if (!item) {
      throw new Error(`${itemName} #${ordinal + 1} (${ordinal}-based index) not found. Found ${items.length} ${itemName}s.`);
    }
    expect(item).toMatchObject(params);
  }
);

