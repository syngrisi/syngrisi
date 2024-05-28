/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { catchAsync, pick } from '../utils';
import { genericService, suiteService } from '../services';

const get = catchAsync(async (req: any, res: any) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSuite', filter, options);
    res.send(result);
});

const remove = catchAsync(async (req: any, res: any) => {
    const { id } = req.params;
    const result = await suiteService.remove(id, req?.user);
    res.send(result);
});

export {
    get,
    remove,
};
