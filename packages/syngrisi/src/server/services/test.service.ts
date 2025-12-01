import { Types } from 'mongoose';
import { checkService } from './index';
import { Test, Check } from '@models';
import log from "../lib/logger";
import { RequestUser } from '@types';
import { FilterQuery } from 'mongoose';
import { PaginateOptions, QueryResult } from '../models/plugins/utils';

const toObjectId = (id: string) => {
    try {
        return new Types.ObjectId(id);
    } catch {
        return null;
    }
};

const buildEmptyResult = (options: PaginateOptions): QueryResult => {
    const limit = options.limit ? Number(options.limit) : 10;
    const page = options.page ? Number(options.page) : 1;
    return {
        results: [],
        page,
        limit,
        totalPages: 0,
        totalResults: 0,
        timestamp: Date.now(),
    };
};

export const resolveTestIdsByBaselineSnapshot = async (
    baselineSnapshotId?: string,
    deps: { CheckModel?: typeof Check } = {},
): Promise<Types.ObjectId[]> => {
    const CheckModel = deps.CheckModel || Check;
    if (!baselineSnapshotId) return [];
    const objectId = toObjectId(baselineSnapshotId);
    if (!objectId) return [];
    const testIds = await CheckModel.find({ baselineId: objectId }).distinct('test');
    return testIds.map((id) => new Types.ObjectId(id));
};

type QueryTestsDeps = {
    CheckModel?: typeof Check
    TestModel?: typeof Test
};

const queryTests = async (
    filter: FilterQuery<typeof Test>,
    options: PaginateOptions,
    baselineSnapshotId?: string,
    deps: QueryTestsDeps = {},
) => {
    const CheckModel = deps.CheckModel || Check;
    const TestModel = deps.TestModel || Test;

    if (baselineSnapshotId) {
        const testIds = await resolveTestIdsByBaselineSnapshot(baselineSnapshotId, { CheckModel });
        if (!testIds.length) {
            return buildEmptyResult(options);
        }
        filter._id = { $in: testIds };
    }
    const tests = await TestModel.paginate(filter, options);
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
    buildEmptyResult,
};
