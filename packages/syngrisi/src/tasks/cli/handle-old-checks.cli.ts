#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { handleOldChecksTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    days: number;
    remove: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        days: 180,
        remove: false,
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
            options.remove = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else if (!arg.startsWith('-')) {
            // Support positional arguments: days [remove]
            const daysValue = parseInt(arg, 10);
            if (!isNaN(daysValue)) {
                options.days = daysValue;
                if (args[i + 1] === 'true') {
                    options.remove = true;
                    i++;
                }
            }
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: handle-old-checks [options] [days] [remove]

Options:
  --days <number>, -d <number>  Check older than this many days (default: 180)
  --remove, -r                  Actually remove old checks (default: false, dry run mode)
  --help, -h                    Show this help message

Positional arguments:
  days        Number of days (alternative to --days)
  remove      'true' to remove items (alternative to --remove)

Description:
  Removes checks and related items that are older than specified days.
  By default runs in DRY RUN mode - shows statistics of what would be deleted
  including the total volume of data in GB, without actually deleting anything.

  ⚠️ We strongly recommend running the 'handle-database-consistency' task
  before and after removing checks via this task.

Examples:
  # Dry run: show statistics for checks older than 180 days (default)
  npm run task:old-checks

  # Dry run: show statistics for checks older than 90 days
  npm run task:old-checks -- --days 90

  # Actually remove checks older than 180 days
  npm run task:old-checks -- --remove

  # Actually remove checks older than 90 days (using positional args)
  npm run task:old-checks -- 90 true
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Handle Old Checks');
    console.log(`Days threshold: ${options.days}`);
    console.log(`Mode: ${options.remove ? 'REMOVE (will delete items)' : 'DRY RUN (shows statistics without deleting)'}\n`);

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await handleOldChecksTask(options, output);
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
