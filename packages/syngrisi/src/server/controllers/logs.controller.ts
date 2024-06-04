import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { catchAsync } from '../utils';
import { logsService } from '../services';
import { Response } from "express";

import { pick } from '../utils';
import { ExtRequest } from '../../types/ExtRequest';

const getLogs = catchAsync(async (req: ExtRequest, res: Response) => {
    // const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
    ? EJSON.parse(req.query.filter)
    : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await logsService.queryLogs(filter, options);
    res.send(result);
});

const distinct = catchAsync(async (req: ExtRequest, res: Response) => {
    const { field } = pick(req.query, ['field']);
    const result = await logsService.distinct(String(field));
    res.send(result);
});

const createLog = catchAsync(async (req: ExtRequest, res: Response) => {
    const user = await logsService.createLogs(req.body);
    res.status(httpStatus.CREATED).send(user);
});

export {
    getLogs,
    distinct,
    createLog,
};
