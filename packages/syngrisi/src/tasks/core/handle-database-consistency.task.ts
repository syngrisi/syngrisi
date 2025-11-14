/* eslint-disable @typescript-eslint/no-explicit-any */
import fs, { promises as fsp } from 'fs';
// @ts-ignore
import st from 'string-table';
import path from 'path';
import { config } from '@config';
import { ProgressBar } from '@utils';
import { IOutputWriter } from '../lib/output-writer';
import {
    Snapshot,
    Check,
    Test,
    Run,
    Suite,
} from '../lib';

interface StringTable {
    create(data: { [key: string]: any }[]): string;
}

const stringTable: StringTable = st;

function parseHrtimeToSeconds(hrtime: any) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
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
        output.write('---------------------------------');
        output.write('STAGE #1: Calculate Common stats');
        output.write('get runs data');
        const allRunsBefore = await Run.find().exec();
        output.write('get suites data');
        const allSuitesBefore = await Suite.find().exec();
        output.write('get tests data');
        const allTestsBefore = await Test.find().lean().exec();
        output.write('get checks data');
        const allChecksBefore = await Check.find().lean().exec();
        output.write('get snapshots data');
        const allSnapshotsBefore = await Snapshot.find().lean().exec();
        output.write('get files data');
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: any) => !item.isDirectory())
            .map((x: any) => x.name)
            .filter((x: any) => x.includes('.png'));

        output.write('-----------------------------');
        const beforeStatTable = stringTable.create([
            { item: 'suites', count: allSuitesBefore.length },
            { item: 'runs', count: allRunsBefore.length },
            { item: 'tests', count: allTestsBefore.length },
            { item: 'checks', count: allChecksBefore.length },
            { item: 'snapshots', count: allSnapshotsBefore.length },
            { item: 'files', count: allFilesBefore.length },
        ]);
        output.flush?.();
        output.write(beforeStatTable);

        output.write('---------------------------------');
        output.write('STAGE #2: Calculate Inconsistent Items');
        output.write('> calculate abandoned snapshots');
        const abandonedSnapshots = allSnapshotsBefore.filter((sn: any) => !fs.existsSync(path.join(config.defaultImagesPath, sn.filename)));

        output.write('> calculate abandoned files');
        const snapshotsUniqueFiles = Array.from(new Set(allSnapshotsBefore.map((x: any) => x.filename)));
        const abandonedFiles: any[] = [];
        const progress = new ProgressBar(allFilesBefore.length);
        for (const [index, file] of allFilesBefore.entries()) {
            setTimeout(() => {
                progress.writeIfChange(index, allFilesBefore.length, (msg: any) => output.write(msg));
            }, 10);

            if (!snapshotsUniqueFiles.includes(file.toString())) {
                abandonedFiles.push(file);
            }
        }
        output.write('> calculate abandoned checks');
        const allSnapshotsBeforeIds = allSnapshotsBefore.map((x: any) => x._id.valueOf());

        const allChecksBeforeLight = allChecksBefore.map((x: any) => ({
            _id: x._id.valueOf(), baselineId: x.baselineId.valueOf(), actualSnapshotId: x.actualSnapshotId.valueOf(),
        }));
        const abandonedChecks: any[] = [];
        const progressChecks = new ProgressBar(allChecksBefore.length);
        for (const [index, check] of allChecksBeforeLight.entries()) {
            progressChecks.writeIfChange(index, allChecksBeforeLight.length, (msg: any) => output.write(msg));
            if (!allSnapshotsBeforeIds.includes(check.baselineId) || !allSnapshotsBeforeIds.includes(check.actualSnapshotId.valueOf())) {
                abandonedChecks.push(check._id.valueOf());
            }
        }

        output.write('> calculate empty tests');
        const checksUniqueTests = (await Check.find().lean().distinct('test').exec()).map((x: any) => x.valueOf());

        const emptyTests: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [index, test] of allTestsBefore.entries()) {
            if (!checksUniqueTests.includes(test._id.valueOf())) {
                emptyTests.push(test._id.valueOf());
            }
        }

        output.write('> calculate empty runs');

        const checksUniqueRuns = (await Check.find().distinct('run').exec()).map((x: any) => x.valueOf());

        const emptyRuns: any[] = [];
        for (const run of allRunsBefore) {
            if (!checksUniqueRuns.includes(run._id.valueOf())) {
                emptyRuns.push(run._id.valueOf());
            }
        }

        output.write('> calculate empty suites');

        const checksUniqueSuites = (await Check.find().distinct('suite').exec()).map((x: any) => x.valueOf());

        const emptySuites: any[] = [];
        for (const suite of allSuitesBefore) {
            if (!checksUniqueSuites.includes(suite._id.valueOf())) {
                emptySuites.push(suite._id.valueOf());
            }
        }
        output.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        output.write('Current inconsistent items:');
        const inconsistentStatTable = stringTable.create([
            { item: 'empty suites', count: emptySuites.length },
            { item: 'empty runs', count: emptyRuns.length },
            { item: 'empty tests', count: emptyTests.length },
            { item: 'abandoned checks', count: abandonedChecks.length },
            { item: 'abandoned snapshots', count: abandonedSnapshots.length },
            { item: 'abandoned files', count: abandonedFiles.length },
        ]);
        output.write(inconsistentStatTable);

        if (options.clean) {
            output.write('---------------------------------');
            output.write('STAGE #3: Remove non consistent items');

            output.write('> remove empty suites');
            await Suite.deleteMany({ _id: { $in: emptySuites } });
            output.write('> remove empty runs');
            await Run.deleteMany({ _id: { $in: emptyRuns } });
            output.write('> remove empty tests');
            await Test.deleteMany({ _id: { $in: emptyTests } });
            output.write('> remove abandoned checks');
            await Check.deleteMany({ _id: { $in: abandonedChecks } });
            output.write('> remove abandoned snapshots');
            await Snapshot.deleteMany({ _id: { $in: abandonedSnapshots } });
            output.write('> remove abandoned files');
            await Promise.all(abandonedFiles.map((filename) => fsp.unlink(path.join(config.defaultImagesPath, filename))));
            const allFilesAfter = fs.readdirSync(config.defaultImagesPath, { withFileTypes: true })
                .filter((item: any) => !item.isDirectory())
                .map((x: any) => x.name)
                .filter((x: any) => x.includes('.png'));

            output.write('STAGE #4: Calculate Common stats after cleaning');
            output.write('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            output.write('Current items:');
            const afterStatTable = stringTable.create([
                { item: 'suites', count: await Suite.countDocuments() },
                { item: 'runs', count: await Run.countDocuments() },
                { item: 'tests', count: await Test.countDocuments() },
                { item: 'checks', count: await Check.countDocuments() },
                { item: 'snapshots', count: await Snapshot.countDocuments() },
                { item: 'files', count: allFilesAfter.length },
            ]);
            output.write(afterStatTable);
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        output.write(`> Done in ${elapsedSeconds} seconds, ${elapsedSeconds / 60} min`);
        output.write('- end...\n');
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        output.write(errMsg);
        throw e;
    } finally {
        output.end();
    }
}
