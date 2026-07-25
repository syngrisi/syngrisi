#!/usr/bin/env node
import { runMongoCode } from '../lib/utils';
import { handleOrphanSnapshotsTask } from '../core';
import { ConsoleOutputWriter } from '../lib/output-writer';

interface CliOptions {
    dryRun: boolean;
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {
        dryRun: true,
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
Usage: handle-orphan-snapshots [options]

Options:
  --execute, -e     Actually remove orphan snapshots (default: false)
  --dry-run, -d     Only show statistics without removing (default: true)
  --help, -h        Show this help message

Description:
  Finds Snapshot documents that are not referenced by any Baseline.snapshootId
  or Check (baselineId / actualSnapshotId / diffId), and optionally deletes them
  (including PNG files when this was the last snapshot for that filename).

  Use after baseline retention cleanup when snapshot/file cleanup did not finish.

Examples:
  yarn task:orphan-snapshots
  yarn task:orphan-snapshots -- --execute
`);
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'EXECUTE'}\n`);
    if (!options.dryRun) {
        console.log('WARNING: This will permanently delete orphan snapshots and their files!\n');
    }

    await runMongoCode(async () => {
        const output = new ConsoleOutputWriter();
        await handleOrphanSnapshotsTask(options, output);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

export { main };
