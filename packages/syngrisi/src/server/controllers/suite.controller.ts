// eslint-disable-next-line @typescript-eslint/no-unused-vars
import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { catchAsync, pick } from '@utils';
import { genericService, suiteService } from '@services';
import { Response } from "express";
import { ExtRequest } from '@types';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    // const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
    ? EJSON.parse(req.query.filter)
    : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSuite', filter, options);
    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if(!req.user) throw new Error("req.user is empty");
    const result = await suiteService.remove(id, req?.user);
    res.send(result);
});

export {
    get,
    remove,
};
