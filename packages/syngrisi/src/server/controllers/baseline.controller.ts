import { HttpStatus } from '@utils';
import { catchAsync } from '@utils';
import { genericService } from '@services';
import { domSnapshotService } from '@services/dom-snapshot.service';

import { deserializeIfJSON, pick } from '@utils';
import { Response } from "express";

import { ApiError } from '@utils';
import { ExtRequest } from '@types';
import { getUsageCountsBySnapshotIds, remove as removeBaseline, promoteBaselines, promoteRun } from '@services/baseline.service';
import { getHistory, getHistorySummary, BaselineHistoryIdent } from '@services/baseline-history.service';
import { getById as getCheckById } from '@services/check.service';
import { getById as getAppById } from '@services/app.service';
import { sharedCheckId } from '@services/share.service';

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter)
        : {};

    if (req.user && req.user.role === 'user') {
        console.log('Filtering baselines for user:', req.user.username, req.user._id);
        filter.markedByUsername = req.user.username;
    }

    const scopedCheckId = sharedCheckId(req);
    if (scopedCheckId !== null) {
        const check = await getCheckById(scopedCheckId);
        if (!check) throw new ApiError(HttpStatus.NOT_FOUND, 'Shared check not found');
        // Overwrite any user-supplied scoping with the shared check's ident.
        delete filter.markedByUsername;
        filter.name = check.name;
        filter.app = check.app;
        filter.branch = check.branch;
        filter.browserName = check.browserName;
        filter.viewport = check.viewport;
        filter.os = check.os;
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
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot update the baseline - Id not found');
    const result = await genericService.put('VRSBaseline', id, req.body, req?.user);
    res.send(result);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user) throw new Error("req.user is empty");

    const result = await removeBaseline(id, req.user);
    res.send(result);
});

const getDomSnapshot = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Baseline ID is required');

    const snapshot = await domSnapshotService.getDomSnapshotByBaselineId(id);
    if (!snapshot) {
        throw new ApiError(HttpStatus.NOT_FOUND, `No DOM snapshot found for baseline: ${id}`);
    }

    const content = await domSnapshotService.getDomContentBySnapshot(snapshot);
    if (!content) {
        throw new ApiError(HttpStatus.NOT_FOUND, `Failed to read DOM snapshot content for baseline: ${id}`);
    }

    res.json(content);
});

const getBaselineHistory = catchAsync(async (req: ExtRequest, res: Response) => {
    let ident = deserializeIfJSON(String(req.query.filter)) as BaselineHistoryIdent;

    const scopedCheckId = sharedCheckId(req);
    if (scopedCheckId !== null) {
        // Share mode: derive the ident from the shared check and ignore the client-supplied
        // one, so a token for check A can only ever see check A's ident lineage.
        const check = await getCheckById(scopedCheckId);
        if (!check) throw new ApiError(HttpStatus.NOT_FOUND, 'Shared check not found');
        if (!check.branch || !check.browserName || !check.viewport || !check.os) {
            throw new ApiError(HttpStatus.NOT_FOUND, 'Shared check is missing ident fields');
        }
        ident = {
            name: check.name,
            app: String(check.app),
            branch: check.branch,
            browserName: check.browserName,
            viewport: check.viewport,
            os: check.os,
        };
    }

    const result = await getHistory(ident);
    res.send(result);
});

const getBaselineHistorySummary = catchAsync(async (req: ExtRequest, res: Response) => {
    const { fromBaselineId, toBaselineId } = req.body;
    const result = await getHistorySummary(fromBaselineId, toBaselineId);
    res.send(result);
});

const promote = catchAsync(async (req: ExtRequest, res: Response) => {
    if (!req.user) throw new Error("req.user is empty");
    const { runId, app: appId, fromBranch, toBranch } = req.body;

    if (runId) {
        const result = await promoteRun({ runId, user: req.user });
        res.send(result);
        return;
    }

    if (!appId || !fromBranch) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "either 'runId' or both 'app' and 'fromBranch' must be provided");
    }

    let resolvedToBranch = toBranch;
    if (!resolvedToBranch) {
        const app = await getAppById(appId);
        if (!app) throw new ApiError(HttpStatus.NOT_FOUND, `app not found, id: '${appId}'`);
        if (!app.mainBranch) throw new ApiError(HttpStatus.BAD_REQUEST, "project has no main branch configured");
        resolvedToBranch = app.mainBranch;
    }

    const result = await promoteBaselines({ appId, fromBranch, toBranch: resolvedToBranch, user: req.user });
    res.send(result);
});

export {
    get,
    put,
    remove,
    getDomSnapshot,
    getBaselineHistory,
    getBaselineHistorySummary,
    promote,
};
