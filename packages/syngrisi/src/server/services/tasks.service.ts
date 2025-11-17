/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { Response } from "express";
import { env } from "@/server/envConfig";
import fs from 'fs';
import { config } from '@config';
import log from "../lib/logger";
import testAdminUser from '../../seeds/testAdmin.json';
import { HttpOutputWriter } from '@/tasks/lib/output-writer';
import {
    handleDatabaseConsistencyTask,
    handleOldChecksTask,
    handleOrphanFilesTask,
    removeOldLogsTask,
} from '@/tasks/core';

import {
    User,
} from '@models';
import { ExtRequest } from '@types';

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

const task_handle_database_consistency = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    let clean = options.clean === 'true' || options.clean === true;
    if (options.dryRun !== undefined) {
        const dryRun = options.dryRun === 'true' || options.dryRun === true;
        clean = !dryRun;
    }
    await handleDatabaseConsistencyTask({ clean }, output);
};

const task_remove_old_logs = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    const days = parseInt(options.days, 10);
    let dryRun = options.statistics === 'true' || options.statistics === true;
    if (options.dryRun !== undefined) {
        dryRun = options.dryRun === 'true' || options.dryRun === true;
    }
    await removeOldLogsTask({ days, dryRun }, output);
};

const task_handle_old_checks = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    const days = parseInt(options.days, 10);

    // Support both 'dryRun' (new UI) and 'remove' (backward compatibility)
    let remove: boolean;
    if (options.dryRun !== undefined) {
        // New parameter: dryRun=true means DON'T remove (dry run mode)
        const dryRun = options.dryRun === 'true' || options.dryRun === true;
        remove = !dryRun; // Invert: dryRun=true → remove=false
    } else {
        // Old parameter: remove=true means actually remove
        remove = options.remove === 'true' || options.remove === true;
    }

    log.info('handle_old_checks task invocation', {
        rawOptions: options,
        parsed: { days, remove },
    });

    await handleOldChecksTask({ days, remove }, output);
};

const task_handle_orphan_files = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    let dryRun = options.dryRun === 'true' || options.dryRun === true;
    if (options.execute !== undefined) {
        const execute = options.execute === 'true' || options.execute === true;
        dryRun = !execute; // inverse logic: execute=false means dryRun=true
    } else if (options.dryRun === undefined) {
        dryRun = true;
    }
    await handleOrphanFilesTask({ dryRun }, output);
};

const task_test = async (options = 'empty', req: ExtRequest, res: Response) => {
    const output = new HttpOutputWriter(res);

    const x = 1000;
    // const interval = 30;
    let isAborted = false;

    req.on('close', () => {
        isAborted = true;
    });

    for (let i = 0; i < x; i += 1) {
        // await new Promise((r) => setTimeout(() => r(), interval));
        output.write(`- Task Output: '${i}', options: ${options}`);
        if (isAborted) {
            output.write('the task was aborted');
            log.warn('the task was aborted');
            output.flush?.();
            return output.end();
        }
    }
    return output.end();
};

export {
    task_test,
    task_handle_old_checks,
    task_handle_database_consistency,
    task_handle_orphan_files,
    task_remove_old_logs,
    status,
    loadTestUser,
    screenshots,
};
