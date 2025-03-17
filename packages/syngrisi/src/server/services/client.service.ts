import fs, { promises as fsp } from 'fs';
import hasha from 'hasha';
import { Snapshot, Check, Test, App, Baseline, CheckDocument } from '@models';
import { removeEmptyProperties, waitUntil, buildIdentObject, calculateAcceptedStatus, ident, errMsg, ApiError } from '@utils';
import { updateItemDate, createTest, createItemIfNotExistAsync, createRunIfNotExist, createSuiteIfNotExist } from '@lib/dbItems';
import { config } from '@config';
import { prettyCheckParams } from '@utils';
import { getDiff } from '@lib/сomparison';
import log from "@logger";
import { LogOpts } from '@types';
import { UpdateTestType } from '@schemas/Test.schema';
import { ClientStartSessionType } from '@schemas/Client.schema';
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
import path from 'path';

async function updateTest(id: string, update: UpdateTestType) {
    const logOpts: LogOpts = {
        scope: 'updateTest',
        itemType: 'test',
        msgType: 'UPDATE',
        ref: id,
    };
    log.debug(`update test id '${id}' with params '${JSON.stringify(update)}'`, logOpts);
    const updatedDate = update.updatedDate || Date.now();
    const test = await Test.findByIdAndUpdate(
        id,
        { ...update, updatedDate }
    ).exec();
    await test?.save();
    return test;
}

const startSession = async (params: ClientStartSessionType, username: string) => {
    const logOpts = {
        scope: 'createTest',
        user: username,
        itemType: 'test',
        msgType: 'CREATE',
    };
    log.info(`create test with name '${params.name}', params: '${JSON.stringify(params)}'`, logOpts);
    const opts = removeEmptyProperties({
        name: params.name,
        status: 'Running',
        app: params.app,
        tags: params.tags && JSON.parse(params.tags),
        branch: params.branch,
        viewport: params.viewport,
        browserName: params.browser,
        browserVersion: params.browserVersion,
        browserFullVersion: params.browserFullVersion,
        os: params.os,
        startDate: new Date(),
        updatedDate: new Date(),
    });
    try {
        const app = await createItemIfNotExistAsync(
            'VRSApp',
            { name: params.app },
            { user: username, itemType: 'app' }
        );
        opts.app = app._id;

        const run = await createRunIfNotExist(
            { name: params.run, ident: params.runident, app: app._id },
            { user: username, itemType: 'run' }
        );
        opts.run = run._id;

        const suite = await createSuiteIfNotExist(
            { name: params.suite || 'Others', app: app._id, createdDate: new Date() },
            { user: username, itemType: 'suite' }
        );

        opts.suite = suite._id;

        const test = await createTest(opts);
        return test;
    } catch (e: unknown) {
        log.error(`cannot start session '${params.name}', params: '${JSON.stringify(params)}', error: ${errMsg(e)}`, logOpts);
        throw e;
    }
};

const endSession = async (testId: string, username: string) => {
    const logOpts = {
        scope: 'stopSession',
        msgType: 'END_SESSION',
        user: username,
        itemType: 'test',
        ref: testId,
    };
    await waitUntil(async () => (await Check.find({ test: testId }).exec()).filter((ch) => ch.status.toString() !== 'pending').length > 0);
    const sessionChecks = await Check.find({ test: testId }).lean().exec();

    const checksStatuses = sessionChecks.map((x) => x.status[0]);
    // const checksViewports = sessionChecks.map((x) => x.viewport);

    // const uniqueChecksViewports = Array.from(new Set(checksViewports));
    // let calculatedViewport: string | undefined;
    // if (uniqueChecksViewports.length === 1) {
    //     calculatedViewport = uniqueChecksViewports[0];
    // } else {
    //     calculatedViewport = String(uniqueChecksViewports.length);
    // }

    let status = 'not set';
    if (checksStatuses.some((st) => st === 'failed')) {
        status = 'Failed';
    }
    if (checksStatuses.some((st) => st === 'passed') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'new') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'blinking') && !checksStatuses.some((st) => st === 'failed')) {
        status = 'Passed';
    }
    if (checksStatuses.every((st) => st === 'new')) {
        status = 'New';
    }
    const blinking = checksStatuses.filter((g) => g === 'blinking').length;
    const testParams = {
        status,
        blinking,
        // calculatedViewport,
    };
    log.info(`the session is over, the test will be updated with parameters: '${JSON.stringify(testParams)}'`, logOpts);
    const updatedTest = await updateTest(testId, testParams);
    const result = updatedTest?.toObject();
    // result.calculatedStatus = status;
    return result;
};

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

async function getSnapshotByImgHash(hash: string): Promise<SnapshotDocument | null> {
    return Snapshot.findOne({ imghash: hash });
}

interface CreateSnapshotParameters {
    name: string;
    fileData: Buffer | null;
    hashCode?: string;
}

async function createSnapshot(parameters: CreateSnapshotParameters) {
    const logOpts: LogOpts = {
        scope: 'createSnapshot',
        itemType: 'snapshot',
        msgType: 'CREATE'
    };

    const { name, fileData, hashCode } = parameters;

    const opts: Partial<SnapshotDocument> = { name };
    // const opts: SnapshotUpdateType = { name };

    // if (!fileData) throw new Error(`cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);
    if (fileData === null) throw new ApiError(httpStatus.BAD_REQUEST, `cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);


    opts.imghash = hashCode || hasha(fileData);
    const snapshot = new Snapshot(opts);
    const filename = `${snapshot.id}.png`;
    const imagePath = path.join(config.defaultImagesPath, filename);
    log.debug(`save screenshot for: '${name}' snapshot to: '${imagePath}'`, logOpts);
    await fsp.writeFile(imagePath, fileData);
    snapshot.filename = filename;
    await snapshot.save();
    log.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, { ...logOpts, ...{ ref: snapshot._id } });
    return snapshot;
}

async function cloneSnapshot(sourceSnapshot: SnapshotDocument, name: string) {
    const { filename } = sourceSnapshot;
    const hashCode = sourceSnapshot.imghash;
    const newSnapshot = new Snapshot({ name, filename, imghash: hashCode });
    await newSnapshot.save();
    return newSnapshot;
}

interface CompareSnapshotsOptions {
    vShifting?: boolean;
    ignore?: string;
    ignoredBoxes?: string;
}

async function compareSnapshots(baselineSnapshot: SnapshotDocument, actual: SnapshotDocument, opts: CompareSnapshotsOptions = {}) {
    const logOpts = {
        scope: 'compareSnapshots',
        ref: baselineSnapshot.id,
        itemType: 'snapshot',
        msgType: 'COMPARE',
    };
    try {
        log.debug(`compare baseline and actual snapshots with ids: [${baselineSnapshot.id}, ${actual.id}]`, logOpts);
        log.debug(`current baseline snapshot: ${JSON.stringify(baselineSnapshot)}`, logOpts);
        let diff: SnapshotDiff;
        if (baselineSnapshot.imghash === actual.imghash) {
            log.debug(`baseline and actual snapshot have the identical image hashes: '${baselineSnapshot.imghash}'`, logOpts);
            diff = {
                isSameDimensions: true,
                dimensionDifference: { width: 0, height: 0 },
                rawMisMatchPercentage: 0,
                misMatchPercentage: '0.00',
                analysisTime: 0,
                executionTotalTime: '0',
                getBuffer: null
            };
        } else {
            const baselinePath = path.join(config.defaultImagesPath, baselineSnapshot.filename);
            const actualPath = path.join(config.defaultImagesPath, actual.filename);
            const baselineData = await fsp.readFile(baselinePath);
            const actualData = await fsp.readFile(actualPath);
            log.debug(`baseline path: ${baselinePath}`, logOpts);
            log.debug(`actual path: ${actualPath}`, logOpts);
            const options = opts;
            const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id }).exec();

            if (baseline) { // ts refactoring TODO: find out a proper way
                if (baseline.ignoreRegions) {
                    log.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
                    options.ignoredBoxes = JSON.parse(baseline.ignoreRegions);
                }
                options.ignore = baseline.matchType || 'nothing';
            }

            diff = await getDiff(baselineData, actualData, options);
        }

        log.silly(`the diff is: '${JSON.stringify(diff, null, 2)}'`);
        if (diff.rawMisMatchPercentage.toString() !== '0') {
            log.debug(`images are different, ids: [${baselineSnapshot.id}, ${actual.id}], rawMisMatchPercentage: '${diff.rawMisMatchPercentage}'`);
        }
        if (diff.stabMethod && diff.vOffset) {
            if (diff.stabMethod === 'downup') {
                actual.vOffset = -diff.vOffset;
                await actual.save();
            }
            if (diff.stabMethod === 'updown') {
                baselineSnapshot.vOffset = -diff.vOffset;
                await baselineSnapshot.save();
            }
        }
        return diff;
    } catch (e: unknown) {
        const errMsg = `cannot compare snapshots: ${e}\n ${e instanceof Error ? e.stack : e}`;
        log.error(errMsg, logOpts);
        throw new Error(String(e));
    }
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

const prepareActualSnapshot = async (checkParam: CreateCheckParams, snapshotFoundedByHashcode: SnapshotDocument | null, logOpts: LogOpts) => {
    let currentSnapshot: SnapshotDocument;
    const fileData = checkParam.files ? checkParam.files.file.data : null;

    if (snapshotFoundedByHashcode) {
        const fullFilename = path.join(config.defaultImagesPath, snapshotFoundedByHashcode.filename);
        if (!fs.existsSync(fullFilename)) {
            throw new Error(`Couldn't find the baseline file: '${fullFilename}'`);
        }

        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, logOpts);

        if (!checkParam.name) throw new ApiError(httpStatus.BAD_REQUEST, `Cannot prepareActualSnapshot name is empty, hashe: ${checkParam.hashCode}`);
        currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
    } else {
        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, logOpts);
        currentSnapshot = await createSnapshot({ name: checkParam.name!, fileData, hashCode: checkParam.hashCode });
    }

    return currentSnapshot;
};

async function isNeedFiles(checkParam: CreateCheckParams, logOpts: LogOpts)
    : Promise<{ needFilesStatus: boolean; snapshotFoundedByHashcode: SnapshotDocument | null; }> {
    const snapshotFoundedByHashcode = await getSnapshotByImgHash(checkParam.hashCode);

    if (!checkParam.hashCode && !checkParam.files) {
        log.debug('hashCode or files parameters should be present', logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }

    if (!checkParam.files && !snapshotFoundedByHashcode) {
        log.debug(`cannot find the snapshot with hash: '${checkParam.hashCode}'`, logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }
    return { needFilesStatus: false, snapshotFoundedByHashcode };
}

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
