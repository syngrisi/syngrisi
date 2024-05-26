/* eslint-disable camelcase */
const { promises: fs } = require('fs');
const stringTable = require('string-table');
const fss = require('fs');
const { config } = require('../../../config');
const { subDays, dateToISO8601 } = require('../utils');
const { ProgressBar } = require('../utils');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const {
    Snapshot,
    Check,
    Test,
    Run,
    Log,
    Suite,
    User,
    Baseline,
} = require('../models');

const testAdminUser = require('../../seeds/testAdmin.json');

const fileLogMeta = {
    scope: 'app_service',
    msgType: 'APP',
};

function taskOutput(msg, res) {
    res.write(`${msg.toString()}\n`);
    log2.debug(msg.toString(), fileLogMeta);
}

function parseHrtimeToSeconds(hrtime) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

const status = async (currentUser) => {
    const count = await User.countDocuments().exec();

    log2.silly(`server status: check users counts: ${count}`);
    if (count > 1) {
        return { alive: true, currentUser: currentUser?.username };
    }
    return { alive: false };
};

const screenshots = async () => {
    const files = fss.readdirSync(config.defaultImagesPath);
    return files;
};

const loadTestUser = async () => {
    const logOpts = {
        itemType: 'user',
        msgType: 'LOAD',
        ref: 'Administrator',
    };
    if (process.env.SYNGRISI_TEST_MODE !== '1') {
        return { message: 'the feature works only in test mode' };
    }
    const testAdmin = await User.findOne({ username: 'Test' }).exec();
    if (!testAdmin) {
        log2.info('create the test Administrator', fileLogMeta, logOpts);
        const admin = await User.create(testAdminUser);
        log2.info(`test Administrator with id: '${admin._id}' was created`, fileLogMeta, logOpts);
        return admin;
    }

    log2.info(`test admin is exists: ${JSON.stringify(testAdmin, null, 2)}`, fileLogMeta, logOpts);
    return { msg: `already exist '${testAdmin}'` };
};

const task_handle_database_consistency = async (options, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
        'x-no-compression': 'true',
    });
    // res.setHeader('x-no-compression', 'true');
    try {
        const startTime = process.hrtime();
        taskOutput('- starting...\n', res);
        taskOutput('---------------------------------', res);
        taskOutput('STAGE #1: Calculate Common stats', res);
        taskOutput('get runs data', res);
        const allRunsBefore = await Run.find()
            .exec();
        taskOutput('get suites data', res);
        const allSuitesBefore = await Suite.find()
            .exec();
        taskOutput('get tests data', res);
        const allTestsBefore = await Test.find()
            .lean()
            .exec();
        taskOutput('get checks data', res);
        const allChecksBefore = await Check.find()
            .lean()
            .exec();
        taskOutput('get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
            .lean()
            .exec();
        taskOutput('get files data', res);
        const allFilesBefore = (await fs.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item) => !item.isDirectory())
            .map(((x) => x.name))
            .filter((x) => x.includes('.png'));

        taskOutput('-----------------------------', res);
        const beforeStatTable = stringTable.create(
            [
                { item: 'suites', count: allSuitesBefore.length },
                { item: 'runs', count: allRunsBefore.length },
                { item: 'tests', count: allTestsBefore.length },
                { item: 'checks', count: allChecksBefore.length },
                { item: 'snapshots', count: allSnapshotsBefore.length },
                { item: 'files', count: allFilesBefore.length },
            ]
        );
        res.flush();
        taskOutput(beforeStatTable, res);

        taskOutput('---------------------------------', res);
        taskOutput('STAGE #2: Calculate Inconsistent Items', res);
        taskOutput('> calculate abandoned snapshots', res);
        // eslint-disable-next-line
        const abandonedSnapshots = allSnapshotsBefore.filter((sn) => {
            return !fss.existsSync(`${config.defaultImagesPath}/${sn.filename}`);
        });

        taskOutput('> calculate abandoned files', res);
        const snapshotsUniqueFiles = Array.from(new Set(allSnapshotsBefore.map((x) => x.filename)));
        const abandonedFiles = [];
        const progress = new ProgressBar(allFilesBefore.length);
        // eslint-disable-next-line no-restricted-syntax
        for (const [index, file] of allFilesBefore.entries()) {
            setTimeout(() => {
                progress.writeIfChange(index, allFilesBefore.length, taskOutput, res);
            }, 10);

            if (!(snapshotsUniqueFiles.includes(file.toString()))) {
                abandonedFiles.push(file);
            }
        }
        // we don't remove the abandoned checks yet, need more statistics
        taskOutput('> calculate abandoned checks', res);
        const allSnapshotsBeforeIds = allSnapshotsBefore.map((x) => x._id.valueOf());

        const allChecksBeforeLight = allChecksBefore.map((x) => ({
            _id: x._id.valueOf(), baselineId: x.baselineId.valueOf(), actualSnapshotId: x.actualSnapshotId.valueOf(),
        }));
        const abandonedChecks = [];
        const progressChecks = new ProgressBar(allChecksBefore.length);
        // eslint-disable-next-line no-restricted-syntax
        for (const [index, check] of allChecksBeforeLight.entries()) {
            progressChecks.writeIfChange(index, allChecksBeforeLight.length, taskOutput, res);
            if (
                !(allSnapshotsBeforeIds.includes(check.baselineId))
                || !(allSnapshotsBeforeIds.includes(check.actualSnapshotId.valueOf()))
            ) {
                abandonedChecks.push(check._id.valueOf());
            }
        }

        taskOutput('> calculate empty tests', res);
        const checksUniqueTests = (await Check.find()
            .lean()
            .distinct('test')
            .exec())
            .map((x) => x.valueOf());

        const emptyTests = [];

        // eslint-disable-next-line no-restricted-syntax,no-unused-vars
        for (const [index, test] of allTestsBefore.entries()) {
            if (!checksUniqueTests.includes(test._id.valueOf())) {
                emptyTests.push(test._id.valueOf());
            }
        }

        taskOutput('> calculate empty runs', res);

        const checksUniqueRuns = (await Check.find()
            .distinct('run')
            .exec()).map((x) => x.valueOf());

        const emptyRuns = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const run of allRunsBefore) {
            // eslint-disable-next-line no-await-in-loop
            if (!checksUniqueRuns.includes(run._id.valueOf())) {
                emptyRuns.push(run._id.valueOf());
            }
        }

        taskOutput('> calculate empty suites', res);

        const checksUniqueSuites = (await Check.find()
            .distinct('suite')
            .exec()).map((x) => x.valueOf());

        const emptySuites = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const suite of allSuitesBefore) {
            // eslint-disable-next-line no-await-in-loop
            if (!checksUniqueSuites.includes(suite._id.valueOf())) {
                emptySuites.push(suite._id.valueOf());
            }
        }
        taskOutput('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', res);
        taskOutput('Current inconsistent items:', res);
        const inconsistentStatTable = stringTable.create(
            [
                { item: 'empty suites', count: emptySuites.length },
                { item: 'empty runs', count: emptyRuns.length },
                { item: 'empty tests', count: emptyTests.length },
                { item: 'abandoned checks', count: abandonedChecks.length },
                { item: 'abandoned snapshots', count: abandonedSnapshots.length },
                { item: 'abandoned files', count: abandonedFiles.length },
            ]
        );
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
            await Promise.all(abandonedFiles.map((filename) => fs.unlink(`${config.defaultImagesPath}/${filename}`)));
            const allFilesAfter = fss.readdirSync(config.defaultImagesPath, { withFileTypes: true })
                .filter((item) => !item.isDirectory())
                .map(((x) => x.name))
                .filter((x) => x.includes('.png'));

            taskOutput('STAGE #4: Calculate Common stats after cleaning', res);
            taskOutput('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', res);
            taskOutput('Current items:', res);
            const afterStatTable = stringTable.create(
                [
                    { item: 'suites', count: await Suite.countDocuments() },
                    { item: 'runs', count: await Run.countDocuments() },
                    { item: 'tests', count: await Test.countDocuments() },
                    { item: 'checks', count: await Check.countDocuments() },
                    { item: 'snapshots', count: await Snapshot.countDocuments() },
                    { item: 'files', count: allFilesAfter.length },
                ]
            );
            taskOutput(afterStatTable, res);
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        taskOutput(`> Done in ${elapsedSeconds} seconds, ${elapsedSeconds / 60} min`, res);
        taskOutput('- end...\n', res);
    } catch (e) {
        log2.error(e.stack || e.toString());
        taskOutput(e.stack || e, res);
    } finally {
        res.end();
    }
};

const task_remove_old_logs = async (options, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    const trashHoldDate = subDays(new Date(), parseInt(options.days, 10));
    const filter = { timestamp: { $lt: trashHoldDate } };
    const allLogsCountBefore = await log2.find({})
        .countDocuments();
    const oldLogsCount = await log2.find(filter)
        .countDocuments();
    taskOutput(`- the count of all documents is: '${allLogsCountBefore}'\n`, res);
    taskOutput(`- the count of documents to be removed is: '${oldLogsCount}'\n`, res);
    if (options.statistics === 'false') {
        taskOutput(
            `- will remove all logs older that: '${options.days}' days,`
            + ` '${dateToISO8601(trashHoldDate)}'\n`,
            res
        );
        await log2.deleteMany(filter);
        const allLogsCountAfter = await log2.find({})
            .countDocuments();
        taskOutput(`- the count of all documents now is: '${allLogsCountAfter}'\n`, res);
    }

    taskOutput('> Done', res);
    res.end();
};

const task_handle_old_checks = async (options, res) => {
    // this header to response with chunks data
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
        const allChecksBefore = await Check.find()
            .lean()
            .exec();
        taskOutput('> get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
            .lean()
            .exec();
        taskOutput('> get files data', res);
        const allFilesBefore = (await fs.readdir(config.defaultImagesPath, { withFileTypes: true }))
            .filter((item) => !item.isDirectory())
            .map(((x) => x.name))
            .filter((x) => x.includes('.png'));

        taskOutput('> get old checks data', res);
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } })
            .lean()
            .exec();

        taskOutput('>>> collect all baselineIds for old Checks ', res);
        const oldSnapshotsBaselineIdIds = oldChecks.map((x) => x.baselineId)
            .filter((x) => x);

        taskOutput('>>> collect all actualSnapshotId for old Checks ', res);
        const oldSnapshotsActualSnapshotIdIds = oldChecks.map((x) => x.actualSnapshotId)
            .filter((x) => x);

        taskOutput('>>> collect all diffId for old Checks ', res);
        const oldSnapshotsDiffIds = oldChecks.map((x) => x.diffId)
            .filter((x) => x);

        taskOutput('>>> calculate all unique snapshots ids for old Checks ', res);

        const allOldSnapshotsUniqueIds = Array.from(
            new Set([...oldSnapshotsBaselineIdIds, ...oldSnapshotsActualSnapshotIdIds, ...oldSnapshotsDiffIds])
        )
            .map((x) => x.valueOf());

        taskOutput('>>> collect all old snapshots', res);
        const oldSnapshots = await Snapshot.find({ _id: { $in: allOldSnapshotsUniqueIds } })
            .lean();

        const outTable = stringTable.create(
            [
                { item: 'all checks', count: allChecksBefore.length },
                { item: 'all snapshots', count: allSnapshotsBefore.length },
                { item: 'all files', count: allFilesBefore.length },
                { item: `checks older than: '${options.days}' days`, count: oldChecks.length },
                { item: 'old snapshots baseline ids', count: oldSnapshotsBaselineIdIds.length },
                { item: 'old snapshots actual snapshotId', count: oldSnapshotsActualSnapshotIdIds.length },
                { item: 'old snapshots diffIds', count: oldSnapshotsDiffIds.length },
                { item: 'all old snapshots unique Ids', count: allOldSnapshotsUniqueIds.length },
                { item: 'all old snapshots', count: oldSnapshots.length },
            ]
        );

        taskOutput(outTable, res);

        if (options.remove === 'true') {
            taskOutput(`STAGE #2 Remove checks that older that: '${options.days}' days,`
                + ` '${dateToISO8601(trashHoldDate)}'\n`, res);

            taskOutput('> remove checks', res);
            const checkRemovingResult = await Check.deleteMany({ createdDate: { $lt: trashHoldDate } });
            taskOutput(`>>> removed: '${checkRemovingResult.deletedCount}'`, res);

            taskOutput('> remove snapshots', res);

            taskOutput('>> collect data to removing', res);
            taskOutput('>>> get all baselines snapshots id`s', res);
            const baselinesSnapshotsIds = (await Baseline.find({})
                .distinct('snapshootId'));

            // get baselineIds after removing
            taskOutput('>>> get all checks snapshots baselineId', res);
            const checksSnapshotsBaselineId = (await Check.find({})
                .distinct('baselineId'));

            taskOutput('>>> get all checks snapshots actualSnapshotId', res);
            const checksSnapshotsActualSnapshotId = (await Check.find({})
                .distinct('actualSnapshotId'));

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
            // here we give all old checks and then exclude all baselines
            // and all checks related to new checks with actual and baseline snapshots with such baselineId
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
            const oldSnapshotsUniqueFilenames = Array.from(new Set(oldSnapshots.map((x) => x.filename)));
            taskOutput(`>> found: ${oldSnapshotsUniqueFilenames.length}`, res);

            taskOutput('> get all current snapshots filenames', res);
            const allCurrentSnapshotsFilenames = await Snapshot.find()
                .distinct('filename')
                .exec();

            taskOutput('>> calculate interception between all current snapshot filenames and old shapshots filenames', res);
            const arrayIntersection = (arr1, arr2) => arr1.filter((x) => arr2.includes(x));
            const filesInterception = arrayIntersection(allCurrentSnapshotsFilenames, oldSnapshotsUniqueFilenames);
            taskOutput(`>> found: ${filesInterception.length}`, res);

            taskOutput('>> calculate filenames to remove', res);
            const arrayDiff = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));
            const filesToDelete = arrayDiff(oldSnapshotsUniqueFilenames, filesInterception);
            taskOutput(`>> found: ${filesToDelete.length}`, res);

            taskOutput(`>> remove these files: ${filesToDelete.length}`, res);
            await Promise.all(filesToDelete.map((filename) => fs.unlink(`${config.defaultImagesPath}/${filename}`)));
            taskOutput(`>> done: ${filesToDelete.length}`, res);

            taskOutput('STAGE #3 Calculate common stats after Removing', res);

            taskOutput('> get all checks data', res);
            const allChecksAfter = await Check.find()
                .lean()
                .exec();
            taskOutput('> get snapshots data', res);
            const allSnapshotsAfter = await Snapshot.find()
                .lean()
                .exec();
            taskOutput('> get files data', res);
            const allFilesAfter = (await fs.readdir(config.defaultImagesPath, { withFileTypes: true }))
                .filter((item) => !item.isDirectory())
                .map(((x) => x.name))
                .filter((x) => x.includes('.png'));

            const outTableAfter = stringTable.create(
                [
                    { item: 'all checks', count: allChecksAfter.length },
                    { item: 'all snapshots', count: allSnapshotsAfter.length },
                    { item: 'all files', count: allFilesAfter.length },
                ]
            );

            taskOutput(outTableAfter, res);
        }
        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));

        taskOutput(`> done in ${elapsedSeconds} seconds ${elapsedSeconds / 60} min`, res);
    } catch (e) {
        log2.error(e.stack.toString() || e);
        taskOutput(e.stack || e, res);
    } finally {
        res.end();
    }
};
const task_test = async (options = 'empty', req, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });

    const x = 1000;
    const interval = 30;
    let isAborted = false;

    req.on(
        'close',
        () => {
            isAborted = true;
        }
    );

    for (let i = 0; i < x; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(() => r(), interval));
        taskOutput(`- Task Output: '${i}', options: ${options}\n`, res);
        if (isAborted) {
            taskOutput('the task was aborted\n', res);
            log2.warn('the task was aborted', fileLogMeta);
            res.flush();
            return res.end();
        }
    }
    return res.end();
};

module.exports = {
    task_test,
    task_handle_old_checks,
    task_handle_database_consistency,
    task_remove_old_logs,
    status,
    loadTestUser,
    screenshots,
};
