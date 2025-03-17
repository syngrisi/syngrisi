/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { Response } from "express";
import { env } from "@/server/envConfig";

interface StringTable {
    create(data: { [key: string]: any }[]): string;
}

import fs, { promises as fsp } from 'fs';
// @ts-ignore
import st from 'string-table';
import { config } from '@config';
import { subDays, dateToISO8601 } from '@utils';
import { ProgressBar } from '@utils';
import log from "../lib/logger";
import testAdminUser from '../../seeds/testAdmin.json'
const stringTable: StringTable = st;

import {
    Snapshot,
    Check,
    Test,
    Run,
    Suite,
    User,
    Log,
    Baseline,
} from '@models';
import { ExtRequest } from '@types';
import path from "path";

function taskOutput(msg: any, res: any) {
    res.write(`${msg.toString()}\n`);
    log.debug(msg.toString());
}

function parseHrtimeToSeconds(hrtime: any) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

const status = async (currentUser: any) => {
    const count = await User.countDocuments().exec();

    log.silly(`server status: check users counts: ${count}`);
    if (count > 1) {
        return { alive: true, currentUser: currentUser?.username };
    }
    return { alive: false };
};

const screenshots = async () => {
    const files = fs.readdirSync(config.defaultImagesPath);
    return files;
};

const loadTestUser = async () => {
    const logOpts = {
        itemType: 'user',
        msgType: 'LOAD',
        ref: 'Administrator',
    };
    if (!env.SYNGRISI_TEST_MODE) {
        return { message: 'the feature works only in test mode' };
    }
    const testAdmin = await User.findOne({ username: 'Test' }).exec();
    if (!testAdmin) {
        log.info('create the test Administrator', logOpts);
        const admin = await User.create(testAdminUser);
        log.info(`test Administrator with id: '${admin._id}' was created`, logOpts);
        return admin;
    }

    log.info(`test admin is exists: ${JSON.stringify(testAdmin, null, 2)}`, logOpts);
    return { msg: `already exist '${testAdmin}'` };
};

const task_handle_database_consistency = async (options: any, res: any) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
        'x-no-compression': 'true',
    });
    try {
        const startTime = process.hrtime();
        taskOutput('- starting...\n', res);
        taskOutput('---------------------------------', res);
        taskOutput('STAGE #1: Calculate Common stats', res);
        taskOutput('get runs data', res);
        const allRunsBefore = await Run.find().exec();
        taskOutput('get suites data', res);
        const allSuitesBefore = await Suite.find().exec();
        taskOutput('get tests data', res);
        const allTestsBefore = await Test.find().lean().exec();
        taskOutput('get checks data', res);
        const allChecksBefore = await Check.find().lean().exec();
        taskOutput('get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find().lean().exec();
        taskOutput('get files data', res);
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: any) => !item.isDirectory())
            .map((x: any) => x.name)
            .filter((x: any) => x.includes('.png'));

        taskOutput('-----------------------------', res);
        const beforeStatTable = stringTable.create([
            { item: 'suites', count: allSuitesBefore.length },
            { item: 'runs', count: allRunsBefore.length },
            { item: 'tests', count: allTestsBefore.length },
            { item: 'checks', count: allChecksBefore.length },
            { item: 'snapshots', count: allSnapshotsBefore.length },
            { item: 'files', count: allFilesBefore.length },
        ]);
        res.flush();
        taskOutput(beforeStatTable, res);

        taskOutput('---------------------------------', res);
        taskOutput('STAGE #2: Calculate Inconsistent Items', res);
        taskOutput('> calculate abandoned snapshots', res);
        const abandonedSnapshots = allSnapshotsBefore.filter((sn: any) => !fs.existsSync(path.join(config.defaultImagesPath, sn.filename)));

        taskOutput('> calculate abandoned files', res);
        const snapshotsUniqueFiles = Array.from(new Set(allSnapshotsBefore.map((x: any) => x.filename)));
        const abandonedFiles: any[] = [];
        const progress = new ProgressBar(allFilesBefore.length);
        for (const [index, file] of allFilesBefore.entries()) {
            setTimeout(() => {
                progress.writeIfChange(index, allFilesBefore.length, taskOutput, res);
            }, 10);

            if (!snapshotsUniqueFiles.includes(file.toString())) {
                abandonedFiles.push(file);
            }
        }
        taskOutput('> calculate abandoned checks', res);
        const allSnapshotsBeforeIds = allSnapshotsBefore.map((x: any) => x._id.valueOf());

        const allChecksBeforeLight = allChecksBefore.map((x: any) => ({
            _id: x._id.valueOf(), baselineId: x.baselineId.valueOf(), actualSnapshotId: x.actualSnapshotId.valueOf(),
        }));
        const abandonedChecks: any[] = [];
        const progressChecks = new ProgressBar(allChecksBefore.length);
        for (const [index, check] of allChecksBeforeLight.entries()) {
            progressChecks.writeIfChange(index, allChecksBeforeLight.length, taskOutput, res);
            if (!allSnapshotsBeforeIds.includes(check.baselineId) || !allSnapshotsBeforeIds.includes(check.actualSnapshotId.valueOf())) {
                abandonedChecks.push(check._id.valueOf());
            }
        }

        taskOutput('> calculate empty tests', res);
        const checksUniqueTests = (await Check.find().lean().distinct('test').exec()).map((x: any) => x.valueOf());

        const emptyTests: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [index, test] of allTestsBefore.entries()) {
            if (!checksUniqueTests.includes(test._id.valueOf())) {
                emptyTests.push(test._id.valueOf());
            }
        }

        taskOutput('> calculate empty runs', res);

        const checksUniqueRuns = (await Check.find().distinct('run').exec()).map((x: any) => x.valueOf());

        const emptyRuns: any[] = [];
        for (const run of allRunsBefore) {
            if (!checksUniqueRuns.includes(run._id.valueOf())) {
                emptyRuns.push(run._id.valueOf());
            }
        }

        taskOutput('> calculate empty suites', res);

        const checksUniqueSuites = (await Check.find().distinct('suite').exec()).map((x: any) => x.valueOf());

        const emptySuites: any[] = [];
        for (const suite of allSuitesBefore) {
            if (!checksUniqueSuites.includes(suite._id.valueOf())) {
                emptySuites.push(suite._id.valueOf());
            }
        }
        taskOutput('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', res);
        taskOutput('Current inconsistent items:', res);
        const inconsistentStatTable = stringTable.create([
            { item: 'empty suites', count: emptySuites.length },
            { item: 'empty runs', count: emptyRuns.length },
            { item: 'empty tests', count: emptyTests.length },
            { item: 'abandoned checks', count: abandonedChecks.length },
            { item: 'abandoned snapshots', count: abandonedSnapshots.length },
            { item: 'abandoned files', count: abandonedFiles.length },
        ]);
        taskOutput(inconsistentStatTable, res);

        if (options.clean) {
            taskOutput('---------------------------------', res);
            taskOutput('STAGE #3: Remove non consistent items', res);

            taskOutput('> remove empty suites', res);
            await Suite.deleteMany({ _id: { $in: emptySuites } });
            taskOutput('> remove empty runs', res);
            await Run.deleteMany({ _id: { $in: emptyRuns } });
            taskOutput('> remove empty tests', res);
            await Test.deleteMany({ _id: { $in: emptyTests } });
            taskOutput('> remove abandoned checks', res);
            await Check.deleteMany({ _id: { $in: abandonedChecks } });
            taskOutput('> remove abandoned snapshots', res);
            await Snapshot.deleteMany({ _id: { $in: abandonedSnapshots } });
            taskOutput('> remove abandoned files', res);
            await Promise.all(abandonedFiles.map((filename) => fsp.unlink(path.join(config.defaultImagesPath, filename))));
            const allFilesAfter = fs.readdirSync(config.defaultImagesPath, { withFileTypes: true })
                .filter((item: any) => !item.isDirectory())
                .map((x: any) => x.name)
                .filter((x: any) => x.includes('.png'));

            taskOutput('STAGE #4: Calculate Common stats after cleaning', res);
            taskOutput('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', res);
            taskOutput('Current items:', res);
            const afterStatTable = stringTable.create([
                { item: 'suites', count: await Suite.countDocuments() },
                { item: 'runs', count: await Run.countDocuments() },
                { item: 'tests', count: await Test.countDocuments() },
                { item: 'checks', count: await Check.countDocuments() },
                { item: 'snapshots', count: await Snapshot.countDocuments() },
                { item: 'files', count: allFilesAfter.length },
            ]);
            taskOutput(afterStatTable, res);
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        taskOutput(`> Done in ${elapsedSeconds} seconds, ${elapsedSeconds / 60} min`, res);
        taskOutput('- end...\n', res);
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        log.error(errMsg);
        taskOutput(errMsg, res);
    } finally {
        res.end();
    }
};

const task_remove_old_logs = async (options: any, res: any) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    const trashHoldDate = subDays(new Date(), parseInt(options.days, 10));
    const filter = { timestamp: { $lt: trashHoldDate } };
    const allLogsCountBefore = await Log.find({}).countDocuments();
    const oldLogsCount = await Log.find(filter).countDocuments();
    taskOutput(`- the count of all documents is: '${allLogsCountBefore}'\n`, res);
    taskOutput(`- the count of documents to be removed is: '${oldLogsCount}'\n`, res);
    if (options.statistics === 'false') {
        taskOutput(`- will remove all logs older that: '${options.days}' days, '${dateToISO8601(trashHoldDate)}'\n`, res);
        await Log.deleteMany(filter);
        const allLogsCountAfter = await Log.find({}).countDocuments();
        taskOutput(`- the count of all documents now is: '${allLogsCountAfter}'\n`, res);
    }

    taskOutput('> Done', res);
    res.end();
};

const task_handle_old_checks = async (options: any, res: any) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    try {
        const startTime = process.hrtime();
        taskOutput('- starting...\n', res);

        taskOutput('STAGE #1 Calculate common stats', res);

        const trashHoldDate = subDays(new Date(), parseInt(options.days, 10));

        taskOutput('> get all checks data', res);
        const allChecksBefore = await Check.find().lean().exec();
        taskOutput('> get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find().lean().exec();
        taskOutput('> get files data', res);
        const allFilesBefore = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item: any) => !item.isDirectory())
            .map((x: any) => x.name)
            .filter((x: any) => x.includes('.png'));

        taskOutput('> get old checks data', res);
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } }).lean().exec();

        taskOutput('>>> collect all baselineIds for old Checks ', res);
        const oldSnapshotsBaselineIdIds = oldChecks.map((x: any) => x.baselineId).filter((x: any) => x);

        taskOutput('>>> collect all actualSnapshotId for old Checks ', res);
        const oldSnapshotsActualSnapshotIdIds = oldChecks.map((x: any) => x.actualSnapshotId).filter((x: any) => x);

        taskOutput('>>> collect all diffId for old Checks ', res);
        const oldSnapshotsDiffIds = oldChecks.map((x: any) => x.diffId).filter((x: any) => x);

        taskOutput('>>> calculate all unique snapshots ids for old Checks ', res);

        const allOldSnapshotsUniqueIds = Array.from(new Set([...oldSnapshotsBaselineIdIds, ...oldSnapshotsActualSnapshotIdIds, ...oldSnapshotsDiffIds]))
            .map((x: any) => x.valueOf());

        taskOutput('>>> collect all old snapshots', res);
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

        taskOutput(outTable, res);

        if (options.remove === 'true') {
            taskOutput(`STAGE #2 Remove checks that older that: '${options.days}' days, '${dateToISO8601(trashHoldDate)}'\n`, res);

            taskOutput('> remove checks', res);
            const checkRemovingResult = await Check.deleteMany({ createdDate: { $lt: trashHoldDate } });
            taskOutput(`>>> removed: '${checkRemovingResult.deletedCount}'`, res);

            taskOutput('> remove snapshots', res);

            taskOutput('>> collect data to removing', res);
            taskOutput('>>> get all baselines snapshots id`s', res);
            const baselinesSnapshotsIds = (await Baseline.find({}).distinct('snapshootId'));

            taskOutput('>>> get all checks snapshots baselineId', res);
            const checksSnapshotsBaselineId = (await Check.find({}).distinct('baselineId'));

            taskOutput('>>> get all checks snapshots actualSnapshotId', res);
            const checksSnapshotsActualSnapshotId = (await Check.find({}).distinct('actualSnapshotId'));

            taskOutput('>> remove baselines snapshots', res);

            taskOutput('>> remove all old snapshots that not related to new baseline and check items', res);
            const removedByBaselineSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsBaselineIdIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByBaselineSnapshotsResult.deletedCount}'`, res);

            taskOutput('>> remove actual snapshots', res);
            taskOutput('>> remove all old snapshots that not related to new baseline and check items', res);
            const removedByActualSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsActualSnapshotIdIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByActualSnapshotsResult.deletedCount}'`, res);

            taskOutput('>> remove all old diff snapshots', res);
            const removedByDiffSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $in: oldSnapshotsDiffIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByDiffSnapshotsResult.deletedCount}'`, res);

            taskOutput('> remove files', res);
            taskOutput('>>> collect all old snapshots filenames', res);
            const oldSnapshotsUniqueFilenames = Array.from(new Set(oldSnapshots.map((x: any) => x.filename)));
            taskOutput(`>> found: ${oldSnapshotsUniqueFilenames.length}`, res);

            taskOutput('> get all current snapshots filenames', res);
            const allCurrentSnapshotsFilenames = await Snapshot.find().distinct('filename').exec();

            taskOutput('>> calculate interception between all current snapshot filenames and old shapshots filenames', res);
            const arrayIntersection = (arr1: any, arr2: any) => arr1.filter((x: any) => arr2.includes(x));
            const filesInterception = arrayIntersection(allCurrentSnapshotsFilenames, oldSnapshotsUniqueFilenames);
            taskOutput(`>> found: ${filesInterception.length}`, res);

            taskOutput('>> calculate filenames to remove', res);
            const arrayDiff = (arr1: any, arr2: any) => arr1.filter((x: any) => !arr2.includes(x));
            const filesToDelete = arrayDiff(oldSnapshotsUniqueFilenames, filesInterception);
            taskOutput(`>> found: ${filesToDelete.length}`, res);

            taskOutput(`>> remove these files: ${filesToDelete.length}`, res);
            await Promise.all(filesToDelete.map((filename: string) => fsp.unlink(path.join(config.defaultImagesPath, filename))));
            taskOutput(`>> done: ${filesToDelete.length}`, res);

            taskOutput('STAGE #3 Calculate common stats after Removing', res);

            taskOutput('> get all checks data', res);
            const allChecksAfter = await Check.find().lean().exec();
            taskOutput('> get snapshots data', res);
            const allSnapshotsAfter = await Snapshot.find().lean().exec();
            taskOutput('> get files data', res);
            const allFilesAfter = (await fsp.readdir(config.defaultImagesPath, { withFileTypes: true }))
                .filter((item: any) => !item.isDirectory())
                .map((x: any) => x.name)
                .filter((x: any) => x.includes('.png'));

            const outTableAfter = stringTable.create([
                { item: 'all checks', count: allChecksAfter.length },
                { item: 'all snapshots', count: allSnapshotsAfter.length },
                { item: 'all files', count: allFilesAfter.length },
            ]);

            taskOutput(outTableAfter, res);
        }
        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));

        taskOutput(`> done in ${elapsedSeconds} seconds ${elapsedSeconds / 60} min`, res);
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        log.error(errMsg);
        taskOutput(errMsg, res);
    } finally {
        res.end();
    }
};

const task_test = async (options = 'empty', req: ExtRequest, res: Response) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });

    const x = 1000;
    // const interval = 30;
    let isAborted = false;

    req.on('close', () => {
        isAborted = true;
    });

    for (let i = 0; i < x; i += 1) {
        // await new Promise((r) => setTimeout(() => r(), interval));
        taskOutput(`- Task Output: '${i}', options: ${options}\n`, res);
        if (isAborted) {
            taskOutput('the task was aborted\n', res);
            log.warn('the task was aborted');
            (res as any).flush();
            return res.end();
        }
    }
    return res.end();
};

export {
    task_test,
    task_handle_old_checks,
    task_handle_database_consistency,
    task_remove_old_logs,
    status,
    loadTestUser,
    screenshots,
};
