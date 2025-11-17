/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp } from 'fs';
import { Dirent } from 'fs';
// @ts-ignore
import st from 'string-table';
import path from 'path';
import mongoose, { Schema } from 'mongoose';
import { config } from '@config';
import { subDays, dateToISO8601 } from '@utils';
import { IOutputWriter } from '../lib/output-writer';
import {
    Snapshot,
    Check,
    Baseline,
} from '../lib';

interface StringTable {
    create(data: Record<string, string | number>[]): string;
}

interface CheckLean {
    _id: Schema.Types.ObjectId;
    baselineId?: Schema.Types.ObjectId;
    actualSnapshotId?: Schema.Types.ObjectId;
    diffId?: Schema.Types.ObjectId;
    createdDate: Date;
}

interface SnapshotLean {
    _id: Schema.Types.ObjectId;
    filename?: string;
}

const stringTable: StringTable = st;

function parseHrtimeToSeconds(hrtime: [number, number]): string {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

export interface HandleOldChecksOptions {
    days: number;
    remove: boolean;
}

/**
 * Handle old checks task
 * Removes checks and related items that are older than specified days
 *
 * IMPORTANT: Baseline records are NEVER removed automatically by this task.
 * Baselines represent the reference/golden images and should not be lost.
 * Only Checks and their associated Snapshots (actual, diff) are removed.
 * Baseline snapshots are preserved if they are still referenced by any Baseline.
 *
 * @param options - Task options
 * @param output - Output writer for streaming results
 */
export async function handleOldChecksTask(
    options: HandleOldChecksOptions,
    output: IOutputWriter
): Promise<void> {
    try {
        const startTime = process.hrtime();
        output.write('- starting...\n');

        // Validate that the images directory exists
        try {
            await fsp.access(config.defaultImagesPath);
            output.write(`> validated images directory: ${config.defaultImagesPath}`);
        } catch (error) {
            throw new Error(`Images directory does not exist or is not accessible: ${config.defaultImagesPath}`);
        }

        output.write('STAGE #1 Calculate common stats');

        const trashHoldDate = subDays(new Date(), options.days);

        output.write('> get all checks data');
        const allChecksBefore = await Check.find().lean().exec();
        output.write('> get snapshots data');
        const allSnapshotsBefore = await Snapshot.find().lean().exec();
        output.write('> get files data');
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: Dirent) => !item.isDirectory())
            .map((x: Dirent) => x.name)
            .filter((x: string) => x.includes('.png'));

        output.write('> get old checks data');
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } }).lean().exec() as CheckLean[];

        output.write('>>> collect all baselineId snapshot IDs from old Checks ');
        const oldChecksBaselineSnapshotIds = oldChecks.map((x: CheckLean) => x.baselineId).filter((x): x is Schema.Types.ObjectId => !!x);

        output.write('>>> collect all actualSnapshotId from old Checks ');
        const oldChecksActualSnapshotIds = oldChecks.map((x: CheckLean) => x.actualSnapshotId).filter((x): x is Schema.Types.ObjectId => !!x);

        output.write('>>> collect all diffId snapshot IDs from old Checks ');
        const oldChecksDiffSnapshotIds = oldChecks.map((x: CheckLean) => x.diffId).filter((x): x is Schema.Types.ObjectId => !!x);

        output.write('>>> calculate all unique snapshots ids for old Checks ');

        const allOldSnapshotsUniqueIds = Array.from(new Set([...oldChecksBaselineSnapshotIds, ...oldChecksActualSnapshotIds, ...oldChecksDiffSnapshotIds]))
            .map((x: Schema.Types.ObjectId) => x.valueOf());

        output.write('>>> collect all old snapshots');
        const oldSnapshots = await Snapshot.find({ _id: { $in: allOldSnapshotsUniqueIds } }).lean() as SnapshotLean[];

        // Calculate total size of old snapshot files
        output.write('>>> calculate total size of old snapshot files');
        const oldSnapshotsFilenames = Array.from(new Set(oldSnapshots.map((x: SnapshotLean) => x.filename).filter((f): f is string => !!f)));
        let totalOldFilesSize = 0;
        for (const filename of oldSnapshotsFilenames) {
            try {
                const filePath = path.join(config.defaultImagesPath, filename);
                const stats = await fsp.stat(filePath);
                totalOldFilesSize += stats.size;
            } catch (error) {
                // File might not exist, skip it
            }
        }
        const totalOldFilesSizeGB = (totalOldFilesSize / (1024 * 1024 * 1024)).toFixed(3);

        const outTable = stringTable.create([
            { item: 'all checks', count: allChecksBefore.length },
            { item: 'all snapshots', count: allSnapshotsBefore.length },
            { item: 'all files', count: allFilesBefore.length },
            { item: `checks older than: '${options.days}' days`, count: oldChecks.length },
            { item: 'old checks baseline snapshot ids', count: oldChecksBaselineSnapshotIds.length },
            { item: 'old checks actual snapshot ids', count: oldChecksActualSnapshotIds.length },
            { item: 'old checks diff snapshot ids', count: oldChecksDiffSnapshotIds.length },
            { item: 'all old snapshots unique Ids', count: allOldSnapshotsUniqueIds.length },
            { item: 'all old snapshots', count: oldSnapshots.length },
            { item: 'total size of old files', count: `${totalOldFilesSizeGB} GB` },
        ]);

        output.write(outTable);

        if (options.remove) {
            output.write(`STAGE #2 Remove checks that older that: '${options.days}' days, '${dateToISO8601(trashHoldDate)}'\n`);

            // Check if MongoDB is running as a replica set (required for transactions)
            let session: mongoose.ClientSession | null = null;
            let useTransactions = false;

            try {
                // Check MongoDB topology to determine if transactions are supported
                const admin = mongoose.connection.db?.admin();
                const serverInfo = await admin?.serverStatus();
                const isReplicaSet = serverInfo?.repl?.setName !== undefined;

                if (isReplicaSet) {
                    session = await mongoose.startSession();
                    session.startTransaction();
                    useTransactions = true;
                    output.write('> using transactions for data consistency (replica set detected)');
                } else {
                    output.write('> standalone MongoDB detected, proceeding without transactions');
                }
            } catch (error) {
                output.write('> could not determine MongoDB topology, proceeding without transactions');
                session = null;
            }

            try {
                output.write('> remove checks');
                const checkRemovingResult = useTransactions && session
                    ? await Check.deleteMany({ createdDate: { $lt: trashHoldDate } }, { session })
                    : await Check.deleteMany({ createdDate: { $lt: trashHoldDate } });
                output.write(`>>> removed: '${checkRemovingResult.deletedCount}'`);

            output.write('> remove snapshots');

                output.write('>> collect data to removing');
                // NOTE: We get all Baseline snapshots to ensure we DON'T remove them
                // Baselines are reference/golden images and must be preserved
                output.write('>>> get all baselines snapshot IDs');
                const baselinesSnapshotIds = useTransactions && session
                    ? await Baseline.distinct('snapshootId', {}).session(session)
                    : await Baseline.distinct('snapshootId', {});

                output.write('>>> get all checks baseline snapshot IDs');
                const checksBaselineSnapshotIds = useTransactions && session
                    ? await Check.distinct('baselineId', {}).session(session)
                    : await Check.distinct('baselineId', {});

                output.write('>>> get all checks actual snapshot IDs');
                const checksActualSnapshotIds = useTransactions && session
                    ? await Check.distinct('actualSnapshotId', {}).session(session)
                    : await Check.distinct('actualSnapshotId', {});

                output.write('>> remove baselines snapshots');

                output.write('>> remove all old snapshots that not related to new baseline and check items');
                const removedByBaselineSnapshotsResult = useTransactions && session
                    ? await Snapshot.deleteMany({
                        $and: [
                            { _id: { $nin: checksBaselineSnapshotIds } },
                            { _id: { $nin: checksActualSnapshotIds } },
                            { _id: { $nin: baselinesSnapshotIds } },
                            { _id: { $in: oldChecksBaselineSnapshotIds } },
                        ],
                    }, { session })
                    : await Snapshot.deleteMany({
                        $and: [
                            { _id: { $nin: checksBaselineSnapshotIds } },
                            { _id: { $nin: checksActualSnapshotIds } },
                            { _id: { $nin: baselinesSnapshotIds } },
                            { _id: { $in: oldChecksBaselineSnapshotIds } },
                        ],
                    });
                output.write(`>>> removed: '${removedByBaselineSnapshotsResult.deletedCount}'`);

                output.write('>> remove actual snapshots');
                output.write('>> remove all old snapshots that not related to new baseline and check items');
                const removedByActualSnapshotsResult = useTransactions && session
                    ? await Snapshot.deleteMany({
                        $and: [
                            { _id: { $nin: checksBaselineSnapshotIds } },
                            { _id: { $nin: checksActualSnapshotIds } },
                            { _id: { $nin: baselinesSnapshotIds } },
                            { _id: { $in: oldChecksActualSnapshotIds } },
                        ],
                    }, { session })
                    : await Snapshot.deleteMany({
                        $and: [
                            { _id: { $nin: checksBaselineSnapshotIds } },
                            { _id: { $nin: checksActualSnapshotIds } },
                            { _id: { $nin: baselinesSnapshotIds } },
                            { _id: { $in: oldChecksActualSnapshotIds } },
                        ],
                    });
                output.write(`>>> removed: '${removedByActualSnapshotsResult.deletedCount}'`);

                output.write('>> remove all old diff snapshots');
                // NOTE: Diff snapshots are temporary comparison artifacts and are not referenced by Baselines.
                // Baselines only reference golden/baseline images via snapshootId field, never diff images.
                // Therefore, diff snapshots can be safely deleted without checking Baseline references.
                const removedByDiffSnapshotsResult = useTransactions && session
                    ? await Snapshot.deleteMany({
                        $and: [
                            { _id: { $in: oldChecksDiffSnapshotIds } },
                        ],
                    }, { session })
                    : await Snapshot.deleteMany({
                        $and: [
                            { _id: { $in: oldChecksDiffSnapshotIds } },
                        ],
                    });
                output.write(`>>> removed: '${removedByDiffSnapshotsResult.deletedCount}'`);

                // Commit the transaction after all DB operations (if using transactions)
                if (useTransactions && session) {
                    await session.commitTransaction();
                    output.write('>>> Database transaction committed successfully');
                }

                output.write('> remove files');
                output.write('>>> collect all old snapshots filenames');
                const oldSnapshotsUniqueFilenames = Array.from(new Set(oldSnapshots.map((x: SnapshotLean) => x.filename).filter((f): f is string => !!f)));
                output.write(`>> found: ${oldSnapshotsUniqueFilenames.length}`);

                output.write('> get all current snapshots filenames');
                const allCurrentSnapshotsFilenames = await Snapshot.find().distinct('filename').exec() as string[];

                output.write('>> calculate intersection between all current snapshot filenames and old snapshots filenames');
                const arrayIntersection = (arr1: string[], arr2: string[]) => arr1.filter((x: string) => arr2.includes(x));
                const filesIntersection = arrayIntersection(allCurrentSnapshotsFilenames, oldSnapshotsUniqueFilenames);
                output.write(`>> found: ${filesIntersection.length}`);

                output.write('>> calculate filenames to remove');
                const arrayDiff = (arr1: string[], arr2: string[]) => arr1.filter((x: string) => !arr2.includes(x));
                let filesToDelete = arrayDiff(oldSnapshotsUniqueFilenames, filesIntersection);
                output.write(`>> found: ${filesToDelete.length}`);

                // Re-check current snapshots right before deletion to prevent race condition
                output.write('>> re-validating files to delete to prevent race condition');
                const currentSnapshotsBeforeDeletion = await Snapshot.find().distinct('filename').exec() as string[];
                filesToDelete = filesToDelete.filter((filename: string) => !currentSnapshotsBeforeDeletion.includes(filename));
                output.write(`>> validated: ${filesToDelete.length} files safe to delete`);

                output.write(`>> remove these files: ${filesToDelete.length}`);
                const fileDeleteResults = await Promise.allSettled(
                    filesToDelete.map((filename: string) =>
                        fsp.unlink(path.join(config.defaultImagesPath, filename))
                    )
                );

                const successCount = fileDeleteResults.filter(r => r.status === 'fulfilled').length;
                const failedResults = fileDeleteResults.filter(r => r.status === 'rejected');

                if (failedResults.length > 0) {
                    output.write(`>> warning: ${failedResults.length} files failed to delete:`);
                    failedResults.forEach((result, index) => {
                        if (result.status === 'rejected') {
                            output.write(`   - ${filesToDelete[fileDeleteResults.indexOf(result)]}: ${result.reason}`);
                        }
                    });
                }

                output.write(`>> done: ${successCount} files deleted successfully, ${failedResults.length} failed`);

                output.write('STAGE #3 Calculate common stats after Removing');

                output.write('> get all checks data');
                const allChecksAfter = await Check.find().lean().exec();
                output.write('> get snapshots data');
                const allSnapshotsAfter = await Snapshot.find().lean().exec();
                output.write('> get files data');
                const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                    .filter((item: Dirent) => !item.isDirectory())
                    .map((x: Dirent) => x.name)
                    .filter((x: string) => x.includes('.png'));

                const outTableAfter = stringTable.create([
                    { item: 'all checks', count: allChecksAfter.length },
                    { item: 'all snapshots', count: allSnapshotsAfter.length },
                    { item: 'all files', count: allFilesAfter.length },
                ]);

                output.write(outTableAfter);
            } catch (operationError) {
                output.write('>>> Error during operation...');
                if (useTransactions && session) {
                    output.write('>>> Rolling back transaction...');
                    await session.abortTransaction();
                }
                throw operationError;
            } finally {
                if (session) {
                    session.endSession();
                }
            }
        }
        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        const elapsedMinutes = (parseFloat(elapsedSeconds) / 60).toFixed(2);

        output.write(`> done in ${elapsedSeconds} seconds (${elapsedMinutes} min)`);
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        output.write(errMsg);
        throw e;
    } finally {
        output.end();
    }
}
