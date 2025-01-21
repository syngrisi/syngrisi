/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs, { promises as fsp } from 'fs';
// @ts-ignore
import st from 'string-table';
import { config } from '@config';
import { env } from '@/server/envConfig';
import { subDays } from '@utils';
import { CleanupOptions, CleanupStats, SnapshotIds, CleanupProgress } from '../types/tasks.types';
import log from '../lib/logger';
import testAdminUser from '../../seeds/testAdmin.json';
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

const stringTable: any = st;

function taskOutput(msg: any, res: Response): void {
    res.write(`${msg.toString()}\n`);
    log.debug(msg.toString());
}

function parseHrtimeToSeconds(hrtime: [number, number]): string {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

const status = async (currentUser: any): Promise<{ alive: boolean; currentUser?: string }> => {
    const count = await User.countDocuments().exec();

    log.silly(`server status: check users counts: ${count}`);
    if (count > 1) {
        return { alive: true, currentUser: currentUser?.username };
    }
    return { alive: false };
};

const screenshots = async (): Promise<string[]> => {
    const files = fs.readdirSync(config.defaultImagesPath);
    return files;
};

const loadTestUser = async (): Promise<any> => {
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

    log.info(`test admin exists: ${JSON.stringify(testAdmin, null, 2)}`, logOpts);
    return { msg: `already exist '${testAdmin}'` };
};

const task_handle_database_consistency = async (options: any, res: any): Promise<void> => {
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
        const abandonedSnapshots = allSnapshotsBefore.filter((sn: any) => !fs.existsSync(`${config.defaultImagesPath}/${sn.filename}`));

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
            await Promise.all(abandonedFiles.map((filename) => fsp.unlink(`${config.defaultImagesPath}/${filename}`)));
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

const validateCleanupOptions = (options: Partial<CleanupOptions>): CleanupOptions => {
    const days = parseInt(String(options.days), 10);
    if (Number.isNaN(days) || days <= 0) {
        throw new Error('Days parameter must be a positive number');
    }
    if (days > 365) {
        throw new Error('Cannot cleanup data older than 1 year');
    }
    return {
        days,
        remove: String(options.remove).toLowerCase() === 'true',
        batchSize: 1000,
    };
};

const streamProgress = (res: Response, progress: CleanupProgress): void => {
    log.info(progress.message, { stage: progress.stage, progress: progress.progress });
    res.write(`${JSON.stringify(progress)}\n`);
};

const safeDeleteFile = async (filepath: string): Promise<boolean> => {
    try {
        const normalizedPath = path.normalize(filepath);
        if (!normalizedPath.startsWith(config.defaultImagesPath)) {
            throw new Error('Invalid file path');
        }
        await fsp.access(normalizedPath, fs.constants.W_OK);
        await fsp.unlink(normalizedPath);
        return true;
    } catch (error) {
        log.error('Failed to delete file', { filepath, error });
        return false;
    }
};

const task_handle_old_checks = async (options: Partial<CleanupOptions>, res: Response): Promise<void> => {
    let session: mongoose.ClientSession | null = null;
    const stats: CleanupStats = {
        checksRemoved: 0,
        snapshotsRemoved: 0,
        filesRemoved: 0,
        errors: [],
    };

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
    });

    try {
        const validOptions = validateCleanupOptions(options);
        const startTime = process.hrtime();
        session = await mongoose.startSession();
        session.startTransaction();

        streamProgress(res, { 
            stage: 'init',
            message: 'Starting cleanup process'
        });

        const trashHoldDate = subDays(new Date(), validOptions.days);

        // Поэтапное удаление старых проверок
        const oldChecksCursor = Check.find({ 
            createdDate: { $lt: trashHoldDate } 
        }).lean().cursor({ batchSize: validOptions.batchSize });

        const snapshotIds: SnapshotIds = {
            baselineIds: [],
            actualSnapshotIds: [],
            diffIds: [],
        };

        // Собираем ID снапшотов порционно
        streamProgress(res, {
            stage: 'collection',
            message: 'Collecting old checks data'
        });

        for await (const check of oldChecksCursor) {
            if (check.baselineId) snapshotIds.baselineIds.push(check.baselineId);
            if (check.actualSnapshotId) snapshotIds.actualSnapshotIds.push(check.actualSnapshotId);
            if (check.diffId) snapshotIds.diffIds.push(check.diffId);
        }

        if (validOptions.remove) {
            // Удаляем старые проверки
            const checkResult = await Check.deleteMany(
                { createdDate: { $lt: trashHoldDate } },
                { session }
            );
            stats.checksRemoved = checkResult.deletedCount || 0;

            // Получаем актуальные снапшоты
            const activeSnapshots = new Set([
                ...(await Check.distinct('baselineId')).map((id) => id.toString()),
                ...(await Check.distinct('actualSnapshotId')).map((id) => id.toString()),
                ...(await Baseline.distinct('snapshootId')).map((id) => id.toString()),
            ]);

            // Удаляем неиспользуемые снапшоты порционно
            const snapshotsToRemove = await Snapshot.find({
                $and: [
                    { _id: { $nin: Array.from(activeSnapshots) } },
                    {
                        $or: [
                            { _id: { $in: snapshotIds.baselineIds } },
                            { _id: { $in: snapshotIds.actualSnapshotIds } },
                            { _id: { $in: snapshotIds.diffIds } },
                        ],
                    },
                ],
            }).lean();

            // Собираем файлы для удаления
            const filesToDelete = new Set(snapshotsToRemove.map((s) => s.filename));
            const currentFiles = new Set(
                (await Snapshot.distinct('filename'))
                    .filter((f) => !filesToDelete.has(f))
            );

            // Удаляем снапшоты
            const snapshotResult = await Snapshot.deleteMany(
                { _id: { $in: snapshotsToRemove.map((s) => s._id) } },
                { session }
            );
            stats.snapshotsRemoved = snapshotResult.deletedCount || 0;

            // Удаляем файлы
            const deletePromises: Promise<boolean>[] = [];
            for (const filename of filesToDelete) {
                if (!currentFiles.has(filename)) {
                    deletePromises.push(
                        safeDeleteFile(path.join(config.defaultImagesPath, filename))
                    );
                }
            }

            const deleteResults = await Promise.allSettled(deletePromises);
            stats.filesRemoved = deleteResults.filter(
                (r) => r.status === 'fulfilled' && r.value
            ).length;

            // Фиксируем транзакцию
            await session.commitTransaction();
        }

        const endTime = process.hrtime(startTime);
        const duration = parseHrtimeToSeconds(endTime);

        streamProgress(res, {
            stage: 'complete',
            message: `Cleanup completed in ${duration}s`,
            progress: 100
        });

        // Отправляем финальную статистику
        res.write(JSON.stringify({ 
            status: 'success',
            stats,
            duration 
        }));
        res.end();

    } catch (error) {
        log.error('Cleanup failed', { error });
        if (session) {
            await session.abortTransaction();
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        streamProgress(res, {
            stage: 'error',
            message: 'Cleanup failed',
            error: errorMessage
        });

        res.write(JSON.stringify({ 
            status: 'error',
            error: errorMessage
        }));
        res.end();
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

const task_remove_old_logs = async (options: any, res: any): Promise<void> => {
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

const task_test = async (options = 'empty', req: ExtRequest, res: Response): Promise<void> => {
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
