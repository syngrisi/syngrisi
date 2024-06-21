/* eslint-disable @typescript-eslint/ban-ts-comment_ */
/* eslint-disable @typescript-eslint/no-explicit-any_ */
import fs, { promises as fsp } from 'fs';
import hasha from 'hasha';
import { Snapshot, Check, Test, App, Baseline } from '@models';
import { removeEmptyProperties, waitUntil, buildIdentObject, calculateAcceptedStatus, ident, errMsg } from '@utils';
import { updateItemDate, createTest, createItemIfNotExistAsync, createRunIfNotExist, createSuiteIfNotExist } from '@lib/dbItems';
import { config } from '@config';
import { prettyCheckParams } from '@utils';
import { getDiff } from '@lib/сomparison';
import log from "@logger";
import { LogOpts } from '@types';
import { UpdateTestType } from '@schemas/Test.schema';
import { ClientStartSessionType } from '@schemas/Client.schema';
import { baselineParamsType } from './check.service';
import { RequiredIdentOptionsType } from '@schemas';
import { SnapshotType } from '@schemas/Snapshots.schema';
import { SnapshotDiff } from '@schemas/SnapshotDiff.schema';
import { SnapshotDocument } from '@models/Snapshot.model';
import { BaselineType } from '@schemas/Baseline.schema';
import { CheckUpdateType } from '@schemas/Check.schema';


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

async function getAcceptedBaseline(params: baselineParamsType) {
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

async function getSnapshotByImgHash(hash: string) {
    return Snapshot.findOne({ imghash: hash }).exec();
}

interface CreateSnapshotParameters {
    name: string;
    fileData: Buffer;
    hashCode?: string;
}

async function createSnapshot(parameters: CreateSnapshotParameters) {
    const logOpts: LogOpts = {
        scope: 'createSnapshot',
        itemType: 'snapshot',
        msgType: 'CREATE'
    };

    const { name, fileData, hashCode } = parameters;

    const opts: any = { name };

    if (!fileData) throw new Error(`cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);

    opts.imghash = hashCode || hasha(fileData);
    const snapshot = new Snapshot(opts);
    const filename = `${snapshot.id}.png`;
    const path = `${config.defaultImagesPath}${filename}`;
    log.debug(`save screenshot for: '${name}' snapshot to: '${path}'`, logOpts);
    await fsp.writeFile(path, fileData);
    snapshot.filename = filename;
    await snapshot.save();
    log.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, { ...logOpts, ...{ ref: snapshot._id } });
    return snapshot;
}

async function cloneSnapshot(sourceSnapshot: SnapshotType, name: string) {
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
            };
        } else {
            const baselinePath = `${config.defaultImagesPath}${baselineSnapshot.filename}`;
            const actualPath = `${config.defaultImagesPath}${actual.filename}`;
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

const isBaselineValid = (baseline: BaselineType) => {
    const keys = [
        'name', 'app', 'branch', 'browserName', 'viewport', 'os',
        'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
    ];
    for (const key of keys) {
        if (!baseline[key as keyof BaselineType]) {
            log.error(`invalid baseline, the '${key}' property is empty`);
            return false;
        }
    }
    return true;
};

const updateCheckParamsFromBaseline = (params: CheckUpdateType, baseline: BaselineType) => {
    const updatedParams = { ...params };
    updatedParams.baselineId = baseline.snapshootId;
    updatedParams.markedAs = baseline.markedAs;
    updatedParams.markedDate = baseline.lastMarkedDate;
    updatedParams.markedByUsername = baseline.markedByUsername;
    return updatedParams;
};

const prepareActualSnapshot = async (checkParam: any, snapshotFoundedByHashcode: SnapshotType, logOpts: LogOpts) => {
    let currentSnapshot: SnapshotType;
    const fileData = checkParam.files ? checkParam.files.file.data : false;

    if (snapshotFoundedByHashcode) {
        const fullFilename = `${config.defaultImagesPath}${snapshotFoundedByHashcode.filename}`;
        if (!fs.existsSync(fullFilename)) {
            throw new Error(`Couldn't find the baseline file: '${fullFilename}'`);
        }

        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, logOpts);
        currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
    } else {
        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, logOpts);
        currentSnapshot = await createSnapshot({ name: checkParam.name, fileData, hashCode: checkParam.hashCode });
    }

    return currentSnapshot;
};

async function isNeedFiles(checkParam: any, logOpts: any) {
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

async function inspectBaseline(newCheckParams: any, storedBaseline: any, checkIdent: any, currentSnapshot: any, logOpts: any) {
    let currentBaselineSnapshot: any = null;
    const params: Partial<(CheckUpdateType)> = {};
    params.failReasons = [];
    if (storedBaseline !== null) {
        log.debug(`a baseline for check name: '${newCheckParams.name}', id: '${storedBaseline.snapshootId}' is already exists`, logOpts);
        if (!isBaselineValid(storedBaseline)) {
            newCheckParams.failReasons.push('invalid_baseline');
        }
        Object.assign(params, updateCheckParamsFromBaseline(newCheckParams, storedBaseline));
        currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
    } else {
        const checksWithSameIdent = await getNotPendingChecksByIdent(checkIdent);
        if (checksWithSameIdent.length > 0) {
            log.error(`checks with ident'${JSON.stringify(checkIdent)}' exist, but baseline is absent`, logOpts);
            params.failReasons.push('not_accepted');
            params.baselineId = currentSnapshot.id;
            currentBaselineSnapshot = currentSnapshot;
        } else {
            params.baselineId = currentSnapshot.id;
            params.status = 'new';
            currentBaselineSnapshot = currentSnapshot;
            log.debug(`create the new check with params: '${prettyCheckParams(params)}'`, logOpts);
        }
    }

    return { inspectBaselineParams: params, currentBaselineSnapshot };
}

const ignoreDifferentResolutions = ({ height, width }: any) => {
    if ((width === 0) && (height === -1)) return true;
    if ((width === 0) && (height === 1)) return true;
    return false;
};

const compare = async (expectedSnapshot: any, actualSnapshot: any, newCheckParams: any, vShifting: any, skipSaveOnCompareError: boolean, currentUser: any) => {
    const logOpts: LogOpts = {
        scope: 'createCheck.compare',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'COMPARE',
    };

    const executionTimer = process.hrtime();
    const params: any = {};
    params.failReasons = [...newCheckParams.failReasons];

    let checkCompareResult: any;
    let diffSnapshot: any;

    const areSnapshotsDifferent = (compareResult: any) => compareResult.rawMisMatchPercentage.toString() !== '0';
    const areSnapshotsWrongDimensions = (compareResult: any) => !compareResult.isSameDimensions && !ignoreDifferentResolutions(compareResult.dimensionDifference);

    if ((newCheckParams.status !== 'new') && (!params.failReasons.includes('not_accepted'))) {
        try {
            log.debug(`'the check with name: '${newCheckParams.name}' isn't new, make comparing'`, logOpts);
            checkCompareResult = await compareSnapshots(expectedSnapshot, actualSnapshot, { vShifting });
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);

            if (areSnapshotsDifferent(checkCompareResult) || areSnapshotsWrongDimensions(checkCompareResult)) {
                let logMsg;
                if (areSnapshotsWrongDimensions(checkCompareResult)) {
                    logMsg = 'snapshots have different dimensions';
                    params.failReasons.push('wrong_dimensions');
                }
                if (areSnapshotsDifferent(checkCompareResult)) {
                    logMsg = 'snapshots have differences';
                    params.failReasons.push('different_images');
                }

                if (logMsg) log.debug(logMsg, logOpts);
                log.debug(`saving diff snapshot for check with name: '${newCheckParams.name}'`, logOpts);
                if (!skipSaveOnCompareError) {
                    diffSnapshot = await createSnapshot({
                        name: newCheckParams.name,
                        fileData: checkCompareResult.getBuffer(),
                    });
                }
                params.diffId = diffSnapshot.id;
                params.diffSnapshot = diffSnapshot;
                params.status = 'failed';
            } else {
                params.status = 'passed';
            }

            checkCompareResult.totalCheckHandleTime = process.hrtime(executionTimer).toString();
            params.result = JSON.stringify(checkCompareResult, null, '\t');
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : e;
            params.updatedDate = Date.now();
            params.status = 'failed';
            params.result = { server_error: `error during comparing - ${errMsg}` };
            params.failReasons.push('internal_server_error');
            log.error(`error during comparing - ${errMsg}`, logOpts);
            throw e;
        }
    }

    if (params.failReasons.length > 0) {
        params.status = 'failed';
    }
    return params;
};

export interface CreateCheckParams {
    test: string;
    name: { [key: string]: string };
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
    branch?: string;
    domDump?: string;
    run: string;
    creatorId: string;
    creatorUsername: string;
    failReasons: string[];
    actualSnapshotId?: string
    result?: string
}

const createCheckParams = (checkParam: any, suite: any, app: any, test: any, currentUser: any): CreateCheckParams => ({
    test: checkParam.testId,
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
    run: test.run,
    creatorId: currentUser._id,
    creatorUsername: currentUser.username,
    failReasons: [],
});

const createCheck = async (checkParam: any, test: any, suite: any, app: any, currentUser: any, skipSaveOnCompareError = false) => {
    const logOpts: LogOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    let actualSnapshot: any;
    let currentBaselineSnapshot: any;

    const newCheckParams = createCheckParams(checkParam, suite, app, test, currentUser);
    const checkIdent = buildIdentObject(newCheckParams);

    let check: any;
    let totalCheckHandleTime: any;
    let diffSnapshot: any;

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

        const compareResult = await compare(currentBaselineSnapshot, actualSnapshot, newCheckParams, checkParam.vShifting, skipSaveOnCompareError, currentUser);

        Object.assign(newCheckParams, compareResult);

        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
        check = await Check.create(newCheckParams);
        const savedCheck = await check.save();

        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
        logOpts.ref = String(check.id);
        log.debug(`update test with check id: '${check.id}'`, logOpts);

        test.checks.push(check.id);
        test.markedAs = await calculateAcceptedStatus(check.test);
        test.updatedDate = new Date();

        await test.save();

        log.debug('update suite and run', logOpts);

        await updateItemDate('VRSSuite', check.suite);
        await updateItemDate('VRSRun', check.run);

        const lastSuccessCheck = await getLastSuccessCheck(checkIdent);

        const result: any = {
            ...savedCheck.toObject(),
            currentSnapshot: actualSnapshot,
            expectedSnapshot: currentBaselineSnapshot,
            diffSnapshot: compareResult.diffSnapshot,
            executeTime: totalCheckHandleTime,
            lastSuccess: lastSuccessCheck ? lastSuccessCheck.id : null,
        };

        if (diffSnapshot) result.diffSnapshot = diffSnapshot;
        return result;
    } catch (e) {
        if (!check) {
            newCheckParams.status = 'failed';
            newCheckParams.result = `{ "server error": "${e}" }`;
            newCheckParams.failReasons.push('internal_server_error');

            log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, logOpts);
            check = await Check.create(newCheckParams);
            await check.save();
            log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, logOpts);
            logOpts.ref = check.id;
            log.debug(`update test with check id: '${check.id}'`, logOpts);
            test.checks.push(check.id);
            await test.save();
        }
        throw e;
    }
};

const getIdent = () => ident;

const getBaselines = async (filter: any, options: any) => {
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
    // @ts-ignore
    return Baseline.paginate(filter, options);
};

export {
    startSession,
    endSession,
    createCheck,
    getIdent,
    getBaselines,
};
