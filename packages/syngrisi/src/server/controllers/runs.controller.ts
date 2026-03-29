// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpStatus } from '@utils';
import { catchAsync, deserializeIfJSON, pick } from '@utils';
import { genericService, runService } from '@services';
import { ExtRequest } from '@types';
import { Response } from "express";


const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter) || {}
        : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSRun', filter, options);
    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user) throw new Error("req.user is empty");

    const result = await runService.remove(id, req?.user);
    res.send(result);
});

export {
    get,
    remove,
};
