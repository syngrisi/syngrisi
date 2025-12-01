#!/usr/bin/env node
import process from 'node:process';

import { runBridge } from './bridge';
import { formatError } from './utils/common';

void runBridge({ logPrefix: '[bridge-cli]' }).catch((error) => {
  process.stderr.write(`[bridge-cli] Critical error: ${formatError(error)}\n`);
  process.exitCode = 1;
});
