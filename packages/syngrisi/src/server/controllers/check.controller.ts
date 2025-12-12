import { HttpStatus } from '@utils';
import { ApiError, catchAsync, deserializeIfJSON, pick, removeEmptyProperties } from '@utils';
import { genericService, checkService } from '@services';
import { ExtRequest } from '@types';
import { CheckDocument } from '@models';
import { Response } from "express";
import { appSettings } from '@settings';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    // const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter)
        : {};

    // Skip creator filtering for share mode (anonymous access via share link)
    if (req.user?.role === 'user' && !req.isShareMode) {
        filter.creatorUsername = req.user?.username;
    }

    if (req.isShareMode && (req as any).shareToken) {
        filter._id = (req as any).shareToken.checkId;
    }

    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSCheck', filter, options);
    const resultsWithAcceptance = await checkService.enrichChecksWithCurrentAcceptance((result.results as unknown) as CheckDocument[]);
    res.send({
        ...result,
        results: resultsWithAcceptance,
    });
});

const getViaPost = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = req.body.filter ? pick(req.body, ['filter']).filter : {};
    const options = req.body.options ? pick(req.body, ['options']).options : {};
    const result = await genericService.get('VRSCheck', filter, options);
    const resultsWithAcceptance = await checkService.enrichChecksWithCurrentAcceptance(result.results as CheckDocument[]);
    res.send({
        ...result,
        results: resultsWithAcceptance,
    });
});

const update = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    const opts = removeEmptyProperties(req.body);
    const user = req?.user?.username || 'unknown';
    const result = await checkService.update(id, opts, user);
    res.send(result);
});



const accept = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;


    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    if (!req.body.baselineId) throw new ApiError(HttpStatus.BAD_REQUEST, `Cannot accept the check: ${id} - new Baseline Id not found`);
    if (!req.user) throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    const result = await checkService.accept(id, req.body.baselineId, req.user);

    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    const isAuthEnabled = await appSettings.isAuthEnabled();
    if (req.user?.username === 'Guest' && isAuthEnabled) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'Guest users cannot perform this action');
    }
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot remove the check - Id not found');
    if (!req.user) throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    const result = await checkService.remove(id, req.user);
    res.send(result);
});

export {
    getViaPost,
    get,
    accept,
    remove,
    update,
};
