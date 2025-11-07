import { execSync } from 'node:child_process';
import path from 'node:path';
import { e2eRoot } from '../config';
import logger, { formatArgs } from './logger';

export const getStepDefinitions = (file?: string): string => {
  const parseScriptPath = path.join(__dirname, 'parse-steps-for-llm.ts');
  const command = file
    ? `npx tsx ${parseScriptPath} --file "${file}"`
    : `npx tsx ${parseScriptPath}`;

  try {
    return execSync(command, {
      encoding: 'utf-8',
      cwd: e2eRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
    });
  } catch (err) {
    logger.error(formatArgs('Failed to collect step definitions', err));
    throw err;
  }
};
