/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { catchAsync } from '../utils';
import { genericService } from '../services';

import { pick } from '../utils';

const get = catchAsync(async (req: any, res: any) => {
    // const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
    ? EJSON.parse(req.query.filter)
    : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSnapshot', filter, options);
    res.send(result);
});

export {
    get,
};
