#!/usr/bin/env node
import process from 'node:process';

import { runTestEngineCli } from './test-engine';

void runTestEngineCli(process.argv.slice(2)).then((exitCode) => {
  process.exitCode = exitCode;
}).catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
