// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpStatus } from '@utils';
import { catchAsync, deserializeIfJSON } from '@utils';
import { genericService } from '@services';
import { Response } from "express";

import { pick } from '@utils';
import { ExtRequest } from '@types';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter) || {}
        : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSnapshot', filter, options);
    res.send(result);
});

export {
    get,
};
