#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { removeOldLogsTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    days: number;
    dryRun: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        days: 30,
        dryRun: true,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--days' || arg === '-d') {
            const daysValue = parseInt(args[++i], 10);
            if (isNaN(daysValue)) {
                console.error('Error: --days must be a valid number');
                process.exit(1);
            }
            options.days = daysValue;
        } else if (arg === '--remove' || arg === '-r') {
            options.dryRun = false;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else if (!arg.startsWith('-')) {
            // Support positional arguments: days [dryRun]
            const daysValue = parseInt(arg, 10);
            if (!isNaN(daysValue)) {
                options.days = daysValue;
                if (args[i + 1] === 'false') {
                    options.dryRun = false;
                    i++;
                }
            }
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: remove-old-logs [options] [days] [dryRun]

Options:
  --days <number>, -d <number>  Remove logs older than this many days (default: 30)
  --remove, -r                  Actually remove old logs (default: false, only show statistics)
  --help, -h                    Show this help message

Positional arguments:
  days         Number of days (alternative to --days)
  dryRun       'false' to remove items (alternative to --remove)

Description:
  Removes logs that are older than specified days.

Examples:
  # Show statistics only (dry run)
  npm run task:old-logs

  # Show statistics for logs older than 60 days
  npm run task:old-logs -- --days 60

  # Remove logs older than 30 days
  npm run task:old-logs -- --remove

  # Remove logs older than 60 days (using positional args)
  npm run task:old-logs -- 60 false
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Remove Old Logs');
    console.log(`Days threshold: ${options.days}`);
    console.log(`Mode: ${options.dryRun ? 'DRY RUN (statistics only)' : 'REMOVE (will delete items)'}\n`);

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await removeOldLogsTask(options, output);
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
