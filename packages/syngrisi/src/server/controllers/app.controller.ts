import { HttpStatus } from '@utils';
import { catchAsync, deserializeIfJSON, pick } from '@utils';
import { appService } from '@services';
import { Request, Response } from "express"
import { config } from "@config";

const info = catchAsync(async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({ version: config.version });
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
