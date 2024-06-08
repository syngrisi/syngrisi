/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { checkService } from './index';
import { Test, Check } from '@models';
import log from "../lib/logger";
import { RequestUser } from '@types/RequestUser';

const queryTests = async (filter: any, options: any) => {
    // @ts-ignore
    const tests = await Test.paginate(filter, options);
    return tests;
};

const queryTestsDistinct = async (filter: any, options: any) => {
    // @ts-ignore
    const tests = await Test.paginateDistinct(filter, options);
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

    const checks: any = await Check.find({ test: id }).exec();

    for (const check of checks) {
        await checkService.accept(check._id, check.actualSnapshotId, user);
    }
    return { message: 'success' };
};

export {
    queryTests,
    queryTestsDistinct,
    remove,
    accept,
};
