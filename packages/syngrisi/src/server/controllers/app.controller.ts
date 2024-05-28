/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { catchAsync, pick } from '../utils';
import { appService } from '../services';

const info = catchAsync(async (req: any, res: any) => {
    res.status(httpStatus.OK).json({ version: (global as any).version });
});

const get = catchAsync(async (req: any, res: any) => {
    const filter = req.query.filter ? JSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await appService.get(filter, options);
    res.send(result);
});

export {
    info,
    get,
};
