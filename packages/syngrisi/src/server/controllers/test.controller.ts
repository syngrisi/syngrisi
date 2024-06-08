import httpStatus from 'http-status';
import { pick, ApiError, catchAsync, deserializeIfJSON } from '@utils';
import { testService } from '@services';
import { Response } from "express";
import { ExtRequest } from '@types';

const getTest = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = {
        ...deserializeIfJSON(String(req.query.base_filter)),
        ...deserializeIfJSON(String(req.query.filter)),
    };

    if (req.user?.role === 'user') {
        filter.creatorUsername = req.user?.username;
    }

    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await testService.queryTests(filter, options);
    res.status(httpStatus.OK).send(result);
});

const distinct = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = pick(req.query, [
        'suite',
        'run',
        'markedAs',
        'creatorId',
        'creatorUsername',
        'name',
        'status',
        'browserName',
        'browserVersion',
        'branch',
        'tags',
        'viewport',
        'os',
        'app',
        'startDate',
        'filter',
    ]);
    const options = { ...pick(req.query, ['sortBy', 'limit', 'page', 'populate']), field: req.params.id };
    const result = await testService.queryTestsDistinct(filter, options);
    res.status(httpStatus.OK).send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the test - Id not found');
    if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the test - req.user is empty');
    const result = await testService.remove(id, req?.user);
    res.send(result);
});

const accept = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - req.user is empty');
    const result = await testService.accept(id, req?.user);
    res.send(result);
});

export {
    getTest,
    distinct,
    remove,
    accept,
};
