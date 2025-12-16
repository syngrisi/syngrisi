#!/usr/bin/env node
import * as readline from 'readline';
import { runMongoCode } from '../lib/utils';
import { handleDatabaseConsistencyTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    clean?: boolean;
    yes?: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        clean: false,
        yes: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--clean' || arg === '-c') {
            options.clean = true;
        } else if (arg === '--yes' || arg === '-y') {
            options.yes = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else if (arg.startsWith('--') || arg.startsWith('-')) {
            console.error(`Unknown option: ${arg}`);
            console.error('Run with --help to see available options');
            process.exit(1);
        }
    }

    return options;
}

async function confirm(question: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

function printHelp() {
    console.log(`
Usage: handle-database-consistency [options]

Options:
  --clean, -c     Actually remove inconsistent items (default: false, only show statistics)
  --yes, -y       Skip confirmation prompt (use with --clean)
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

  # Remove inconsistent items (with confirmation prompt)
  npm run task:consistency -- --clean

  # Remove inconsistent items without confirmation
  npm run task:consistency -- --clean --yes
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Handle Database Consistency');
    console.log(`Mode: ${options.clean ? 'CLEAN (will remove items)' : 'DRY RUN (statistics only)'}\n`);

    // Ask for confirmation if --clean is used and --yes is not
    if (options.clean && !options.yes) {
        console.log('⚠️  WARNING: This will permanently delete inconsistent items from the database and filesystem!');
        const confirmed = await confirm('\nAre you sure you want to proceed? (y/N): ');
        if (!confirmed) {
            console.log('Operation cancelled.');
            process.exit(0);
        }
        console.log('');
    }

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await handleDatabaseConsistencyTask({ clean: options.clean || false }, output);
        });
        console.log('\n✓ Task completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('\n✗ Task failed:');
        if (err instanceof Error) {
            console.error(`  ${err.message}`);
            if (err.stack) {
                console.error('\nStack trace:');
                console.error(err.stack);
            }
        } else {
            console.error(String(err));
        }
        process.exit(1);
    }
}

export { main };

// Run if called directly (ES modules compatible check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    main();
}
