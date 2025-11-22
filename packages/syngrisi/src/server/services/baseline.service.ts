import { Snapshot, Check, App, Baseline } from '@models';
import { buildIdentObject, prettyCheckParams, ApiError } from '@utils';
import log from "@logger";
import { LogOpts } from '@types';
import { RequiredIdentOptionsType } from '@schemas';
import { SnapshotDocument } from '@models/Snapshot.model';
import { PaginateOptions } from '@models/plugins/utils';
import httpStatus from 'http-status';
import { IdentType } from '@utils/buildIdentObject';
import { BaselineDocument } from '../models/Baseline.model';
import { CreateCheckParamsExtended } from '../../types/Check';

export async function getAcceptedBaseline(params: IdentType) {
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, { itemType: 'baseline' });
    if (acceptedBaseline) return acceptedBaseline;
    return null;
}

export async function getLastSuccessCheck(identifier: RequiredIdentOptionsType) {
    const condition = [{
        ...identifier,
        status: 'new',
    }, {
        ...identifier,
        status: 'passed',
    }];
    return (await Check.find({ $or: condition }).sort({ updatedDate: -1 }).limit(1))[0];
}

export async function getNotPendingChecksByIdent(identifier: RequiredIdentOptionsType) {
    return Check.find({
        ...identifier,
        status: { $ne: 'pending' },
    }).sort({ updatedDate: -1 }).exec();
}

export const isBaselineValid = (baseline: BaselineDocument) => {
    const keys = [
        'name', 'app', 'branch', 'browserName', 'viewport', 'os',
        'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
    ];
    for (const key of keys) {
        if (!baseline[key as keyof BaselineDocument]) {
            log.error(`invalid baseline, the '${key}' property is empty`);
            return false;
        }
    }
    return true;
};

export const updateCheckParamsFromBaseline = (params: CreateCheckParamsExtended, baseline: BaselineDocument): CreateCheckParamsExtended => {
    const updatedParams = { ...params };
    updatedParams.baselineId = baseline.snapshootId.toString();
    updatedParams.markedAs = baseline.markedAs;
    updatedParams.markedDate = baseline.lastMarkedDate?.toString();
    updatedParams.markedByUsername = baseline.markedByUsername;
    return updatedParams;
};

export async function inspectBaseline(
    newCheckParams: CreateCheckParamsExtended,
    storedBaseline: BaselineDocument | null,
    checkIdent: IdentType,
    currentSnapshot: SnapshotDocument,
    logOpts: LogOpts
): Promise<{ inspectBaselineParams: CreateCheckParamsExtended, currentBaselineSnapshot: SnapshotDocument }> {

    let currentBaselineSnapshot: SnapshotDocument | null = null;
    const params: Partial<(CreateCheckParamsExtended)> = {};
    params.failReasons = [];
    if (storedBaseline !== null) {
        log.debug(`a baseline for check name: '${newCheckParams.name}', id: '${storedBaseline.snapshootId}' is already exists`, logOpts);
        if (!isBaselineValid(storedBaseline)) {
            newCheckParams.failReasons.push('invalid_baseline');
        }
        Object.assign(params, updateCheckParamsFromBaseline(newCheckParams, storedBaseline));
        currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
        if (!currentBaselineSnapshot) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot find the snapshot with id: ${storedBaseline.snapshootId}`);
    } else {
        const checksWithSameIdent = await getNotPendingChecksByIdent(checkIdent);
        if (checksWithSameIdent.length > 0) {
            log.error(`checks with ident'${JSON.stringify(checkIdent)}' exist, but baseline is absent`, logOpts);
            params.failReasons.push('not_accepted');
            params.baselineId = currentSnapshot.id.toString();
            currentBaselineSnapshot = currentSnapshot;
        } else {
            params.baselineId = currentSnapshot.id;
            params.status = 'new';
            currentBaselineSnapshot = currentSnapshot;
            log.debug(`create the new check with params: '${prettyCheckParams(params)}'`, logOpts);
        }
    }

    return { inspectBaselineParams: params as CreateCheckParamsExtended, currentBaselineSnapshot };
}

export const getBaselines = async (filter: RequiredIdentOptionsType, options: PaginateOptions) => {
    const logOpts: LogOpts = {
        scope: 'getBaselines',
        itemType: 'baseline',
        msgType: 'GET',
    };
    const app = await App.findOne({ name: filter.app });
    if (!app) {
        log.error(`Cannot find the app: '${filter.app}'`, logOpts);
        return {};
    }
    filter.app = app.id;
    log.debug(`Get baselines with filter: '${JSON.stringify(filter)}', options: '${JSON.stringify(options)}'`, logOpts);
    return Baseline.paginate(filter, options);
};
