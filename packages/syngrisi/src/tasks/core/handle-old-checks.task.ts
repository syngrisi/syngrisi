/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp } from 'fs';
import { Dirent } from 'fs';
// @ts-ignore
import st from 'string-table';
import path from 'path';
import mongoose from 'mongoose';
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
 * PERFORMANCE OPTIMIZATIONS:
 * - Uses countDocuments() instead of loading full collections for statistics
 * - Uses aggregation pipelines with $group to collect unique IDs (avoids 16MB distinct limit)
 * - Only loads required fields (projections) when full documents are needed
 * - Processes file operations in batches to avoid memory spikes
 * - Reuses computed data to avoid redundant queries
 * - Aggregation pipelines work efficiently even with millions of documents
 *
 * RECOMMENDED DATABASE INDEXES for optimal performance:
 * - Check.createdDate (for date-based queries)
 * - Check.baselineId, Check.actualSnapshotId, Check.diffId (for distinct queries)
 * - Snapshot.filename (for distinct filename queries)
 * - Baseline.snapshootId (for baseline preservation checks)
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

        output.write('> count all checks');
        const allChecksCountBefore = await Check.countDocuments().exec();
        output.write('> count snapshots');
        const allSnapshotsCountBefore = await Snapshot.countDocuments().exec();
        output.write('> get files data');
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: Dirent) => !item.isDirectory())
            .map((x: Dirent) => x.name)
            .filter((x: string) => x.includes('.png'));

        output.write('> count old checks');
        const oldChecksCount = await Check.countDocuments({ createdDate: { $lt: trashHoldDate } }).exec();

        output.write('>>> collect all baselineId snapshot IDs from old Checks ');
        // Use aggregation to avoid 16MB distinct limit
        const baselineIdResults = await Check.aggregate([
            { $match: { createdDate: { $lt: trashHoldDate }, baselineId: { $ne: null } } },
            { $group: { _id: '$baselineId' } },
            { $project: { _id: 1 } }
        ]).exec();
        const oldChecksBaselineSnapshotIds = baselineIdResults.map(doc => doc._id);

        output.write('>>> collect all actualSnapshotId from old Checks ');
        const actualSnapshotIdResults = await Check.aggregate([
            { $match: { createdDate: { $lt: trashHoldDate }, actualSnapshotId: { $ne: null } } },
            { $group: { _id: '$actualSnapshotId' } },
            { $project: { _id: 1 } }
        ]).exec();
        const oldChecksActualSnapshotIds = actualSnapshotIdResults.map(doc => doc._id);

        output.write('>>> collect all diffId snapshot IDs from old Checks ');
        const diffIdResults = await Check.aggregate([
            { $match: { createdDate: { $lt: trashHoldDate }, diffId: { $ne: null } } },
            { $group: { _id: '$diffId' } },
            { $project: { _id: 1 } }
        ]).exec();
        const oldChecksDiffSnapshotIds = diffIdResults.map(doc => doc._id);

        output.write('>>> calculate all unique snapshots ids for old Checks ');

        const allOldSnapshotsUniqueIds = Array.from(new Set([
            ...oldChecksBaselineSnapshotIds.filter(x => x != null),
            ...oldChecksActualSnapshotIds.filter(x => x != null),
            ...oldChecksDiffSnapshotIds.filter(x => x != null)
        ]));

        output.write('>>> collect filenames from old snapshots');
        // Only load filenames, not entire snapshot documents
        const oldSnapshotsData = await Snapshot.find(
            { _id: { $in: allOldSnapshotsUniqueIds } },
            { filename: 1 }
        ).lean().exec() as { filename?: string }[];

        // Calculate total size of old snapshot files
        output.write('>>> calculate total size of old snapshot files');
        const oldSnapshotsFilenames = Array.from(new Set(oldSnapshotsData.map(x => x.filename).filter((f): f is string => !!f)));
        let totalOldFilesSize = 0;

        // Process files in batches to avoid too many concurrent operations
        const BATCH_SIZE = 100;
        for (let i = 0; i < oldSnapshotsFilenames.length; i += BATCH_SIZE) {
            const batch = oldSnapshotsFilenames.slice(i, i + BATCH_SIZE);
            const batchResults = await Promise.allSettled(
                batch.map(async (filename) => {
                    const filePath = path.join(config.defaultImagesPath, filename);
                    const stats = await fsp.stat(filePath);
                    return stats.size;
                })
            );

            for (const result of batchResults) {
                if (result.status === 'fulfilled') {
                    totalOldFilesSize += result.value;
                }
                // Silently skip files that don't exist
            }
        }
        const totalOldFilesSizeGB = (totalOldFilesSize / (1024 * 1024 * 1024)).toFixed(3);

        const outTable = stringTable.create([
            { item: 'all checks', count: allChecksCountBefore },
            { item: 'all snapshots', count: allSnapshotsCountBefore },
            { item: 'all files', count: allFilesBefore.length },
            { item: `checks older than: '${options.days}' days`, count: oldChecksCount },
            { item: 'old checks baseline snapshot ids', count: oldChecksBaselineSnapshotIds.length },
            { item: 'old checks actual snapshot ids', count: oldChecksActualSnapshotIds.length },
            { item: 'old checks diff snapshot ids', count: oldChecksDiffSnapshotIds.length },
            { item: 'all old snapshots unique Ids', count: allOldSnapshotsUniqueIds.length },
            { item: 'old snapshot filenames', count: oldSnapshotsFilenames.length },
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
                // Use aggregation to avoid 16MB distinct limit
                const baselineAggregation = Baseline.aggregate([
                    { $match: { snapshootId: { $ne: null } } },
                    { $group: { _id: '$snapshootId' } },
                    { $project: { _id: 1 } }
                ]);
                if (useTransactions && session) {
                    baselineAggregation.session(session);
                }
                const baselinesSnapshotResults = await baselineAggregation.exec();
                const baselinesSnapshotIds = baselinesSnapshotResults.map(doc => doc._id);

                output.write('>>> get all checks baseline snapshot IDs');
                const checksBaselineAggregation = Check.aggregate([
                    { $match: { baselineId: { $ne: null } } },
                    { $group: { _id: '$baselineId' } },
                    { $project: { _id: 1 } }
                ]);
                if (useTransactions && session) {
                    checksBaselineAggregation.session(session);
                }
                const checksBaselineResults = await checksBaselineAggregation.exec();
                const checksBaselineSnapshotIds = checksBaselineResults.map(doc => doc._id);

                output.write('>>> get all checks actual snapshot IDs');
                const checksActualAggregation = Check.aggregate([
                    { $match: { actualSnapshotId: { $ne: null } } },
                    { $group: { _id: '$actualSnapshotId' } },
                    { $project: { _id: 1 } }
                ]);
                if (useTransactions && session) {
                    checksActualAggregation.session(session);
                }
                const checksActualResults = await checksActualAggregation.exec();
                const checksActualSnapshotIds = checksActualResults.map(doc => doc._id);

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
                output.write('>>> using previously collected old snapshots filenames');
                const oldSnapshotsUniqueFilenames = oldSnapshotsFilenames;
                output.write(`>> found: ${oldSnapshotsUniqueFilenames.length}`);

                output.write('> get all current snapshots filenames');
                // Use aggregation to avoid 16MB distinct limit
                const currentFilenamesResults = await Snapshot.aggregate([
                    { $match: { filename: { $ne: null } } },
                    { $group: { _id: '$filename' } },
                    { $project: { _id: 1 } }
                ]).exec();
                const allCurrentSnapshotsFilenames = currentFilenamesResults.map(doc => doc._id as string);

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
                const revalidateFilenamesResults = await Snapshot.aggregate([
                    { $match: { filename: { $ne: null } } },
                    { $group: { _id: '$filename' } },
                    { $project: { _id: 1 } }
                ]).exec();
                const currentSnapshotsBeforeDeletion = revalidateFilenamesResults.map(doc => doc._id as string);
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
                    failedResults.forEach((result) => {
                        if (result.status === 'rejected') {
                            output.write(`   - ${filesToDelete[fileDeleteResults.indexOf(result)]}: ${result.reason}`);
                        }
                    });
                }

                output.write(`>> done: ${successCount} files deleted successfully, ${failedResults.length} failed`);

                output.write('STAGE #3 Calculate common stats after Removing');

                output.write('> count all checks');
                const allChecksCountAfter = await Check.countDocuments().exec();
                output.write('> count snapshots');
                const allSnapshotsCountAfter = await Snapshot.countDocuments().exec();
                output.write('> get files data');
                const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                    .filter((item: Dirent) => !item.isDirectory())
                    .map((x: Dirent) => x.name)
                    .filter((x: string) => x.includes('.png'));

                const outTableAfter = stringTable.create([
                    { item: 'all checks', count: allChecksCountAfter },
                    { item: 'all snapshots', count: allSnapshotsCountAfter },
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
