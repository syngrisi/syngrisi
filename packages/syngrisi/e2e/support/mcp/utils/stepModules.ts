import fs from 'node:fs/promises';
import path from 'node:path';

import { e2eRoot } from '../config';
import logger, { formatArgs } from './logger';

const mcpRoot = path.join(__dirname, '..');

const loadTypeScriptModule = async (modulePath: string) => {
  void require('tsx/cjs');
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(modulePath);
    logger.info(formatArgs(`✅ Loaded step module: ${modulePath}`));
  } catch (err) {
    logger.warn(formatArgs(`⚠️ Failed to load step module: ${modulePath}`, err));
  }
};

const loadStepModulesRecursively = async (dir: string): Promise<void> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await loadStepModulesRecursively(fullPath);
          return;
        }
        if (!entry.isFile()) return;
        if (!/\.(ts|js)$/.test(entry.name) || entry.name.endsWith('.d.ts')) return;
        await loadTypeScriptModule(fullPath);
      }),
    );
  } catch (err) {
    logger.warn(formatArgs(`⚠️ Failed to scan step directory ${dir}:`, err));
  }
};

export const initializeStepFinder = async () => {
  const stepDirs = [
    path.join(e2eRoot, 'steps'),
    path.join(mcpRoot, 'sd'),
  ];

  await Promise.all(stepDirs.map(async (dir) => loadStepModulesRecursively(dir)));

  const stepFinderPath = path.join(
    e2eRoot,
    'node_modules',
    'playwright-bdd',
    'dist',
    'steps',
    'finder.js',
  );
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { StepFinder } = require(stepFinderPath);

  try {
    const stepRegistryPath = path.join(
      e2eRoot,
      'node_modules',
      'playwright-bdd',
      'dist',
      'steps',
      'stepRegistry.js',
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const { stepDefinitions } = require(stepRegistryPath);
    logger.info(formatArgs(`📊 Registered step definitions: ${stepDefinitions.length}`));
    stepDefinitions.slice(0, 3).forEach((definition: any, idx: number) => {
      logger.info(formatArgs(`  ${idx + 1}. ${definition.keyword} ${definition.patternString}`));
    });
  } catch (err) {
    logger.warn(formatArgs('⚠️ Unable to read step registry:', err));
  }

  return StepFinder;
};
