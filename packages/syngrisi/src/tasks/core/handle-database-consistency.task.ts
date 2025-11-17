import { promises as fsp } from 'fs';
// @ts-ignore
import st from 'string-table';
import path from 'path';
import mongoose from 'mongoose';
import { config } from '@config';
import { IOutputWriter } from '../lib/output-writer';
import {
    Snapshot,
    Check,
    Test,
    Run,
    Suite,
    Baseline,
} from '../lib';

interface StringTable {
    create(data: Array<Record<string, string | number>>): string;
}

const stringTable: StringTable = st;

// Supported image formats
const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function parseHrtimeToSeconds(hrtime: [number, number]): string {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

function isImageFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
}

interface FileEntry {
    name: string;
    isDirectory(): boolean;
}

export interface HandleDatabaseConsistencyOptions {
    clean: boolean;
}

/**
 * Handle database consistency task
 * Checks and optionally removes inconsistent elements from the database
 *
 * @param options - Task options
 * @param output - Output writer for streaming results
 */
export async function handleDatabaseConsistencyTask(
    options: HandleDatabaseConsistencyOptions,
    output: IOutputWriter
): Promise<void> {
    try {
        const startTime = process.hrtime();
        output.write('- starting...\n');

        // Validate config before starting
        output.write('> validating configuration');
        try {
            await fsp.access(config.defaultImagesPath);
        } catch {
            throw new Error(`Images directory not found or not accessible: ${config.defaultImagesPath}`);
        }

        output.write('---------------------------------');
        output.write('STAGE #1: Calculate Common stats');

        output.write('get baselines count');
        const baselinesCount = await Baseline.countDocuments();
        output.write('get runs count');
        const runsCount = await Run.countDocuments();
        output.write('get suites count');
        const suitesCount = await Suite.countDocuments();
        output.write('get tests count');
        const testsCount = await Test.countDocuments();
        output.write('get checks count');
        const checksCount = await Check.countDocuments();
        output.write('get snapshots count');
        const snapshotsCount = await Snapshot.countDocuments();

        output.write('get files data');
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: FileEntry) => !item.isDirectory())
            .map((x: FileEntry) => x.name)
            .filter((filename: string) => isImageFile(filename));

        output.write('-----------------------------');
        const beforeStatTable = stringTable.create([
            { item: 'baselines', count: baselinesCount },
            { item: 'suites', count: suitesCount },
            { item: 'runs', count: runsCount },
            { item: 'tests', count: testsCount },
            { item: 'checks', count: checksCount },
            { item: 'snapshots', count: snapshotsCount },
            { item: 'files', count: allFilesBefore.length },
        ]);
        output.flush?.();
        output.write(beforeStatTable);

        output.write('---------------------------------');
        output.write('STAGE #2: Calculate Inconsistent Items');

        // Build baseline snapshot references - CRITICAL: these snapshots must NEVER be deleted
        output.write('> building baseline snapshot references (protected from deletion)');
        const baselineSnapshotIds = new Set<string>();
        const baselineSnapshotFilenames = new Set<string>();
        const baselineCursor = Baseline.find().select('snapshootId').cursor();
        let baselinesProcessed = 0;

        for await (const baseline of baselineCursor) {
            if (baseline.snapshootId) {
                baselineSnapshotIds.add(baseline.snapshootId.toString());
            }
            baselinesProcessed++;
            if (baselinesProcessed % 10000 === 0) {
                output.write(`>> processed ${baselinesProcessed} baselines...`);
            }
        }
        output.write(`>> found ${baselineSnapshotIds.size} snapshots referenced by ${baselinesProcessed} baselines (PROTECTED)`);

        // Build snapshot filenames set using cursor
        output.write('> building snapshot filenames index');
        const snapshotFilenamesSet = new Set<string>();
        const snapshotIdsSet = new Set<string>();
        const snapshotsByFilename = new Map<string, string>();

        let snapshotsProcessed = 0;
        const snapshotCursor = Snapshot.find().select('filename _id').cursor();
        for await (const snapshot of snapshotCursor) {
            const snapshotId = snapshot._id.toString();
            if (snapshot.filename) {
                snapshotFilenamesSet.add(snapshot.filename);
                snapshotsByFilename.set(snapshot.filename, snapshotId);

                // Track filenames of baseline-protected snapshots
                if (baselineSnapshotIds.has(snapshotId)) {
                    baselineSnapshotFilenames.add(snapshot.filename);
                }
            }
            snapshotIdsSet.add(snapshotId);
            snapshotsProcessed++;
            if (snapshotsProcessed % 10000 === 0) {
                output.write(`>> processed ${snapshotsProcessed} snapshots...`);
            }
        }
        output.write(`>> indexed ${snapshotIdsSet.size} snapshots with ${snapshotFilenamesSet.size} unique filenames`);
        output.write(`>> ${baselineSnapshotFilenames.size} snapshot files are protected by baseline references`);

        // Calculate abandoned snapshots (snapshots without files)
        // IMPORTANT: Exclude snapshots referenced by baselines
        output.write('> calculate abandoned snapshots (checking file existence)');
        const abandonedSnapshotIds: string[] = [];
        const protectedSnapshotsSkipped: string[] = [];
        let filesChecked = 0;

        for (const [filename, snapshotId] of snapshotsByFilename.entries()) {
            // CRITICAL: Skip snapshots that are referenced by baselines
            if (baselineSnapshotIds.has(snapshotId)) {
                protectedSnapshotsSkipped.push(snapshotId);
                filesChecked++;
                continue;
            }

            try {
                await fsp.access(path.join(config.defaultImagesPath, filename));
            } catch {
                // File doesn't exist and snapshot is not protected by baseline
                abandonedSnapshotIds.push(snapshotId);
            }
            filesChecked++;
            if (filesChecked % 1000 === 0) {
                output.write(`>> checked ${filesChecked}/${snapshotsByFilename.size} files (${(filesChecked / snapshotsByFilename.size * 100).toFixed(1)}%)`);
            }
        }
        output.write(`>> found ${abandonedSnapshotIds.length} abandoned snapshots`);
        output.write(`>> skipped ${protectedSnapshotsSkipped.length} snapshots (protected by baselines)`);

        // Calculate abandoned files (files without snapshots)
        // IMPORTANT: Exclude files that belong to baseline-referenced snapshots
        output.write('> calculate abandoned files');
        const abandonedFiles: string[] = [];
        const protectedFilesSkipped: string[] = [];

        for (const file of allFilesBefore) {
            // CRITICAL: Skip files that are protected by baseline references
            if (baselineSnapshotFilenames.has(file)) {
                protectedFilesSkipped.push(file);
                continue;
            }

            // File is abandoned if no snapshot references it
            if (!snapshotFilenamesSet.has(file)) {
                abandonedFiles.push(file);
            }
        }
        output.write(`>> found ${abandonedFiles.length} abandoned files`);
        output.write(`>> skipped ${protectedFilesSkipped.length} files (protected by baseline snapshots)`);

        // Build checks index using cursor
        output.write('> building checks index');
        const checksTestIds = new Set<string>();
        const checksRunIds = new Set<string>();
        const checksSuiteIds = new Set<string>();
        const abandonedCheckIds: string[] = [];

        let checksProcessed = 0;
        const checkCursor = Check.find()
            .select('_id test run suite baselineId actualSnapshotId')
            .cursor();

        for await (const check of checkCursor) {
            const checkId = check._id.toString();
            const baselineId = check.baselineId?.toString();
            const actualSnapshotId = check.actualSnapshotId?.toString();

            // Check if snapshots exist
            if (!baselineId || !actualSnapshotId ||
                !snapshotIdsSet.has(baselineId) ||
                !snapshotIdsSet.has(actualSnapshotId)) {
                abandonedCheckIds.push(checkId);
            } else {
                // Valid check - collect references
                if (check.test) checksTestIds.add(check.test.toString());
                if (check.run) checksRunIds.add(check.run.toString());
                if (check.suite) checksSuiteIds.add(check.suite.toString());
            }

            checksProcessed++;
            if (checksProcessed % 10000 === 0) {
                output.write(`>> processed ${checksProcessed} checks...`);
            }
        }
        output.write(`>> processed ${checksProcessed} checks`);
        output.write(`>> found ${abandonedCheckIds.length} abandoned checks`);

        // Calculate empty tests (tests without checks)
        output.write('> calculate empty tests');
        const emptyTestIds: string[] = [];
        const testCursor = Test.find().select('_id').cursor();
        for await (const test of testCursor) {
            if (!checksTestIds.has(test._id.toString())) {
                emptyTestIds.push(test._id.toString());
            }
        }
        output.write(`>> found ${emptyTestIds.length} empty tests`);

        // Calculate empty runs (runs without checks)
        output.write('> calculate empty runs');
        const emptyRunIds: string[] = [];
        const runCursor = Run.find().select('_id').cursor();
        for await (const run of runCursor) {
            if (!checksRunIds.has(run._id.toString())) {
                emptyRunIds.push(run._id.toString());
            }
        }
        output.write(`>> found ${emptyRunIds.length} empty runs`);

        // Calculate empty suites (suites without checks)
        output.write('> calculate empty suites');
        const emptySuiteIds: string[] = [];
        const suiteCursor = Suite.find().select('_id').cursor();
        for await (const suite of suiteCursor) {
            if (!checksSuiteIds.has(suite._id.toString())) {
                emptySuiteIds.push(suite._id.toString());
            }
        }
        output.write(`>> found ${emptySuiteIds.length} empty suites`);
        output.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        output.write('Current inconsistent items:');
        const inconsistentStatTable = stringTable.create([
            { item: 'empty suites', count: emptySuiteIds.length },
            { item: 'empty runs', count: emptyRunIds.length },
            { item: 'empty tests', count: emptyTestIds.length },
            { item: 'abandoned checks', count: abandonedCheckIds.length },
            { item: 'abandoned snapshots', count: abandonedSnapshotIds.length },
            { item: 'abandoned files', count: abandonedFiles.length },
        ]);
        output.write(inconsistentStatTable);

        // Show samples of items to be removed
        const showSample = (items: string[], label: string) => {
            if (items.length > 0) {
                output.write(`\n> Sample ${label} (first 5):`);
                items.slice(0, 5).forEach((id) => {
                    output.write(`  - ${id}`);
                });
                if (items.length > 5) {
                    output.write(`  ... and ${items.length - 5} more`);
                }
            }
        };

        showSample(emptySuiteIds, 'empty suite IDs');
        showSample(emptyRunIds, 'empty run IDs');
        showSample(emptyTestIds, 'empty test IDs');
        showSample(abandonedCheckIds, 'abandoned check IDs');
        showSample(abandonedSnapshotIds, 'abandoned snapshot IDs');
        showSample(abandonedFiles, 'abandoned files');

        if (options.clean) {
            output.write('---------------------------------');
            output.write('STAGE #3: Remove non consistent items');

            // Start a MongoDB session for transaction
            const session = await mongoose.startSession();
            let dbOperationSuccess = false;

            try {
                await session.startTransaction();

                output.write('> remove empty suites');
                const suitesResult = await Suite.deleteMany(
                    { _id: { $in: emptySuiteIds } },
                    { session }
                );
                output.write(`>> deleted ${suitesResult.deletedCount} suites`);

                output.write('> remove empty runs');
                const runsResult = await Run.deleteMany(
                    { _id: { $in: emptyRunIds } },
                    { session }
                );
                output.write(`>> deleted ${runsResult.deletedCount} runs`);

                output.write('> remove empty tests');
                const testsResult = await Test.deleteMany(
                    { _id: { $in: emptyTestIds } },
                    { session }
                );
                output.write(`>> deleted ${testsResult.deletedCount} tests`);

                output.write('> remove abandoned checks');
                const checksResult = await Check.deleteMany(
                    { _id: { $in: abandonedCheckIds } },
                    { session }
                );
                output.write(`>> deleted ${checksResult.deletedCount} checks`);

                output.write('> remove abandoned snapshots');
                const snapshotsResult = await Snapshot.deleteMany(
                    { _id: { $in: abandonedSnapshotIds } },
                    { session }
                );
                output.write(`>> deleted ${snapshotsResult.deletedCount} snapshots`);

                await session.commitTransaction();
                output.write('>> database transaction committed successfully');
                dbOperationSuccess = true;
            } catch (error) {
                await session.abortTransaction();
                output.write('>> database transaction aborted due to error');
                throw error;
            } finally {
                await session.endSession();
            }

            // Only remove files if database operations succeeded
            if (dbOperationSuccess) {
                output.write('> remove abandoned files');
                const batchSize = 100;
                let removedCount = 0;
                const failedFiles: Array<{ filename: string; error: string }> = [];

                for (let i = 0; i < abandonedFiles.length; i += batchSize) {
                    const batch = abandonedFiles.slice(i, i + batchSize);
                    output.write(`>> processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(abandonedFiles.length / batchSize)}`);

                    const results = await Promise.allSettled(
                        batch.map((filename) =>
                            fsp.unlink(path.join(config.defaultImagesPath, filename))
                        )
                    );

                    results.forEach((result, index) => {
                        if (result.status === 'fulfilled') {
                            removedCount++;
                        } else {
                            failedFiles.push({
                                filename: batch[index],
                                error: result.reason?.message || 'Unknown error'
                            });
                        }
                    });
                }

                output.write(`>> successfully removed: ${removedCount} files`);
                if (failedFiles.length > 0) {
                    output.write(`>> failed to remove: ${failedFiles.length} files`);
                    failedFiles.slice(0, 10).forEach(({ filename, error }) => {
                        output.write(`   - ${filename}: ${error}`);
                    });
                    if (failedFiles.length > 10) {
                        output.write(`   ... and ${failedFiles.length - 10} more failures`);
                    }
                }
            }

            const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                .filter((item: FileEntry) => !item.isDirectory())
                .map((x: FileEntry) => x.name)
                .filter((filename: string) => isImageFile(filename));

            output.write('STAGE #4: Calculate Common stats after cleaning');
            output.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            output.write('Current items:');
            const afterStatTable = stringTable.create([
                { item: 'baselines', count: await Baseline.countDocuments() },
                { item: 'suites', count: await Suite.countDocuments() },
                { item: 'runs', count: await Run.countDocuments() },
                { item: 'tests', count: await Test.countDocuments() },
                { item: 'checks', count: await Check.countDocuments() },
                { item: 'snapshots', count: await Snapshot.countDocuments() },
                { item: 'files', count: allFilesAfter.length },
            ]);
            output.write(afterStatTable);
        } else {
            output.write('\n⚠️  DRY RUN MODE - No items were actually removed');
            output.write('   Run with --clean flag to perform actual cleanup\n');
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        const elapsedMinutes = (Number(elapsedSeconds) / 60).toFixed(2);
        output.write(`> Done in ${elapsedSeconds} seconds (${elapsedMinutes} min)`);
        output.write('- end...\n');
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
        output.write(`Error: ${errMsg}`);
        throw e;
    } finally {
        output.end();
    }
}
