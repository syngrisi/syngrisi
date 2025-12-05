import httpStatus from 'http-status';
import { catchAsync } from '@utils';
import { genericService } from '@services';

import { deserializeIfJSON, pick } from '@utils';
import { Response } from "express";

import { ApiError } from '@utils';
import { ExtRequest } from '@types';
import { getUsageCountsBySnapshotIds, remove as removeBaseline } from '@services/baseline.service';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter)
        : {};

    if (req.user && req.user.role === 'user') {
        console.log('Filtering baselines for user:', req.user.username, req.user._id);
        filter.markedByUsername = req.user.username;
    }

    const includeUsage = String(req.query.includeUsage).toLowerCase() === 'true';

    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSBaseline', filter, options);

    if (includeUsage && result?.results?.length) {

        const snapshotIds = (result?.results || []).map((item: any) => (item.snapshootId && item.snapshootId._id) ? item.snapshootId._id : item.snapshootId);
        const usageMap = await getUsageCountsBySnapshotIds(snapshotIds);

        result.results = (result?.results || []).map((item: any) => {
            const obj = item?.toObject ? item.toObject() : item;
            let snapId = '';
            if (obj.snapshootId) {
                if (obj.snapshootId._id) {
                    snapId = obj.snapshootId._id.toString();
                } else {
                    snapId = obj.snapshootId.toString();
                }
            }
            return {
                ...obj,
                usageCount: usageMap[snapId] || 0,
            };
        });
    }

    res.send(result);
});

const put = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update the baseline - Id not found');
    const result = await genericService.put('VRSBaseline', id, req.body, req?.user);
    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user) throw new Error("req.user is empty");

    const result = await removeBaseline(id, req.user);
    res.send(result);
});

export {
    get,
    put,
    remove,
};
