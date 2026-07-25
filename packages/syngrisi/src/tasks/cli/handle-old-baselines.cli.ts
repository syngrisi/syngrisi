#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { handleOldBaselinesTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    days: number;
    keepLast: number;
    remove: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        days: 120,
        keepLast: 5,
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
        } else if (arg === '--keep-last' || arg === '-k') {
            const keepLastValue = parseInt(args[++i], 10);
            if (isNaN(keepLastValue)) {
                console.error('Error: --keep-last must be a valid number');
                process.exit(1);
            }
            options.keepLast = keepLastValue;
        } else if (arg === '--remove' || arg === '-r') {
            options.remove = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: handle-old-baselines [options]

Options:
  --days <number>, -d <number>        Age threshold in days (default: 120)
  --keep-last <number>, -k <number>   Keep last N accepted baselines per identity (default: 5, min 1)
  --remove, -r                        Actually remove (default: false, dry run mode)
  --help, -h                          Show this help message

Description:
  Removes accepted baselines that are older than --days AND outside the last
  --keep-last per check identity (name+app+branch+browser+viewport+os).
  The newest baseline per identity is NEVER deleted.

Examples:
  # Dry run
  yarn task:old-baselines

  # Dry run with custom thresholds
  yarn task:old-baselines -- --days 90 --keep-last 3

  # Actually remove
  yarn task:old-baselines -- --days 120 --keep-last 5 --remove
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Handle Old Baselines');
    console.log(`Days threshold: ${options.days}`);
    console.log(`Keep last: ${options.keepLast}`);
    console.log(`Mode: ${options.remove ? 'REMOVE (will delete items)' : 'DRY RUN (shows statistics without deleting)'}\n`);

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await handleOldBaselinesTask(options, output);
        });
        console.log('\n✓ Task completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('\n✗ Task failed:', err);
        process.exit(1);
    }
}

export { main };

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    main();
}
