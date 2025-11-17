#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { handleOrphanFilesTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    dryRun: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        dryRun: true, // dry-run by default for safety
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--execute' || arg === '-e') {
            options.dryRun = false;
        } else if (arg === '--dry-run' || arg === '-d') {
            options.dryRun = true;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        }
    }

    return options;
}

function printHelp() {
    console.log(`
Usage: handle-orphan-files [options]

Options:
  --execute, -e     Actually remove orphan files (default: false)
  --dry-run, -d     Only show statistics without removing (default: true)
  --help, -h        Show this help message

Description:
  Finds and removes image files that are not referenced by any Snapshot in the database.
  These orphan files consume disk space but are not used by the application.

  By default, runs in DRY RUN mode - only shows what would be removed without
  actually deleting anything. Use --execute flag to perform actual removal.

  The task shows:
  - Total number of files in the images directory
  - Number of files referenced by snapshots
  - Number of orphan files (not referenced)
  - Total size before and after cleanup
  - Space that will be freed

Examples:
  # Show statistics for orphan files (dry run, default)
  npm run task:orphan-files

  # Show statistics explicitly in dry-run mode
  npm run task:orphan-files -- --dry-run

  # Actually remove orphan files
  npm run task:orphan-files -- --execute

  # Show help
  npm run task:orphan-files -- --help

⚠️  IMPORTANT:
  - Always run in dry-run mode first to review what will be deleted
  - Make sure you have a backup before running with --execute
  - Orphan files might exist due to:
    * Manual file system operations
    * Database inconsistencies
    * Failed cleanup operations
    * Migration issues
    `);
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    console.log('Running task: Handle Orphan Files');
    console.log(`Mode: ${options.dryRun ? 'DRY RUN (statistics only, no files will be removed)' : 'EXECUTE (will delete orphan files)'}\n`);

    if (!options.dryRun) {
        console.log('⚠️  WARNING: This will permanently delete orphan files!');
        console.log('⚠️  Make sure you have reviewed the dry-run output first.\n');
    }

    try {
        await runMongoCode(async () => {
            const output = new ConsoleOutputWriter();
            await handleOrphanFilesTask(options, output);
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
