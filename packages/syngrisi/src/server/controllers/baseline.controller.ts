import httpStatus from 'http-status';
import { catchAsync } from '@utils';
import { genericService } from '@services';

import { deserializeIfJSON, pick } from '@utils';
import { Response } from "express";

import { ApiError } from '@utils';
import { ExtRequest } from '@types';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
    ? deserializeIfJSON(req.query.filter)
    : {};

    // const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSBaseline', filter, options);
    res.send(result);
});

const put = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update the baseline - Id not found');
    const result = await genericService.put('VRSBaseline', id, req.body, req?.user);
    res.send(result);
});

export {
    get,
    put,
};
