import path from 'node:path';
import { e2eRoot } from './config';

const testDir = __dirname;

export const bddConfig = {
  outputDir: testDir,
  featuresRoot: e2eRoot,
  features: [path.join(e2eRoot, 'features/**/*.feature')],
  steps: [
    path.join(e2eRoot, 'support/params.ts'),
    path.join(e2eRoot, 'steps/**/*.ts'),
    path.join(__dirname, 'sd/**/*.ts'),
  ],
  importTestFrom: path.join(e2eRoot, 'support/fixtures/index.ts'),
};
