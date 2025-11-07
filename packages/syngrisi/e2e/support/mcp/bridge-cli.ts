#!/usr/bin/env node
import process from 'node:process';
import { parseArgs } from 'node:util';

import { runBridge } from './bridge';
import { env } from './config';
import { formatError } from './utils/common';



const preferredPort = Number(env.MCP_DEFAULT_PORT)

void runBridge({ preferredPort, logPrefix: '[bridge-cli]' }).catch((error) => {
  process.stderr.write(`[bridge-cli] Critical error: ${formatError(error)}\n`);
  process.exitCode = 1;
});
