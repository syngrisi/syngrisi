#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { handleDatabaseConsistencyTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    clean?: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        clean: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--clean' || arg === '-c') {
            options.clean = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: handle-database-consistency [options]

Options:
  --clean, -c     Actually remove inconsistent items (default: false, only show statistics)
  --help, -h      Show this help message

Description:
  Checks and optionally removes inconsistent elements from the database:
  - Abandoned snapshots (snapshots without files)
  - Abandoned files (files without snapshot records)
  - Abandoned checks (checks without snapshots)
  - Empty tests (tests without checks)
  - Empty runs (runs without checks)
  - Empty suites (suites without checks)

Examples:
  # Show statistics only (dry run)
  npm run task:consistency

  # Remove inconsistent items
  npm run task:consistency -- --clean
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Handle Database Consistency');
    console.log(`Mode: ${options.clean ? 'CLEAN (will remove items)' : 'DRY RUN (statistics only)'}\n`);

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await handleDatabaseConsistencyTask({ clean: options.clean || false }, output);
        });
        console.log('\n✓ Task completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('\n✗ Task failed:', err);
        process.exit(1);
    }
}

export { main };

// Run if called directly (ES modules compatible check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    main();
}
