/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { catchAsync } from '../utils';
import { logsService } from '../services';

import { pick } from '../utils';

const getLogs = catchAsync(async (req: any, res: any) => {
    // const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
    ? EJSON.parse(req.query.filter)
    : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await logsService.queryLogs(filter, options);
    res.send(result);
});

const distinct = catchAsync(async (req: any, res: any) => {
    const { field } = pick(req.query, ['field']);
    const result = await logsService.distinct(field);
    res.send(result);
});

const createLog = catchAsync(async (req: any, res: any) => {
    const user = await logsService.createLogs(req.body);
    res.status(httpStatus.CREATED).send(user);
});

export {
    getLogs,
    distinct,
    createLog,
};
