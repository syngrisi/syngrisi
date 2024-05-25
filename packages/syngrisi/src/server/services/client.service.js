/* eslint-disable valid-jsdoc */
const fss = require('fs');
const hasha = require('hasha');
const { promises: fs } = require('fs');
// const httpStatus = require('http-status');
const {
    Snapshot,
    Check,
    Test,
    App,
    Baseline,
} = require('../models');
const {
    removeEmptyProperties, waitUntil, buildIdentObject, calculateAcceptedStatus, ident,
} = require('../utils/utils');
const orm = require('../lib/dbItems');
const { createItemIfNotExistAsync, createRunIfNotExist, createSuiteIfNotExist } = require('../lib/dbItems');
const { config } = require('../../../config');
const prettyCheckParams = require('../utils/prettyCheckParams');
const { getDiff } = require('../lib/comparator');
// const ApiError = require('../utils/ApiError');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
    scope: 'client_service',
    msgType: 'CLIENT_REQUEST',
};

async function updateTest(params) {
    const opts = { ...params };
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'test',
        scope: 'updateTest',
    };
    opts.updatedDate = Date.now();
    log2.debug(`update test id '${opts.id}' with params '${JSON.stringify(opts)}'`, fileLogMeta, logOpts);

    const test = await Test.findByIdAndUpdate(opts.id, opts)
        .exec();

    await test.save();
    return test;
}

const startSession = async (params, username) => {
    const logOpts = {
        scope: 'createTest',
        user: username,
        itemType: 'test',
        msgType: 'CREATE',
    };
    // CREATE TESTS
    log2.info(`create test with name '${params.name}', params: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);
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
            {
                name: params.app,
            },
            { user: username, itemType: 'app' }
        );
        opts.app = app._id;

        const run = await createRunIfNotExist(
            {
                name: params.run,
                ident: params.runident,
                app: app._id,
            },
            { user: username, itemType: 'run' }
        );
        opts.run = run._id;

        const suite = await createSuiteIfNotExist(
            {
                name: params.suite || 'Others',
                app: app._id,
                createdDate: new Date(),
            },
            { user: username, itemType: 'suite' },
        );

        opts.suite = suite._id;

        const test = await orm.createTest(opts);
        return test;
    } catch (e) {
        log2.error(`cannot start session '${params.i}', params: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);
        throw e;
    }
};

const endSession = async (testId, username) => {
    const logOpts = {
        msgType: 'END_SESSION',
        user: username,
        itemType: 'test',
        scope: 'stopSession',
        ref: testId,
    };
    await waitUntil(async () => (await Check.find({ test: testId })
        .exec())
        .filter((ch) => ch.status.toString() !== 'pending').length > 0);
    const sessionChecks = await Check.find({ test: testId }).lean().exec();
    const checksStatuses = sessionChecks.map((x) => x.status[0]);
    const checksViewports = sessionChecks.map((x) => x.viewport);

    const uniqueChecksViewports = Array.from(new Set(checksViewports));
    let testViewport;
    if (uniqueChecksViewports.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        testViewport = uniqueChecksViewports[0];
    } else {
        testViewport = uniqueChecksViewports.length;
    }

    let testStatus = 'not set';
    if (checksStatuses.some((st) => st === 'failed')) {
        testStatus = 'Failed';
    }
    if (checksStatuses.some((st) => st === 'passed')
        && !checksStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'new')
        && !checksStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (checksStatuses.some((st) => st === 'blinking')
        && !checksStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (checksStatuses.every((st) => st === 'new')) {
        testStatus = 'New';
    }
    const blinkingCount = checksStatuses.filter((g) => g === 'blinking').length;
    const testParams = {
        id: testId,
        status: testStatus,
        blinking: blinkingCount,
        calculatedViewport: testViewport,
    };
    log2.info(`the session is over, the test will be updated with parameters: '${JSON.stringify(testParams)}'`, fileLogMeta, logOpts);
    const updatedTest = await updateTest(testParams);
    const result = updatedTest.toObject();
    result.calculatedStatus = testStatus;
    return result;
};

async function getBaseline(params) {
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log2.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, fileLogMeta, { itemType: 'baseline' });
    if (acceptedBaseline) return acceptedBaseline;
    return null;
}

async function getLastSuccessCheck(identifier) {
    const condition = [{
        ...identifier,
        status: 'new',
    }, {
        ...identifier,
        status: 'passed',
    }];
    return (await Check.find({
        $or: condition,
    })
        .sort({ updatedDate: -1 })
        .limit(1))[0];
}

async function getNotPendingChecksByIdent(identifier) {
    return Check.find({
        ...identifier,
        status: {
            $ne: 'pending',
        },
    })
        .sort({ updatedDate: -1 })
        .exec();
}

async function getSnapshotByImgHash(hash) {
    return Snapshot.findOne({ imghash: hash })
        .exec();
}

async function createSnapshot(parameters) {
    const {
        name,
        fileData,
        hashCode,
    } = parameters;

    const opts = {
        name,
    };
    const logOpts = {
        scope: 'createSnapshot',
        itemType: 'snapshot',
    };
    if (!fileData) throw new Error(`cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);

    opts.imghash = hashCode || hasha(fileData);
    const snapshot = new Snapshot(opts);
    const filename = `${snapshot.id}.png`;
    const path = `${config.defaultImagesPath}${filename}`;
    log2.debug(`save screenshot for: '${name}' snapshot to: '${path}'`, fileLogMeta, logOpts);
    await fs.writeFile(path, fileData);
    snapshot.filename = filename;
    await snapshot.save();
    log2.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, fileLogMeta, { ...logOpts, ...{ ref: snapshot._id } });
    return snapshot;
}

async function cloneSnapshot(sourceSnapshot, name) {
    const { filename } = sourceSnapshot;
    const hashCode = sourceSnapshot.imghash;
    const newSnapshot = new Snapshot({
        name,
        filename,
        imghash: hashCode,
    });
    await newSnapshot.save();
    return newSnapshot;
}

async function compareSnapshots(baselineSnapshot, actual, opts = {}) {
    const logOpts = {
        scope: 'compareSnapshots',
        ref: baselineSnapshot.id,
        itemType: 'snapshot',
        msgType: 'COMPARE',
    };
    try {
        log2.debug(`compare baseline and actual snapshots with ids: [${baselineSnapshot.id}, ${actual.id}]`, fileLogMeta, logOpts);
        log2.debug(`current baseline snapshot: ${JSON.stringify(baselineSnapshot)}`, fileLogMeta, logOpts);
        let diff;
        if (baselineSnapshot.imghash === actual.imghash) {
            log2.debug(`baseline and actual snapshot have the identical image hashes: '${baselineSnapshot.imghash}'`, fileLogMeta, logOpts);
            // stub for diff object
            diff = {
                isSameDimensions: true,
                dimensionDifference: {
                    width: 0,
                    height: 0,
                },
                rawMisMatchPercentage: 0,
                misMatchPercentage: '0.00',
                analysisTime: 0,
                executionTotalTime: '0',
            };
        } else {
            const baselinePath = `${config.defaultImagesPath}${baselineSnapshot.filename}`;
            const actualPath = `${config.defaultImagesPath}${actual.filename}`;
            const baselineData = await fs.readFile(baselinePath);
            const actualData = await fs.readFile(actualPath);
            log2.debug(`baseline path: ${baselinePath}`, fileLogMeta, logOpts);
            log2.debug(`actual path: ${actualPath}`, fileLogMeta, logOpts);
            const options = opts;
            const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id })
                .exec();

            if (baseline.ignoreRegions) {
                log2.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
                options.ignoredBoxes = JSON.parse(baseline.ignoreRegions);
            }
            options.ignore = baseline.matchType || 'nothing';
            diff = await getDiff(baselineData, actualData, options);
        }

        log2.silly(`the diff is: '${JSON.stringify(diff, null, 2)}'`);
        if (diff.rawMisMatchPercentage.toString() !== '0') {
            log2.debug(`images are different, ids: [${baselineSnapshot.id}, ${actual.id}], rawMisMatchPercentage: '${diff.rawMisMatchPercentage}'`);
        }
        if (diff.stabMethod && diff.vOffset) {
            if (diff.stabMethod === 'downup') {
                // this mean that we delete first 'diff.vOffset' line of pixels from actual
                // then we will use this during parse actual page DOM dump
                actual.vOffset = -diff.vOffset;
                await actual.save();
            }
            if (diff.stabMethod === 'updown') {
                // this mean that we delete first 'diff.vOffset' line of pixels from baseline
                // then we will use this during parse actual page DOM dump
                baselineSnapshot.vOffset = -diff.vOffset;
                await baselineSnapshot.save();
            }
        }
        return diff;
    } catch (e) {
        const errMsg = `cannot compare snapshots: ${e}\n ${e.stack || e.toString()}`;
        log2.error(errMsg, fileLogMeta, logOpts);
        throw new Error(e);
    }
}

const isBaselineValid = (baseline, logOpts) => {
    const keys = [
        'name', 'app', 'branch', 'browserName', 'viewport', 'os',
        'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
        if (!baseline[key]) {
            log2.error(`invalid baseline, the '${key}' property is empty`, fileLogMeta, logOpts);
            return false;
        }
    }
    return true;
};

// copy marked* properties from baseline and baseline.snapshotId
const updateCheckParamsFromBaseline = (params, baseline) => {
    const updatedParams = { ...params };
    updatedParams.baselineId = baseline.snapshootId;
    updatedParams.markedAs = baseline.markedAs;
    updatedParams.markedDate = baseline.lastMarkedDate;
    updatedParams.markedByUsername = baseline.markedByUsername;
    return updatedParams;
};

const prepareActualSnapshot = async (checkParam, snapshotFoundedByHashcode, logOpts) => {
    let currentSnapshot;

    const fileData = checkParam.files ? checkParam.files.file.data : false;

    if (snapshotFoundedByHashcode) {
        const fullFilename = `${config.defaultImagesPath}${snapshotFoundedByHashcode.filename}`;
        if (!fss.existsSync(fullFilename)) {
            throw new Error(`Couldn't find the baseline file: '${fullFilename}'`);
        }

        log2.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, fileLogMeta, logOpts);
        currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
    } else {
        log2.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, fileLogMeta, logOpts);
        currentSnapshot = await createSnapshot({
            name: checkParam.name,
            fileData,
            hashCode: checkParam.hashCode,
        });
    }

    return currentSnapshot;
};

async function isNeedFiles(checkParam, logOpts) {
    const snapshotFoundedByHashcode = await getSnapshotByImgHash(checkParam.hashCode);

    if (!checkParam.hashCode && !checkParam.files) {
        log2.debug('hashCode or files parameters should be present', fileLogMeta, logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }

    if (!checkParam.files && !snapshotFoundedByHashcode) {
        log2.debug(`cannot find the snapshot with hash: '${checkParam.hashCode}'`, fileLogMeta, logOpts);
        return { needFilesStatus: true, snapshotFoundedByHashcode };
    }
    return { needFilesStatus: false, snapshotFoundedByHashcode };
}

async function inspectBaseline(newCheckParams, storedBaseline, checkIdent, currentSnapshot, logOpts) {
    // check if baseline exist, if this true set some check properties
    // if false set 'not_accepted' of "new" status
    let currentBaselineSnapshot = null;
    const params = {};
    params.failReasons = [];
    if (storedBaseline !== null) {
        log2.debug(`a baseline for check name: '${newCheckParams.name}', id: '${storedBaseline.snapshootId}' is already exists`, fileLogMeta, logOpts);
        if (!isBaselineValid(storedBaseline, logOpts)) {
            newCheckParams.failReasons.push('invalid_baseline');
        }
        Object.assign(params, updateCheckParamsFromBaseline(newCheckParams, storedBaseline));
        currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
    } else {
        const checksWithSameIdent = await getNotPendingChecksByIdent(checkIdent);
        if (checksWithSameIdent.length > 0) {
            log2.error(`checks with ident'${JSON.stringify(checkIdent)}' exist, but baseline is absent`, fileLogMeta, logOpts);
            params.failReasons.push('not_accepted');
            params.baselineId = currentSnapshot.id;
            currentBaselineSnapshot = currentSnapshot;
        } else {
            params.baselineId = currentSnapshot.id;
            params.status = 'new';
            currentBaselineSnapshot = currentSnapshot;
            log2.debug(`create the new check with params: '${prettyCheckParams(params)}'`, fileLogMeta, logOpts);
        }
    }
    return { inspectBaselineParams: params, currentBaselineSnapshot };
}

/* check if we can ignore 1 px dimensions difference from the bottom */
const ignoreDifferentResolutions = ({ height, width }) => {
    if ((width === 0) && (height === -1)) return true;
    if ((width === 0) && (height === 1)) return true;
    return false;
};

// checkParam.vShifting
const compare = async (expectedSnapshot, actualSnapshot, newCheckParams, vShifting, skipSaveOnCompareError, currentUser) => {
    const logOpts = {
        scope: 'createCheck.compare',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'COMPARE',
    };

    const executionTimer = process.hrtime();
    const params = {};
    params.failReasons = [...newCheckParams.failReasons];

    let checkCompareResult;
    let diffSnapshot;

    const areSnapshotsDifferent = (compareResult) => compareResult.rawMisMatchPercentage.toString() !== '0';
    const areSnapshotsWrongDimensions = (compareResult) => !compareResult.isSameDimensions
        && !ignoreDifferentResolutions(compareResult.dimensionDifference);

    /** compare actual with baseline if a check isn't new */
    if ((newCheckParams.status !== 'new') && (!params.failReasons.includes('not_accepted'))) {
        try {
            log2.debug(`'the check with name: '${newCheckParams.name}' isn't new, make comparing'`, fileLogMeta, logOpts);
            checkCompareResult = await compareSnapshots(expectedSnapshot, actualSnapshot, { vShifting });
            log2.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
            log2.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);

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

                log2.debug(logMsg, fileLogMeta, logOpts);
                log2.debug(`saving diff snapshot for check with name: '${newCheckParams.name}'`, fileLogMeta, logOpts);
                if (!skipSaveOnCompareError) {
                    diffSnapshot = await createSnapshot({ // reduce duplications!!!
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

            checkCompareResult.totalCheckHandleTime = process.hrtime(executionTimer)
                .toString();
            params.result = JSON.stringify(checkCompareResult, null, '\t');
        } catch (e) {
            params.updatedDate = Date.now();
            params.status = 'failed';
            params.result = { server_error: `error during comparing - ${e.stack || e.toString()}` };
            params.failReasons.push('internal_server_error');
            log2.error(`error during comparing - ${e.stack || e.toString()}`, fileLogMeta, logOpts);
            throw e;
        }
    }

    if (params.failReasons.length > 0) {
        params.status = 'failed';
    }
    return params;
};

const createCheckParams = (checkParam, suite, app, test, currentUser) => ({
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

const createCheck = async (checkParam, test, suite, app, currentUser, skipSaveOnCompareError = false) => {
    const logOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    let actualSnapshot;
    let currentBaselineSnapshot;

    const newCheckParams = createCheckParams(checkParam, suite, app, test, currentUser);
    const checkIdent = buildIdentObject(newCheckParams);

    let check;
    let totalCheckHandleTime;
    let diffSnapshot;

    try {
        /**
         * Usually there are two stages of checking the creating Check request:
         * Phase 1
         *   1. Client sends request with 'req.body.hashcode' value but without 'req.files.file.data'
         *   2. The server finds for a snapshot with this image 'hashcode' and if found - go to Step 3 of Phase2,
         *      if not - sends response "{status: 'requiredFileData', message: 'cannot found an image
         *      with this hashcode, please add image file data and resend request'}"
         * Phase 2
         *   1. The client receives a response with incomplete status and resends the same request but,
         *   with 'req.files.file.data' parameter
         *   2. The server creates a new snapshot based on these parameters
         *   3. The server makes the comparison and returns to the client some check response
         *   with one of 'complete` status (eq: new, failed, passed)
         */

        /** PREPARE ACTUAL SNAPSHOT */
        /** look up the snapshot with same hashcode if didn't find, ask for file data */
        const { needFilesStatus, snapshotFoundedByHashcode } = await isNeedFiles(checkParam, logOpts);
        if (needFilesStatus) return { status: 'needFiles' };

        actualSnapshot = await prepareActualSnapshot(checkParam, snapshotFoundedByHashcode, logOpts);
        newCheckParams.actualSnapshotId = actualSnapshot.id;

        /** HANDLE BASELINE */
        log2.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, fileLogMeta, logOpts);
        const storedBaseline = await getBaseline(checkIdent);

        const inspectBaselineResult = await inspectBaseline(newCheckParams, storedBaseline, checkIdent, actualSnapshot, logOpts);
        Object.assign(newCheckParams, inspectBaselineResult.inspectBaselineParams);
        currentBaselineSnapshot = inspectBaselineResult.currentBaselineSnapshot;

        /** COMPARING SECTION */
        const compareResult = await compare(
            currentBaselineSnapshot,
            actualSnapshot,
            newCheckParams,
            checkParam.vShifting,
            skipSaveOnCompareError,
            currentUser,
        );

        Object.assign(newCheckParams, compareResult);

        log2.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, fileLogMeta, logOpts);
        check = await Check.create(newCheckParams);
        const savedCheck = await check.save();

        log2.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, fileLogMeta, logOpts);
        logOpts.ref = check.id;
        log2.debug(`update test with check id: '${check.id}'`, fileLogMeta, logOpts);

        test.checks.push(check.id);
        test.markedAs = await calculateAcceptedStatus(check.test);
        test.updatedDate = new Date();

        await test.save();

        // update test and suite
        log2.debug('update suite and run', fileLogMeta, logOpts);

        await orm.updateItemDate('VRSSuite', check.suite);
        await orm.updateItemDate('VRSRun', check.run);

        const lastSuccessCheck = await getLastSuccessCheck(checkIdent); // we need this?

        const result = {
            ...savedCheck.toObject(),
            currentSnapshot: actualSnapshot,
            expectedSnapshot: currentBaselineSnapshot,
            diffSnapshot: compareResult.diffSnapshot,
            executeTime: totalCheckHandleTime,
            lastSuccess: lastSuccessCheck ? (lastSuccessCheck).id : null,
        };

        if (diffSnapshot) result.diffSnapshot = diffSnapshot;
        return result;
    } catch (e) {
        // emergency check creation and test update
        if (!check) {
            newCheckParams.status = 'failed';
            newCheckParams.result = `{ "server error": "${e}" }`;
            newCheckParams.failReasons.push('internal_server_error');

            log2.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, fileLogMeta, logOpts);
            check = await Check.create(newCheckParams);
            await check.save();
            log2.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, fileLogMeta, logOpts);
            logOpts.ref = check.id;
            log2.debug(`update test with check id: '${check.id}'`, fileLogMeta, logOpts);
            test.checks.push(check.id);
            await test.save();
        }
        throw e;
    }
};

const getIdent = () => ident;

const getBaselines = async (filter, options) => {
    const logOpts = {
        scope: 'getBaselines',
        itemType: 'baseline',
        msgType: 'GET',
    };
    const app = await App.findOne({ name: filter.app });
    if (!app) {
        log2.error(`Cannot find the app: '${filter.app}'`, fileLogMeta, logOpts);
        return {};
    }
    filter.app = app._id;
    log2.debug(`Get baselines with filter: '${JSON.stringify(filter)}', options: '${JSON.stringify(options)}'`, fileLogMeta, logOpts);
    return Baseline.paginate(filter, options);
};

module.exports = {
    startSession,
    endSession,
    createCheck,
    getIdent,
    // checkIfScreenshotHasBaselines,
    getBaselines,
};
