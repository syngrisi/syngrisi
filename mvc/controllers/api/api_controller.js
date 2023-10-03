/* eslint-disable dot-notation,no-underscore-dangle,quotes,object-shorthand */
// eslint-disable-next-line no-unused-vars
const querystring = require('querystring');
const mongoose = require('mongoose');
const hasha = require('hasha');
const fs = require('fs').promises;
const fss = require('fs');

const { config } = require('../../../config');
const { getDiff } = require('../../../lib/comparator');
const orm = require('../../../lib/dbItems');

const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const User = mongoose.model('VRSUser');
const Baseline = mongoose.model('VRSBaseline');
const {
    checksGroupedByIdent,
    calculateAcceptedStatus,
} = require('../utils');
const {
    fatalError,
    waitUntil,
    removeEmptyProperties,
    buildIdentObject,
    ident,
} = require('../utils');
const { createItemIfNotExistAsync, createSuiteIfNotExist, createRunIfNotExist } = require('../../../lib/dbItems');

const $this = this;
$this.logMeta = {
    scope: 'api_controllers',
    msgType: 'API',
};

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
        name: name,
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

function prettyCheckParams(result) {
    if (!result.domDump) {
        return JSON.stringify(result);
    }
    const dump = JSON.parse(result.domDump);
    const resObs = { ...result };
    delete resObs.domDump;
    resObs.domDump = `${JSON.stringify(dump)
        .substr(0, 20)}... and about ${dump.length} items]`;
    return JSON.stringify(resObs);
}

async function getBaseline(params) {
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, $this, { itemType: 'baseline' });
    if (acceptedBaseline) return acceptedBaseline;
    return null;
}

async function createBaselineIfNotExist(params) {
    // find if baseline already exist
    const baseline = await getBaseline(params);
    if (baseline) return Promise.resolve(baseline);
    const identFields = buildIdentObject(params);

    const resultedBaseline = await Baseline.create(identFields);
    return resultedBaseline.save();
}

const lackOfParamsGuard = (req, res) => {
    let errMsg = null;
    if (!req.body.testid) {
        errMsg = `Cannot create check without 'testid' parameter, `
            + `try to initialize the session at first. parameters: '${JSON.stringify(req.body)}'`;
    }
    if (!req.body.hashcode) {
        errMsg = `Cannot create check without 'hashcode' parameter, parameters: '${JSON.stringify(req.body)}'`;
    }

    if (!req.body.name) {
        errMsg = `Cannot create check without check name parameter, `
            + ` parameters: '${JSON.stringify(req.body)}'`;
    }
    if (errMsg) {
        res.status(400)
            .send({
                status: 'paramNotFound',
                message: errMsg,
            });
        throw new Error(errMsg);
    }
};

// SDK
async function updateTest(params) {
    const opts = { ...params };
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'test',
        scope: 'updateTest',
    };
    opts['updatedDate'] = Date.now();
    log.debug(`update test id '${opts.id}' with params '${JSON.stringify(opts)}'`, $this, logOpts);

    const test = await Test.findByIdAndUpdate(opts.id, opts)
        .exec();

    await test.save();
    return test;
}

exports.createTest = async (req, res) => {
    const logOpts = {
        scope: 'createTest',
        user: req?.user?.username,
        itemType: 'test',
        msgType: 'CREATE',
    };

    try {
        const params = req.body;
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
            { user: req?.user?.username, itemType: 'app' }
        );
        opts.app = app._id;

        const run = await createRunIfNotExist(
            {
                name: params.run,
                ident: params.runident,
                app: app._id,
            },
            { user: req?.user?.username, itemType: 'run' }
        );
        opts.run = run._id;

        const suite = await createSuiteIfNotExist(
            {
                name: params.suite || 'Others',
                app: app._id,
                createdDate: new Date(),
            },
            { user: req?.user?.username, itemType: 'suite' },
        );

        opts.suite = suite._id;

        const test = await orm.createTest(opts);
        res.json(test);
        return [req, res, test];
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

exports.stopSession = async (req, res) => {
    const testId = req.params.testid;
    const logOpts = {
        msgType: 'END_SESSION',
        itemType: 'test',
        scope: 'stopSession',
        ref: testId,
    };
    try {
        if (!testId || testId === 'undefined') {
            fatalError(req, res, 'Cannot stop test Session testId is empty');
            return;
        }
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
        res.json(result);
    } catch (e) {
        fatalError(req, res, e);
    }
};

async function createCheck(checkParam, test, suite, app, currentUser) {
    const logOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    const executionTimer = process.hrtime();

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

    let currentSnapshot;
    let currentBaselineSnapshot;

    const fileData = checkParam.files ? checkParam.files.file.data : false;

    if (snapshotFoundedByHashcode) {
        const fullFilename = `${config.defaultBaselinePath}${snapshotFoundedByHashcode.filename}`;
        if (!fss.existsSync(fullFilename)) {
            throw new Error(`Cannot found the baseline file: '${fullFilename}'`);
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

    /** PREPARE DUMMY CHECK */
    const newCheckParams = {
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
    const check = await Check.create(newCheckParams);
    log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, $this, logOpts);
    let savedCheck = await check.save();
    log.debug(`the check with id: '${check.id}', was created, will updated with data during creating process`, $this, logOpts);

    logOpts.ref = check.id;

    log.debug('update test with check id', $this, logOpts);
    test.checks.push(check.id);
    await test.save();

    /** HANDLE BASELINE */
    const checkIdent = buildIdentObject(newCheckParams);
    log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, $this, logOpts);
    const storedBaseline = await getBaseline(newCheckParams);
    const isBaselineValid = (baseline) => {
        const keys = [
            'name', 'app', 'branch', 'browserName', 'viewport', 'os',
            'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
        ];
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
    let checkUpdateParams = {};
    checkUpdateParams.failReasons = [];
    checkUpdateParams.actualSnapshotId = currentSnapshot.id;

    // let check;
    // if last check has baseline id copy properties from last check
    // and set it as `currentBaseline` to make diff
    if (storedBaseline !== null) {
        log.debug(`a baseline for check name: '${checkParam.name}', id: '${storedBaseline.snapshootId}' is already exists`, $this, logOpts);
        if (!isBaselineValid(storedBaseline)) {
            checkUpdateParams.failReasons.push('invalid_baseline');
        }
        checkUpdateParams = updateCheckParamsFromBaseline(checkUpdateParams, storedBaseline);
        currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
    } else {
        const checksWithSameIdent = await getNotPendingChecksByIdent(checkIdent);
        if (checksWithSameIdent.length > 0) {
            log.error(`checks with ident'${JSON.stringify(checkIdent)}' exist, but baseline is absent`, $this, logOpts);
            checkUpdateParams.failReasons.push('not_accepted');
            checkUpdateParams.baselineId = currentSnapshot.id;
            currentBaselineSnapshot = currentSnapshot;
        } else {
            checkUpdateParams.baselineId = currentSnapshot.id;
            checkUpdateParams.status = 'new';
            currentBaselineSnapshot = currentSnapshot;
            log.debug(`create the new check with params: '${prettyCheckParams(checkUpdateParams)}'`, $this, logOpts);
        }
    }
    await Check.findByIdAndUpdate(check._id, checkUpdateParams);

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

    let totalCheckHandleTime;
    let compareResult;
    let diffSnapshot;
    /** compare actual with baseline if a check isn't new */
    if ((checkUpdateParams.status !== 'new') && (!checkUpdateParams.failReasons.includes('not_accepted'))) {
        try {
            log.debug(`'the check with name: '${checkParam.name}' isn't new, make comparing'`, $this, logOpts);
            compareResult = await compareSnapshots(currentBaselineSnapshot, currentSnapshot, { vShifting: checkParam.vShifting });
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(compareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(compareResult.dimensionDifference)}`);
            if (areSnapshotsDifferent(compareResult) || areSnapshotsWrongDimensions(compareResult)) {
                let logMsg;
                if (areSnapshotsWrongDimensions(compareResult)) {
                    logMsg = 'snapshots have different dimensions';
                    checkUpdateParams.failReasons.push('wrong_dimensions');
                }
                if (areSnapshotsDifferent(compareResult)) {
                    logMsg = 'snapshots have differences';
                    checkUpdateParams.failReasons.push('different_images');
                }

                log.debug(logMsg, $this, logOpts);
                log.debug(`saving diff snapshot for check with Id: '${check.id}'`, $this, logOpts);
                diffSnapshot = await createSnapshot({
                    name: checkParam.name,
                    fileData: compareResult.getBuffer(),
                });
                checkUpdateParams['diffId'] = diffSnapshot.id;
                checkUpdateParams['status'] = 'failed';
            } else {
                await createBaselineIfNotExist(check.toObject());
                checkUpdateParams['status'] = 'passed';
            }

            checkUpdateParams['updatedDate'] = Date.now();
            totalCheckHandleTime = process.hrtime(executionTimer)
                .toString();

            compareResult['totalCheckHandleTime'] = totalCheckHandleTime;
            checkUpdateParams['result'] = JSON.stringify(compareResult, null, '\t');
        } catch (e) {
            checkUpdateParams['updatedDate'] = Date.now();
            checkUpdateParams['status'] = 'failed';
            checkUpdateParams['result'] = `{ "server error": "error during comparing - ${e}" }`;
            checkUpdateParams.failReasons.push('internal_server_error');
            await Check.findByIdAndUpdate(check._id, checkUpdateParams);
            throw e;
        }
    }

    log.debug(`update check with params: '${JSON.stringify(checkUpdateParams)}'`, $this, logOpts);
    if (checkUpdateParams.failReasons.length > 0) {
        checkUpdateParams.status = 'failed';
    }
    await Check.findByIdAndUpdate(check._id, checkUpdateParams);
    savedCheck = await Check.findById(check._id);
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

    if (diffSnapshot) result['diffSnapshot'] = diffSnapshot;
    return result;
}

exports.createCheck = async (req, res) => {
    lackOfParamsGuard(req, res);
    const logOpts = {
        scope: 'createCheck',
        user: req?.user?.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    try {
        const apiKey = req.headers.apikey;
        const currentUser = await User.findOne({ apiKey: apiKey })
            .exec();

        log.info(`start create check: '${prettyCheckParams(req.body.name)}'`, $this, logOpts);

        /** look for or create test and suite */
        log.debug(`try to find test with id: '${req.body.testid}'`, $this, logOpts);
        const test = await Test.findById(req.body.testid)
            .exec();
        if (!test) {
            const errMsg = `can't find test with id: '${req.body.testid}', `
                + `parameters: '${JSON.stringify(req.body)}', username: '${currentUser.username}', apiKey: ${apiKey}`;
            res.status(400)
                .send({ status: 'testNotFound', message: errMsg });
            throw new Error(errMsg);
        }
        const app = await createItemIfNotExistAsync(
            'VRSApp',
            { name: req.body.appName || 'Unknown' },
            { user: currentUser.username, itemType: 'app' }
        );

        const suite = await createSuiteIfNotExist(
            {
                name: req.body.suitename || 'Others',
                app: app._id,
                createdDate: new Date(),
            },
            { user: req?.user?.username, itemType: 'suite' },
        );

        await orm.updateItem('VRSTest', { _id: test.id }, {
            suite: suite.id,
            creatorId: currentUser._id,
            creatorUsername: currentUser.username,
        });

        const result = await createCheck(
            {
                branch: req.body.branch,
                hashCode: req.body.hashcode,
                testId: req.body.testid,
                name: req.body.name,
                viewport: req.body.viewport,
                browserName: req.body.browserName,
                browserVersion: req.body.browserVersion,
                browserFullVersion: req.body.browserFullVersion,
                os: req.body.os,
                files: req.files,
                domDump: req.body.domdump,
                vShifting: req.body.vShifting,
            },
            test,
            suite,
            app,
            currentUser
        );
        if (result.status === 'needFiles') {
            res.status(206)
                .json({
                    status: 'requiredFileData',
                    message: 'could not find a snapshot with such a hash code, please add image file data and resend request',
                    hashCode: req.body.hashcode,
                });
            return;
        }
        res.json(result);
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getIdent = async (req, res) => {
    res.json(ident);
};

exports.checkIfScreenshotHasBaselines = async (req, res) => {
    const logOpts = {
        scope: 'checkIfScreenshotHasBaselines',
        itemType: 'baseline',
        msgType: 'GET',
    };
    try {
        log.debug(`check is baseline exist: '${JSON.stringify(req.query, null, ' ')}'`, logOpts);
        if (!req.query.imghash) {
            res.status(400)
                .json({ respStatus: 'imghash is empty' });
            return;
        }
        const app = await App.findOne({ name: req.query.app });
        const opts = removeNonIdentProperties(req.query);
        opts.app = app._id;
        const lastBaseline = await Baseline.findOne(opts)
            .sort({ updatedDate: -1 })
            .exec();
        if (!lastBaseline) {
            log.warn(`such baseline does not exists: ${JSON.stringify(opts, null, ' ')}`, logOpts);
            res.status(404)
                .json({
                    respStatus: 'baseline not found',
                    params: opts,
                });
            return;
        }
        const snapshot = await Snapshot.findOne({ _id: lastBaseline.toObject().snapshootId })
            .exec();
        const snapshotObj = snapshot.toObject();
        if (snapshotObj
            && (snapshotObj?.imghash.toString() === req.query.imghash)) {
            // console.log(snapshotObj?.imghash.toString());
            // console.log(req.query.imghash);
            res.json({ ...snapshotObj, ...{ respStatus: 'success', params: opts } });
            return;
        }
        log.warn(`such snapshot does not exists: ${JSON.stringify(req.query, null, ' ')}`, logOpts);
        res.status(404)
            .json({
                respStatus: 'snapshot not found',
                params: req.query,
            });
    } catch (e) {
        log.error(e);
        fatalError(req, res, e);
    }
};
// END OF SDK
