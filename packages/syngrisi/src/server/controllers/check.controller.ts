import httpStatus from 'http-status';
import { ApiError, catchAsync, deserializeIfJSON, pick, removeEmptyProperties } from '@utils';
import { genericService, checkService } from '@services';
import { ExtRequest } from '@types';
import { Response } from "express";

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    // const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
    ? deserializeIfJSON(req.query.filter)
    : {};

    if (req.user?.role === 'user') {
        filter.creatorUsername = req.user?.username;
    }

    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSCheck', filter, options);
    res.send(result);
});

const getViaPost = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = req.body.filter ? pick(req.body, ['filter']).filter : {};
    const options = req.body.options ? pick(req.body, ['options']).options : {};
    const result = await genericService.get('VRSCheck', filter, options);
    res.send(result);
});

const update = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    const opts = removeEmptyProperties(req.body);
    const user = req?.user?.username;
    const result = await checkService.update(id, opts, user);
    res.send(result);
});

const accept = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    if (!req.body.baselineId) throw new ApiError(httpStatus.BAD_REQUEST, `Cannot accept the check: ${id} - new Baseline Id not found`);
    const result = await checkService.accept(id, req.body.baselineId, req?.user);
    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the check - Id not found');
    const result = await checkService.remove(id, req?.user);
    res.send(result);
});

export {
    getViaPost,
    get,
    accept,
    remove,
    update,
};
