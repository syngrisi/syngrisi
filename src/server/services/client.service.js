/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
// const Suite = mongoose.model('VRSSuite');
const App = mongoose.model('VRSApp');
const Snapshot = mongoose.model('VRSSnapshot');
const Baseline = mongoose.model('VRSBaseline');
const fss = require('fs');
const hasha = require('hasha');
const { promises: fs } = require('fs');
const httpStatus = require('http-status');
const {
    removeEmptyProperties, waitUntil, checksGroupedByIdent, buildIdentObject, calculateAcceptedStatus, ident,
} = require('../utils/utils');
const orm = require('../../../lib/dbItems');
const { createItemIfNotExistAsync, createRunIfNotExist, createSuiteIfNotExist } = require('../../../lib/dbItems');
const { config } = require('../../../config');
const prettyCheckParams = require('../utils/prettyCheckParams');
const { getDiff } = require('../../../lib/comparator');
const ApiError = require('../utils/ApiError');

const $this = this;
$this.logMeta = {
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
    log.debug(`update test id '${opts.id}' with params '${JSON.stringify(opts)}'`, $this, logOpts);

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
    log.info(`create test with name '${params.name}', params: '${JSON.stringify(params)}'`, $this, logOpts);
    const opts = removeEmptyProperties({
        name: params.name,
        status: params.status,
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
    const checksGroup = await checksGroupedByIdent({ test: testId });
    const groupStatuses = Object.keys(checksGroup)
        .map((group) => checksGroup[group].status);
    const groupViewPorts = Object.keys(checksGroup)
        .map((group) => checksGroup[group].viewport);
    const uniqueGroupViewports = Array.from(new Set(groupViewPorts));
    let testViewport;
    if (uniqueGroupViewports.length === 1) {
        // eslint-disable-next-line prefer-destructuring
        testViewport = uniqueGroupViewports[0];
    } else {
        testViewport = uniqueGroupViewports.length;
    }

    let testStatus = 'not set';
    if (groupStatuses.some((st) => st === 'failed')) {
        testStatus = 'Failed';
    }
    if (groupStatuses.some((st) => st === 'passed')
        && !groupStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (groupStatuses.some((st) => st === 'new')
        && !groupStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (groupStatuses.some((st) => st === 'blinking')
        && !groupStatuses.some((st) => st === 'failed')) {
        testStatus = 'Passed';
    }
    if (groupStatuses.every((st) => st === 'new')) {
        testStatus = 'New';
    }
    const blinkingCount = groupStatuses.filter((g) => g === 'blinking').length;
    const testParams = {
        id: testId,
        status: testStatus,
        blinking: blinkingCount,
        calculatedViewport: testViewport,
    };
    log.info(`the session is over, the test will be updated with parameters: '${JSON.stringify(testParams)}'`, $this, logOpts);
    const updatedTest = await updateTest(testParams);
    const result = updatedTest.toObject();
    result.calculatedStatus = testStatus;
    return result;
};

async function getBaseline(params) {
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, $this, { itemType: 'baseline' });
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
    const path = `${config.defaultBaselinePath}${filename}`;
    log.debug(`save screenshot for: '${name}' snapshot to: '${path}'`, $this, logOpts);
    await fs.writeFile(path, fileData);
    snapshot.filename = filename;
    await snapshot.save();
    log.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, $this, { ...logOpts, ...{ ref: snapshot._id } });
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
        log.debug(`compare baseline and actual snapshots with ids: [${baselineSnapshot.id}, ${actual.id}]`, $this, logOpts);
        log.debug(`current baseline snapshot: ${JSON.stringify(baselineSnapshot)}`, $this, logOpts);
        let diff;
        if (baselineSnapshot.imghash === actual.imghash) {
            log.debug(`baseline and actual snapshot have the identical image hashes: '${baselineSnapshot.imghash}'`, $this, logOpts);
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
            const baselinePath = `${config.defaultBaselinePath}${baselineSnapshot.filename}`;
            const actualPath = `${config.defaultBaselinePath}${actual.filename}`;
            const baselineData = await fs.readFile(baselinePath);
            const actualData = await fs.readFile(actualPath);
            log.debug(`baseline path: ${baselinePath}`, $this, logOpts);
            log.debug(`actual path: ${actualPath}`, $this, logOpts);
            const options = opts;
            const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id })
                .exec();

            if (baseline.ignoreRegions) {
                log.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
                options.ignoredBoxes = JSON.parse(baseline.ignoreRegions);
            }
            options.ignore = baseline.matchType || 'nothing';
            diff = await getDiff(baselineData, actualData, options);
        }

        log.silly(`the diff is: '${JSON.stringify(diff, null, 2)}'`);
        if (diff.rawMisMatchPercentage.toString() !== '0') {
            log.debug(`images are different, ids: [${baselineSnapshot.id}, ${actual.id}], rawMisMatchPercentage: '${diff.rawMisMatchPercentage}'`);
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
        const errMsg = `cannot compare snapshots: ${e}\n ${e?.stack}`;
        log.error(errMsg, $this, logOpts);
        throw new Error(e);
    }
}

async function createBaselineIfNotExist(params) {
    // find if baseline already exist
    const baseline = await getBaseline(params);
    if (baseline) return Promise.resolve(baseline);
    const identFields = buildIdentObject(params);

    const resultedBaseline = await Baseline.create(identFields);
    return resultedBaseline.save();
}

const isBaselineValid = (baseline, logOpts) => {
    const keys = [
        'name', 'app', 'branch', 'browserName', 'viewport', 'os',
        'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
        if (!baseline[key]) {
            log.error(`invalid baseline, the '${key}' property is empty`, $this, logOpts);
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

const createCheck = async (checkParam, test, suite, app, currentUser) => {
    const logOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    let currentSnapshot;
    let currentBaselineSnapshot;
    /** PREPARE DUMMY CHECK */
    let newCheckParams = {
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
    };
    const checkIdent = buildIdentObject(newCheckParams);

    let check;
    let totalCheckHandleTime;
    let checkCompareResult;
    let diffSnapshot;

    const executionTimer = process.hrtime();

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
         *   3. The server makes the comparison and returns to the check  response the the client
         *   with one of 'complete` status (eq: new, failed, passed)
         */

        /** PREPARE ACTUAL SNAPSHOT */
        /** look up the snapshot with same hashcode if didn't find, ask for file data */
        const snapshotFoundedByHashcode = await getSnapshotByImgHash(checkParam.hashCode);
        if (!checkParam.hashCode && !checkParam.files) {
            log.debug('hashCode or files parameters should be present', $this, logOpts);
            return { status: 'needFiles' };
        }

        if (!checkParam.files && !snapshotFoundedByHashcode) {
            log.debug(`cannot find the snapshot with hash: '${checkParam.hashCode}'`, $this, logOpts);
            return { status: 'needFiles' };
        }

        const fileData = checkParam.files ? checkParam.files.file.data : false;

        if (snapshotFoundedByHashcode) {
            const fullFilename = `${config.defaultBaselinePath}${snapshotFoundedByHashcode.filename}`;
            if (!fss.existsSync(fullFilename)) {
                throw new Error(`Couldn't find the baseline file: '${fullFilename}'`);
            }

            log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, $this, logOpts);
            currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
        } else {
            log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, $this, logOpts);
            currentSnapshot = await createSnapshot({
                name: checkParam.name,
                fileData,
                hashCode: checkParam.hashCode,
            });
        }

        /** HANDLE BASELINE */
        log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, $this, logOpts);
        const storedBaseline = await getBaseline(checkIdent);

        // let checkUpdateParams = {};
        newCheckParams.failReasons = [];
        newCheckParams.actualSnapshotId = currentSnapshot.id;

        // let check;
        // if last check has baseline id copy properties from last check
        // and set it as `currentBaseline` to make diff
        if (storedBaseline !== null) {
            log.debug(`a baseline for check name: '${checkParam.name}', id: '${storedBaseline.snapshootId}' is already exists`, $this, logOpts);
            if (!isBaselineValid(storedBaseline, logOpts)) {
                newCheckParams.failReasons.push('invalid_baseline');
            }
            newCheckParams = updateCheckParamsFromBaseline(newCheckParams, storedBaseline);
            currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
        } else {
            const checksWithSameIdent = await getNotPendingChecksByIdent(checkIdent);
            if (checksWithSameIdent.length > 0) {
                log.error(`checks with ident'${JSON.stringify(checkIdent)}' exist, but baseline is absent`, $this, logOpts);
                newCheckParams.failReasons.push('not_accepted');
                newCheckParams.baselineId = currentSnapshot.id;
                currentBaselineSnapshot = currentSnapshot;
            } else {
                newCheckParams.baselineId = currentSnapshot.id;
                newCheckParams.status = 'new';
                currentBaselineSnapshot = currentSnapshot;
                log.debug(`create the new check with params: '${prettyCheckParams(newCheckParams)}'`, $this, logOpts);
            }
        }
        // await Check.findByIdAndUpdate(check._id, checkUpdateParams);

        /** COMPARING SECTION */

        /* check if we can ignore 1 px dimensions difference from the bottom */
        const ignoreDifferentResolutions = ({ height, width }) => {
            if ((width === 0) && (height === -1)) return true;
            if ((width === 0) && (height === 1)) return true;
            return false;
        };
        const areSnapshotsDifferent = (compareResult) => compareResult.rawMisMatchPercentage.toString() !== '0';
        const areSnapshotsWrongDimensions = (compareResult) => !compareResult.isSameDimensions
            && !ignoreDifferentResolutions(compareResult.dimensionDifference);

        /** compare actual with baseline if a check isn't new */
        if ((newCheckParams.status !== 'new') && (!newCheckParams.failReasons.includes('not_accepted'))) {
            try {
                log.debug(`'the check with name: '${checkParam.name}' isn't new, make comparing'`, $this, logOpts);
                checkCompareResult = await compareSnapshots(currentBaselineSnapshot, currentSnapshot, { vShifting: checkParam.vShifting });
                log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(checkCompareResult.dimensionDifference)}'`);
                log.silly(`dimensionDifference: '${JSON.stringify(checkCompareResult.dimensionDifference)}`);
                if (areSnapshotsDifferent(checkCompareResult) || areSnapshotsWrongDimensions(checkCompareResult)) {
                    let logMsg;
                    if (areSnapshotsWrongDimensions(checkCompareResult)) {
                        logMsg = 'snapshots have different dimensions';
                        newCheckParams.failReasons.push('wrong_dimensions');
                    }
                    if (areSnapshotsDifferent(checkCompareResult)) {
                        logMsg = 'snapshots have differences';
                        newCheckParams.failReasons.push('different_images');
                    }

                    log.debug(logMsg, $this, logOpts);
                    log.debug(`saving diff snapshot for check with name: '${newCheckParams.name}'`, $this, logOpts);
                    diffSnapshot = await createSnapshot({
                        name: checkParam.name,
                        fileData: checkCompareResult.getBuffer(),
                    });
                    newCheckParams.diffId = diffSnapshot.id;
                    newCheckParams.status = 'failed';
                } else {
                    await createBaselineIfNotExist(newCheckParams);
                    newCheckParams.status = 'passed';
                }

                newCheckParams.updatedDate = Date.now();
                totalCheckHandleTime = process.hrtime(executionTimer)
                    .toString();

                checkCompareResult.totalCheckHandleTime = totalCheckHandleTime;
                newCheckParams.result = JSON.stringify(checkCompareResult, null, '\t');
            } catch (e) {
                newCheckParams.updatedDate = Date.now();
                newCheckParams.status = 'failed';
                newCheckParams.result = `{ "server error": "error during comparing - ${e}" }`;
                newCheckParams.failReasons.push('internal_server_error');
                throw e;
            }
        }

        if (newCheckParams.failReasons.length > 0) {
            newCheckParams.status = 'failed';
        }
        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, $this, logOpts);
        check = await Check.create(newCheckParams);
        await check.save();
        log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, $this, logOpts);
        logOpts.ref = check.id;
        log.debug(`update test with check id: '${check.id}'`, $this, logOpts);
        test.checks.push(check.id);
        await test.save();
        const savedCheck = await Check.findById(check._id); // !!! const savedCheck =  await test.save();
        // update test and suite
        test.markedAs = await calculateAcceptedStatus(check.test);
        test.updatedDate = new Date();
        log.debug('update suite', $this, logOpts);
        await orm.updateItemDate('VRSSuite', check.suite);
        await test.save();

        const lastSuccessCheck = await getLastSuccessCheck(checkIdent);

        const result = {
            ...savedCheck.toObject(),
            currentSnapshot,
            executeTime: totalCheckHandleTime,
            lastSuccess: lastSuccessCheck ? (lastSuccessCheck).id : null,
        };

        if (diffSnapshot) result.diffSnapshot = diffSnapshot;
        return result;
    } catch (e) {
        // Emergency check creation and test update
        if (!check) {
            log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, $this, logOpts);
            check = await Check.create(newCheckParams);
            await check.save();
            log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, $this, logOpts);
            logOpts.ref = check.id;
            log.debug(`update test with check id: '${check.id}'`, $this, logOpts);
            test.checks.push(check.id);
            await test.save();
        }
        throw e;
    }
};

const getIdent = () => ident;

function removeNonIdentProperties(params) {
    const opts = { ...params };
    // eslint-disable-next-line no-restricted-syntax
    for (const prop of Object.keys(opts)) {
        if (!(ident.includes(prop.toString()))) {
            delete opts[prop];
        }
    }
    return opts;
}

const checkIfScreenshotHasBaselines = async (query) => {
    const logOpts = {
        scope: 'checkIfScreenshotHasBaselines',
        itemType: 'baseline',
        msgType: 'GET',
    };
    log.debug(`check is baseline exist: '${JSON.stringify(query, null, ' ')}'`, logOpts);
    if (!query.imghash) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'imghash is empty');
    }
    const app = await App.findOne({ name: query.app });
    const opts = removeNonIdentProperties(query);
    opts.app = app._id;
    const lastBaseline = await Baseline.findOne(opts)
        .sort({ updatedDate: -1 })
        .exec();
    if (!lastBaseline) {
        log.warn(`such baseline does not exists: ${JSON.stringify(opts, null, ' ')}`, logOpts);
        throw new ApiError(httpStatus.NOT_FOUND, `snapshot not found, params: ${JSON.stringify(query)}`);
    }
    const snapshot = await Snapshot.findOne({ _id: lastBaseline.toObject().snapshootId })
        .exec();
    const snapshotObj = snapshot.toObject();
    if (snapshotObj
        && (snapshotObj?.imghash.toString() === query.imghash)) {
        // console.log(snapshotObj?.imghash.toString());
        // console.log(query.imghash);
        return { ...snapshotObj, ...{ respStatus: 'success', params: opts } };
    }
    log.warn(`such snapshot does not exists: ${JSON.stringify(query, null, ' ')}`, logOpts);
    throw new ApiError(httpStatus.NOT_FOUND, `snapshot not found, params: ${JSON.stringify(query)}`);
};

module.exports = {
    startSession,
    endSession,
    createCheck,
    getIdent,
    checkIfScreenshotHasBaselines,
};
