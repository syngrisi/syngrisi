/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { catchAsync, deserializeIfJSON, pick } from '../utils';
import { appService } from '../services';
import { Request, Response } from "express"

const info = catchAsync(async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({ version: (global as any).version });
});

const get = catchAsync(async (req: Request, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter)
        : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await appService.get(filter, options);
    res.send(result);
});

export {
    info,
    get,
};
