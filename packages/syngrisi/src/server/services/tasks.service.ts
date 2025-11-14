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
    const clean = options.clean === 'true' || options.clean === true;
    await handleDatabaseConsistencyTask({ clean }, output);
};

const task_remove_old_logs = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    const days = parseInt(options.days, 10);
    const statistics = options.statistics === 'true' || options.statistics === true;
    await removeOldLogsTask({ days, statistics }, output);
};

const task_handle_old_checks = async (options: any, res: Response) => {
    const output = new HttpOutputWriter(res);
    const days = parseInt(options.days, 10);
    const remove = options.remove === 'true' || options.remove === true;
    await handleOldChecksTask({ days, remove }, output);
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
