import { checkService } from './index';
import { Test, Check } from '@models';
import log from "../lib/logger";
import { RequestUser } from '@types';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '../models/plugins/utils';


const queryTests = async (filter: FilterQuery<typeof Test>, options: PaginateOptions) => {
    const tests = await Test.paginate(filter, options);
    return tests;
};

const queryTestsDistinct = async (filter: FilterQuery<typeof Test>, options: PaginateOptions) => {
    const tests = await Test.paginateDistinct({filter: filter ? JSON.stringify(filter) : null}, options);
    return tests;
};

const remove = async (id: string, user: RequestUser) => {
    const logOpts = {
        scope: 'removeTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove test with, id: '${id}', user: '${user.username}'`, logOpts);

    try {
        log.debug(`try to delete all checks associated to test with ID: '${id}'`, logOpts);
        const checks = await Check.find({ test: id });
        for (const check of checks) {
            await checkService.remove(check._id, user);
        }
        return Test.findByIdAndDelete(id);
    } catch (e: unknown) {
        log.error(`cannot remove test with id: ${id} error: ${(e instanceof Error) ? e.stack : String(e)}`, logOpts);
        throw new Error();
    }
};

const accept = async (id: string, user: RequestUser) => {
    const logOpts = {
        scope: 'acceptTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'ACCEPT',
    };
    log.info(`accept test with, id: '${id}', user: '${user.username}'`, logOpts);

    const checks = await Check.find({ test: id }).exec();

    for (const check of checks) {
        await checkService.accept(check._id, String(check.actualSnapshotId), user);
    }
    return { message: 'success' };
};

export {
    queryTests,
    queryTestsDistinct,
    remove,
    accept,
};
