import { Snapshot, Check, App, Baseline, CheckDocument } from '@models';
import { buildIdentObject, calculateAcceptedStatus, ident, errMsg, ApiError } from '@utils';
import { updateItemDate } from '@lib/dbItems';
import { prettyCheckParams } from '@utils';
import log from "@logger";
import { LogOpts } from '@types';
import { RequiredIdentOptionsType } from '@schemas';
import { SnapshotDiff } from '@schemas/SnapshotDiff.schema';
import { SnapshotDocument } from '@models/Snapshot.model';
// import { BaselineType } from '@schemas/Baseline.schema';
import { PaginateOptions } from '@models/plugins/utils';
import httpStatus from 'http-status';
import { UserDocument } from '@models/User.model';
import { UploadedFile } from 'express-fileupload';
import { TestDocument } from '@models/Test.model';
import { AppDocument } from '@models/App.model';
import { IdentType } from '@utils/buildIdentObject';
import StatusCodes from 'http-status';
import { SuiteDocument } from '@models/Suite.model';
import { BaselineDocument } from '../models/Baseline.model';
import { prepareActualSnapshot, isNeedFiles, createSnapshot } from './snapshot-file.service';
import { compareSnapshots } from './comparison.service';
import { startSession, endSession } from './test-run.service';

async function getAcceptedBaseline(params: IdentType) {
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, { itemType: 'baseline' });
    if (acceptedBaseline) return acceptedBaseline;
    return null;
}

async function getLastSuccessCheck(identifier: RequiredIdentOptionsType) {
    const condition = [{
        ...identifier,
        status: 'new',
    }, {
        ...identifier,
        status: 'passed',
    }];
    return (await Check.find({ $or: condition }).sort({ updatedDate: -1 }).limit(1))[0];
}

async function getNotPendingChecksByIdent(identifier: RequiredIdentOptionsType) {
    return Check.find({
        ...identifier,
        status: { $ne: 'pending' },
    }).sort({ updatedDate: -1 }).exec();
}

const isBaselineValid = (baseline: BaselineDocument) => {
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

const updateCheckParamsFromBaseline = (params: CreateCheckParamsExtended, baseline: BaselineDocument): CreateCheckParamsExtended => {
    const updatedParams = { ...params };
    updatedParams.baselineId = baseline.snapshootId.toString();
    updatedParams.markedAs = baseline.markedAs;
    updatedParams.markedDate = baseline.lastMarkedDate?.toString();
    updatedParams.markedByUsername = baseline.markedByUsername;
    return updatedParams;
};

async function inspectBaseline(
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

type DimensionType = { height: number, width: number };

const ignoreDifferentResolutions = ({ height, width }: DimensionType) => {
    if ((width === 0) && (height === -1)) return true;
    if ((width === 0) && (height === 1)) return true;
    return false;
};

interface CompareResult {
    failReasons: string[];
    diffId: string;
    diffSnapshot: SnapshotDocument;
    status: string;
    result: string;
    isSameDimensions: boolean;
    dimensionDifference: DimensionType;
}

const compare = async (
    expectedSnapshot: SnapshotDocument,
    actualSnapshot: SnapshotDocument,
    newCheckParams: CreateCheckParamsExtended,
    // vShifting: boolean,
    skipSaveOnCompareError: boolean,
    currentUser: UserDocument
): Promise<CompareResult> => {
    const logOpts: LogOpts = {
        scope: 'createCheck.compare',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'COMPARE',
    };

    const executionTimer = process.hrtime();
    const compareResult: Partial<CompareResult> = {};
    compareResult.failReasons = [...newCheckParams.failReasons];

    let checkCompareResult: SnapshotDiff;
    let diffSnapshot: SnapshotDocument | null = null;

    const areSnapshotsDifferent = (result: SnapshotDiff) => result.rawMisMatchPercentage.toString() !== '0';
    const areSnapshotsWrongDimensions = (result: Partial<CompareResult>) => !result.isSameDimensions && !ignoreDifferentResolutions(result.dimensionDifference!);

    if ((newCheckParams.status !== 'new') && (!compareResult.failReasons.includes('not_accepted'))) {
        try {
            log.debug(`'the check with name: '${newCheckParams.name}' isn't new, make comparing'`, logOpts);
            checkCompareResult = await compareSnapshots(expectedSnapshot, actualSnapshot, { vShifting: newCheckParams.vShifting });
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);

            if (areSnapshotsDifferent(checkCompareResult) || areSnapshotsWrongDimensions(checkCompareResult)) {
                let logMsg;
                if (areSnapshotsWrongDimensions(checkCompareResult)) {
                    logMsg = 'snapshots have different dimensions';
                    compareResult.failReasons.push('wrong_dimensions');
                }
                if (areSnapshotsDifferent(checkCompareResult)) {
                    logMsg = 'snapshots have differences';
                    compareResult.failReasons.push('different_images');
                }

                if (logMsg) log.debug(logMsg, logOpts);
                log.debug(`saving diff snapshot for check with name: '${newCheckParams.name}'`, logOpts);
                if (!skipSaveOnCompareError) {
                    diffSnapshot = await createSnapshot({
                        name: newCheckParams.name,
                        fileData: checkCompareResult.getBuffer!(),
                    });
                    compareResult.diffId = diffSnapshot.id;
                    compareResult.diffSnapshot = diffSnapshot;
                }
                compareResult.status = 'failed';
            } else {
                compareResult.status = 'passed';
            }

            checkCompareResult.totalCheckHandleTime = process.hrtime(executionTimer).toString();
            compareResult.result = JSON.stringify(checkCompareResult, null, '\t');
        } catch (e: unknown) {
            // compareResult.updatedDate = Date.now();
            compareResult.status = 'failed';
            compareResult.result = JSON.stringify({ server_error: `error during comparing - ${errMsg(e)}` });
            compareResult.failReasons.push('internal_server_error');
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `error during comparing: ${errMsg(e)}`);
        }
    }

    if (compareResult.failReasons.length > 0) {
        compareResult.status = 'failed';
    }
    return compareResult as CompareResult;
};

export interface CreateCheckParams {
    name: string;
    // status:  'new' | 'pending' | 'passed' | 'failed' | 'blinking';
    status: 'new' | 'pending' | 'passed' | 'failed';
    viewport: string;
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    updatedDate: number;
    suite: string;
    app: string;
    branch: string;
    domDump?: string;
    run: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    actualSnapshotId?: string
    result?: string,
    files?: { file: UploadedFile },
    hashCode: string,
    vShifting?: boolean
}
export interface CreateCheckParamsExtended {
    test: string;
    name: string;
    // status:  'new' | 'pending' | 'passed' | 'failed' | 'blinking';
    status: 'new' | 'pending' | 'passed' | 'failed';
    viewport: string;
    browserName: string;
    browserVersion: string;
    browserFullVersion: string;
    os: string;
    updatedDate: number;
    suite: string;
    app: string;
    branch: string;
    domDump?: string;
    run: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    actualSnapshotId?: string
    result?: string,
    files?: { file: UploadedFile },
    hashCode: string,
    vShifting?: boolean,
    baselineId?: string,
    markedAs?: string
    markedDate?: string,
    markedByUsername?: string,
}

const createCheckParams = (checkParam: CreateCheckParams, suite: SuiteDocument, app: AppDocument, test: TestDocument, currentUser: UserDocument): CreateCheckParamsExtended => ({
    test: test.id,
    name: checkParam.name,
    status: 'pending',
    viewport: checkParam.viewport,
    browserName: checkParam.browserName,
    browserVersion: checkParam.browserVersion,
    browserFullVersion: checkParam.browserFullVersion,
    os: checkParam.os,
    updatedDate: Date.now(),
    suite: suite.id,
    app: app.id,
    branch: checkParam.branch,
    domDump: checkParam.domDump,
    run: test.run.toString(),
    creatorId: currentUser._id.toString(),
    creatorUsername: currentUser.username,
    hashCode: checkParam.hashCode,
    failReasons: [],
});


const createCheck = async (checkParam: CreateCheckParams, test: TestDocument, suite: SuiteDocument, app: AppDocument, currentUser: UserDocument, skipSaveOnCompareError = false) => {
    const logOpts: LogOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    let actualSnapshot: SnapshotDocument;
    let currentBaselineSnapshot: SnapshotDocument;

    const newCheckParams = createCheckParams(checkParam, suite, app, test, currentUser);
    const checkIdent = buildIdentObject(newCheckParams);

    let check: CheckDocument | null = null;
    const totalCheckHandleTime = 0;
    // const diffSnapshot: object | null = null;

    const addCheck = (test: TestDocument, check: CheckDocument) => {
        if (test.checks) {
            test.checks.push(check.id);
        } else {
            test.checks = [check.id];
        }
    }

    try {
        const { needFilesStatus, snapshotFoundedByHashcode } = await isNeedFiles(checkParam, logOpts);
        if (needFilesStatus) return { status: 'needFiles' };

        actualSnapshot = await prepareActualSnapshot(checkParam, snapshotFoundedByHashcode, logOpts);
        newCheckParams.actualSnapshotId = actualSnapshot.id;

        log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, logOpts);
        const storedBaseline = await getAcceptedBaseline(checkIdent);

        const inspectBaselineResult = await inspectBaseline(newCheckParams, storedBaseline, checkIdent, actualSnapshot, logOpts);
        Object.assign(newCheckParams, inspectBaselineResult.inspectBaselineParams);
        currentBaselineSnapshot = inspectBaselineResult.currentBaselineSnapshot;

        const compareResult = await compare(currentBaselineSnapshot, actualSnapshot, newCheckParams, skipSaveOnCompareError, currentUser);

        Object.assign(newCheckParams, compareResult);

        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
        check = await Check.create(newCheckParams);
        const savedCheck = await check.save();

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = String(check.id);
        log.debug(`update test with check id: '${check.id}'`, logOpts);

        addCheck(test, check);

        test.markedAs = await calculateAcceptedStatus(check.test);
        test.updatedDate = new Date();

        await test.save();

        log.debug('update suite and run', logOpts);

        await updateItemDate('VRSSuite', check.suite);
        await updateItemDate('VRSRun', check.run);

        const lastSuccessCheck = await getLastSuccessCheck(checkIdent);

        const checkObject = savedCheck.toObject();

        type CheckResult = (typeof checkObject) & {
            currentSnapshot: SnapshotDocument,
            expectedSnapshot: SnapshotDocument,
            diffSnapshot: SnapshotDocument,
            executeTime: number,
            lastSuccess: string,
        }

        const result: CheckResult = {
            ...checkObject,
            currentSnapshot: actualSnapshot,
            expectedSnapshot: currentBaselineSnapshot,
            diffSnapshot: compareResult.diffSnapshot,
            executeTime: totalCheckHandleTime,
            lastSuccess: lastSuccessCheck ? lastSuccessCheck.id : null,
        };

        return result;
    } catch (e: unknown) {
        newCheckParams.status = 'failed';
        newCheckParams.result = `{ "server error": "${errMsg(e)}" }`;
        newCheckParams.failReasons.push('internal_server_error');

        if (!check) {
            log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
            check = await Check.create(newCheckParams);
            await check.save();
        } else {
            check.set(newCheckParams)
            await check.save();
        }

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = check.id;
        log.debug(`update test with check id: '${check.id}'`, logOpts);
        addCheck(test, check);
        await test.save();

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errMsg(e));
    }
};

const getIdent = () => ident;

const getBaselines = async (filter: RequiredIdentOptionsType, options: PaginateOptions) => {
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
    filter.app = app._id;
    log.debug(`Get baselines with filter: '${JSON.stringify(filter)}', options: '${JSON.stringify(options)}'`, logOpts);
    return Baseline.paginate(filter, options);
};

export {
    startSession,
    endSession,
    createCheck,
    getIdent,
    getBaselines,
};
