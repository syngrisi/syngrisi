import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import type { TestEngineFixture, AppServerFixture, TestStore } from '../../fixtures/index';
import { createLogger } from '@lib/logger';
import path from 'path';
import fs from 'fs';
import { got } from 'got-cjs';
import FormData from 'form-data';
import * as crypto from 'crypto';
import * as yaml from 'yaml';


const logger = createLogger('McpScenarioTest');

// Helper function to extract text content from tool results
const extractContentText = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const container = 'result' in payload && payload.result && typeof payload.result === 'object'
    ? payload.result
    : payload;

  if (!container || typeof container !== 'object') {
    return '';
  }

  const content = (container as { content?: unknown }).content;
  if (!Array.isArray(content) || !content.length) {
    return '';
  }

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== 'object') {
    return '';
  }

  const text = (firstBlock as { text?: unknown }).text;
  return typeof text === 'string' ? text : '';
};


test('Perform MCP actions and get URL', async ({ page, testEngine, appServer, testData }) => {
  // 1. session_start_new с sessionName из BENCH_SESSION_NAME и headless=true.
  logger.info('Starting new MCP session...');
  if (!testEngine.isRunning()) {
    await testEngine.start();
  }
  const sessionResult = await testEngine.client?.callTool(
    {
      name: 'session_start_new',
      arguments: {
        sessionName: 'bench-session-name',
        headless: true
      }
    },
    undefined,
    { timeout: 120000 } // Use a reasonable timeout of 120 seconds
  );
  logger.info(`Session start result: ${JSON.stringify(sessionResult)}`);
  expect(extractContentText(sessionResult)).toContain('Status: Success');

  // 2. Через шаг Given I seed via http baselines with owners:
  //    создай baseline bench-quick с одним check QuickCheck (filePath: files/A.png) от пользователя Test/123456aA-.
  logger.info('Seeding baselines via HTTP...');

  const baselineYaml = `
- name: bench-quick
  owner: Test/123456aA-
  checks:
    - name: QuickCheck
      filePath: files/A.png
`;
  const seedBaselinesResult = await testEngine.client?.callTool(
    {
      name: 'step_execute_single',
      arguments: {
        stepText: 'Given I seed via http baselines with owners:',
        stepDocstring: baselineYaml,
      }
    },
    undefined,
    { timeout: 180000 } // Use a reasonable timeout of 180 seconds
  );
  logger.info(`Seed baselines result: ${JSON.stringify(seedBaselinesResult)}`);
  expect(extractContentText(seedBaselinesResult)).toContain('Status: Success');

  // 3. Выполни When I open the app.
  logger.info('Opening the app...');
  const openAppResult = await testEngine.client?.callTool(
    {
      name: 'step_execute_single',
      arguments: {
        stepText: 'When I open the app',
      }
    },
    undefined,
    { timeout: 60000 } // Use a reasonable timeout of 60 seconds
  );
  logger.info(`Open app result: ${JSON.stringify(openAppResult)}`);
  expect(extractContentText(openAppResult)).toContain('Status: Success');

  // 4. Найди тест bench-quick в таблице, раскрой его, открой 1-й check QuickCheck.
  logger.info('Finding test, expanding, and opening check...');
  const findAndOpenResult = await testEngine.client?.callTool(
    {
      name: 'step_execute_single',
      arguments: {
        stepText: 'When I find test "bench-quick" in the table, expand it, and open the first check "QuickCheck"',
      }
    },
    undefined,
    { timeout: 60000 } // Use a reasonable timeout of 60 seconds
  );
  logger.info(`Find and open check result: ${JSON.stringify(findAndOpenResult)}`);
  expect(extractContentText(findAndOpenResult)).toContain('Status: Success');

  // 5. Верни текущий URL.
  logger.info('Getting current URL...');
  const getUrlResult = await testEngine.client?.callTool(
    {
      name: 'step_execute_single',
      arguments: {
        stepText: 'Then I get the current URL',
      }
    },
    undefined,
    { timeout: 30000 } // Use a reasonable timeout of 30 seconds
  );
  const urlText = extractContentText(getUrlResult);
  logger.info(`Current URL result: ${urlText}`);
  expect(urlText).toContain('Status: Success');
  expect(urlText).toMatch(/Current URL: .*/); // Assert that the URL is present
});
