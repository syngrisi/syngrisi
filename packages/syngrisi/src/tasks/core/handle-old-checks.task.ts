/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp } from 'fs';
// @ts-ignore
import st from 'string-table';
import path from 'path';
import { config } from '@config';
import { subDays, dateToISO8601 } from '@utils';
import { IOutputWriter } from '../lib/output-writer';
import {
    Snapshot,
    Check,
    Baseline,
} from '../lib';

interface StringTable {
    create(data: { [key: string]: any }[]): string;
}

const stringTable: StringTable = st;

function parseHrtimeToSeconds(hrtime: any) {
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

        output.write('STAGE #1 Calculate common stats');

        const trashHoldDate = subDays(new Date(), options.days);

        output.write('> get all checks data');
        const allChecksBefore = await Check.find().lean().exec();
        output.write('> get snapshots data');
        const allSnapshotsBefore = await Snapshot.find().lean().exec();
        output.write('> get files data');
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: any) => !item.isDirectory())
            .map((x: any) => x.name)
            .filter((x: any) => x.includes('.png'));

        output.write('> get old checks data');
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } }).lean().exec();

        output.write('>>> collect all baselineIds for old Checks ');
        const oldSnapshotsBaselineIdIds = oldChecks.map((x: any) => x.baselineId).filter((x: any) => x);

        output.write('>>> collect all actualSnapshotId for old Checks ');
        const oldSnapshotsActualSnapshotIdIds = oldChecks.map((x: any) => x.actualSnapshotId).filter((x: any) => x);

        output.write('>>> collect all diffId for old Checks ');
        const oldSnapshotsDiffIds = oldChecks.map((x: any) => x.diffId).filter((x: any) => x);

        output.write('>>> calculate all unique snapshots ids for old Checks ');

        const allOldSnapshotsUniqueIds = Array.from(new Set([...oldSnapshotsBaselineIdIds, ...oldSnapshotsActualSnapshotIdIds, ...oldSnapshotsDiffIds]))
            .map((x: any) => x.valueOf());

        output.write('>>> collect all old snapshots');
        const oldSnapshots = await Snapshot.find({ _id: { $in: allOldSnapshotsUniqueIds } }).lean();

        const outTable = stringTable.create([
            { item: 'all checks', count: allChecksBefore.length },
            { item: 'all snapshots', count: allSnapshotsBefore.length },
            { item: 'all files', count: allFilesBefore.length },
            { item: `checks older than: '${options.days}' days`, count: oldChecks.length },
            { item: 'old snapshots baseline ids', count: oldSnapshotsBaselineIdIds.length },
            { item: 'old snapshots actual snapshotId', count: oldSnapshotsActualSnapshotIdIds.length },
            { item: 'old snapshots diffIds', count: oldSnapshotsDiffIds.length },
            { item: 'all old snapshots unique Ids', count: allOldSnapshotsUniqueIds.length },
            { item: 'all old snapshots', count: oldSnapshots.length },
        ]);

        output.write(outTable);

        if (options.remove) {
            output.write(`STAGE #2 Remove checks that older that: '${options.days}' days, '${dateToISO8601(trashHoldDate)}'\n`);

            output.write('> remove checks');
            const checkRemovingResult = await Check.deleteMany({ createdDate: { $lt: trashHoldDate } });
            output.write(`>>> removed: '${checkRemovingResult.deletedCount}'`);

            output.write('> remove snapshots');

            output.write('>> collect data to removing');
            // NOTE: We get all Baseline snapshots to ensure we DON'T remove them
            // Baselines are reference/golden images and must be preserved
            output.write('>>> get all baselines snapshots id`s');
            const baselinesSnapshotsIds = (await Baseline.find({}).distinct('snapshootId'));

            output.write('>>> get all checks snapshots baselineId');
            const checksSnapshotsBaselineId = (await Check.find({}).distinct('baselineId'));

            output.write('>>> get all checks snapshots actualSnapshotId');
            const checksSnapshotsActualSnapshotId = (await Check.find({}).distinct('actualSnapshotId'));

            output.write('>> remove baselines snapshots');

            output.write('>> remove all old snapshots that not related to new baseline and check items');
            const removedByBaselineSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsBaselineIdIds } },
                ],
            });
            output.write(`>>> removed: '${removedByBaselineSnapshotsResult.deletedCount}'`);

            output.write('>> remove actual snapshots');
            output.write('>> remove all old snapshots that not related to new baseline and check items');
            const removedByActualSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsActualSnapshotIdIds } },
                ],
            });
            output.write(`>>> removed: '${removedByActualSnapshotsResult.deletedCount}'`);

            output.write('>> remove all old diff snapshots');
            const removedByDiffSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $in: oldSnapshotsDiffIds } },
                ],
            });
            output.write(`>>> removed: '${removedByDiffSnapshotsResult.deletedCount}'`);

            output.write('> remove files');
            output.write('>>> collect all old snapshots filenames');
            const oldSnapshotsUniqueFilenames = Array.from(new Set(oldSnapshots.map((x: any) => x.filename)));
            output.write(`>> found: ${oldSnapshotsUniqueFilenames.length}`);

            output.write('> get all current snapshots filenames');
            const allCurrentSnapshotsFilenames = await Snapshot.find().distinct('filename').exec();

            output.write('>> calculate interception between all current snapshot filenames and old shapshots filenames');
            const arrayIntersection = (arr1: any, arr2: any) => arr1.filter((x: any) => arr2.includes(x));
            const filesInterception = arrayIntersection(allCurrentSnapshotsFilenames, oldSnapshotsUniqueFilenames);
            output.write(`>> found: ${filesInterception.length}`);

            output.write('>> calculate filenames to remove');
            const arrayDiff = (arr1: any, arr2: any) => arr1.filter((x: any) => !arr2.includes(x));
            const filesToDelete = arrayDiff(oldSnapshotsUniqueFilenames, filesInterception);
            output.write(`>> found: ${filesToDelete.length}`);

            output.write(`>> remove these files: ${filesToDelete.length}`);
            await Promise.all(filesToDelete.map((filename: string) => fsp.unlink(path.join(config.defaultImagesPath, filename))));
            output.write(`>> done: ${filesToDelete.length}`);

            output.write('STAGE #3 Calculate common stats after Removing');

            output.write('> get all checks data');
            const allChecksAfter = await Check.find().lean().exec();
            output.write('> get snapshots data');
            const allSnapshotsAfter = await Snapshot.find().lean().exec();
            output.write('> get files data');
            const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                .filter((item: any) => !item.isDirectory())
                .map((x: any) => x.name)
                .filter((x: any) => x.includes('.png'));

            const outTableAfter = stringTable.create([
                { item: 'all checks', count: allChecksAfter.length },
                { item: 'all snapshots', count: allSnapshotsAfter.length },
                { item: 'all files', count: allFilesAfter.length },
            ]);

            output.write(outTableAfter);
        }
        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));

        output.write(`> done in ${elapsedSeconds} seconds ${elapsedSeconds / 60} min`);
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        output.write(errMsg);
        throw e;
    } finally {
        output.end();
    }
}
