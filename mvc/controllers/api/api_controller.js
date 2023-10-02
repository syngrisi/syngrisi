/* eslint-disable dot-notation,no-underscore-dangle,quotes,object-shorthand */
// eslint-disable-next-line no-unused-vars
const querystring = require('querystring');
const mongoose = require('mongoose');
const hasha = require('hasha');
const fs = require('fs').promises;
const fss = require('fs');
const stringTable = require('string-table');
const {
    format,
    subDays,
} = require('date-fns');
const { config } = require('../../../config');
const { getDiff } = require('../../../lib/comparator');
const orm = require('../../../lib/dbItems');
// const { parseDiff } = require('../../../lib/parseDiff');
const { getAllElementsByPositionFromDump } = require('../../../lib/getElementsByPixPositionsFromDump');
const testUtil = require('./utils/tests');
const checkUtil = require('./utils/check');

const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Run = mongoose.model('VRSRun');
const Log = mongoose.model('VRSLog');
const App = mongoose.model('VRSApp');
const Suite = mongoose.model('VRSSuite');
const User = mongoose.model('VRSUser');
const Baseline = mongoose.model('VRSBaseline');
const {
    checksGroupedByIdent,
    calculateAcceptedStatus,
    ProgressBar,
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

// snapshots
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

exports.getSnapshot = async (req, res) => {
    try {
        res.json(await Snapshot.findById(req.params.id));
    } catch (e) {
        log.error(`cannot get a snapshot with id: '${req.params.id}', error: ${e}`,
            $this,
            {
                scope: 'getSnapshot',
                msgType: 'GET',
            });
        fatalError(req, res, e);
    }
};

function parseSorting(params) {
    return Object.keys(params)
        .filter((key) => key.startsWith('sort_'))
        .reduce((obj, key) => {
            const props = key.split('_');
            const sortBy = props[1];
            obj[sortBy] = parseInt(props[2], 10);
            return obj;
        }, {});
}

// users
function getApiKey() {
    const uuidAPIKey = require('uuid-apikey');

    return uuidAPIKey.create().apiKey;
}

exports.generateApiKey = async (req, res) => {
    const apiKey = getApiKey();
    log.debug(`generate API Key for user: '${req.user.username}'`, $this, { user: req.user.username });
    const hash = hasha(apiKey);
    const user = await User.findOne({ username: req.user.username });
    user.apiKey = hash;
    await user.save();
    res.status(200)
        .json({ apikey: apiKey });
};

exports.getUsers = async (req, res) => {
    const users = await User.find()
        .exec();
    res.status(200)
        .json(users);
    return users;
};

// tests
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

// checks
// move to v1
exports.updateCheck = async (req, res) => {
    const opts = removeEmptyProperties(req.body);
    const { id } = req.params;
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'check',
        ref: id,
        user: req?.user?.username,
        scope: 'updateCheck',
    };
    try {
        log.debug(`update check with id '${id}' with params '${JSON.stringify(opts, null, 2)}'`,
            $this, logOpts);

        const check = await Check.findOneAndUpdate({ _id: id }, opts, { new: true })
            .exec();
        const test = await Test.findOne({ _id: check.test })
            .exec();

        test.status = await testUtil.calculateTestStatus(check.test);

        await orm.updateItemDate('VRSCheck', check);
        await orm.updateItemDate('VRSTest', test);
        await test.save();
        await check.save();
        res.status(200)
            .json({
                message: `Check with id: '${id}' was updated`,
                check: check.toObject(),
            });
        return check;
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

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

const validateBaselineParam = (params) => {
    const mandatoryParams = ['markedAs', 'markedById', 'markedByUsername', 'markedDate'];
    for (const param of mandatoryParams) {
        if (!param) {
            const errMsg = `invalid baseline parameters, '${param}' is empty, params: ${JSON.stringify(params)}`;
            log.error(errMsg);
            throw new Error(errMsg);
        }
    }
};

async function createNewBaseline(params) {
    validateBaselineParam(params);

    const identFields = buildIdentObject(params);

    const lastBaseline = await Baseline.findOne(identFields)
        .exec();

    const sameBaseline = await Baseline.findOne({ ...identFields, ...{ snapshootId: params.actualSnapshotId } })
        .exec();

    const baselineParams = lastBaseline?.ignoreRegions
        ? { ...identFields, ...{ ignoreRegions: lastBaseline.ignoreRegions } }
        : identFields;

    if (sameBaseline) {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} already exist`, $this);
    } else {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} does not exist,
         create new one, baselineParams: ${JSON.stringify(baselineParams)}`, $this);
    }

    log.silly({ sameBaseline });

    const resultedBaseline = sameBaseline || await Baseline.create(baselineParams);

    resultedBaseline.markedAs = params.markedAs;
    resultedBaseline.markedById = params.markedById;
    resultedBaseline.markedByUsername = params.markedByUsername;
    resultedBaseline.lastMarkedDate = params.markedDate;
    resultedBaseline.createdDate = new Date();
    resultedBaseline.snapshootId = params.actualSnapshotId;

    return resultedBaseline.save();
}

module.exports.createNewBaseline = createNewBaseline;

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

async function createCheck(
    checkParam,
    test,
    suite,
    app,
    currentUser
) {
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

function removeNonIdentProperties(params) {
    const opts = { ...params };
    for (const prop of Object.keys(opts)) {
        if (!(ident.includes(prop.toString()))) {
            delete opts[prop];
        }
    }
    return opts;
}

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

// TESTABILITY
exports.getScreenshotList = (req, res) => {
    const files = fss.readdirSync(config.defaultBaselinePath);
    res.json(files);
};

// TASKS
exports.status = async (req, res) => {
    const count = await User.countDocuments();
    const currentUser = req.user;

    log.info(`server status: check users counts: ${count}`);
    if (count > 1) {
        res.json({ alive: true, currentUser: currentUser?.username });
        return;
    }
    res.json({ alive: false });
};

exports.loadTestUser = async (req, res) => {
    const logOpts = {
        itemType: 'user',
        msgType: 'LOAD',
        ref: 'Administrator',
    };
    if (process.env.SYNGRISI_TEST_MODE !== '1') {
        res.json({ message: 'the feature works only in test mode' });
        return;
    }
    const testAdmin = await User.findOne({ username: 'Test' });
    if (!testAdmin) {
        log.info('create the test Administrator', $this, logOpts);
        const adminData = JSON.parse(fss.readFileSync('./lib/testAdmin.json'));
        const admin = await User.create(adminData);
        log.info(`test Administrator with id: '${admin._id}' was created`, $this, logOpts);
        res.json(admin);
        return;
    }

    log.info(`test admin is exists: ${JSON.stringify(testAdmin, null, 2)}`, $this, logOpts);
    res.json({ msg: `already exist '${testAdmin}'` });
};

function taskOutput(msg, res) {
    res.write(`${msg.toString()}\n`);
    log.debug(msg.toString(), $this);
}

function parseHrtimeToSeconds(hrtime) {
    return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
}

exports.task_handle_old_checks = async (req, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    try {
        const startTime = process.hrtime();
        taskOutput(`- starting...\n`, res);

        taskOutput('STAGE #1 Calculate common stats', res);

        const trashHoldDate = subDays(new Date(), parseInt(req.query.days, 10));

        taskOutput('> get all checks data', res);
        const allChecksBefore = await Check.find()
            .lean()
            .exec();
        taskOutput('> get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
            .lean()
            .exec();
        taskOutput('> get files data', res);
        const allFilesBefore = (await fs.readdir(config.defaultBaselinePath, { withFileTypes: true }))
            .filter((item) => !item.isDirectory())
            .map(((x) => x.name))
            .filter((x) => x.includes('.png'));

        taskOutput('> get old checks data', res);
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } })
            .lean()
            .exec();

        taskOutput('>>> collect all baselineIds for old Checks ', res);
        const oldSnapshotsBaselineIdIds = oldChecks.map((x) => x.baselineId)
            .filter((x) => x);

        taskOutput('>>> collect all actualSnapshotId for old Checks ', res);
        const oldSnapshotsActualSnapshotIdIds = oldChecks.map((x) => x.actualSnapshotId)
            .filter((x) => x);

        taskOutput('>>> collect all diffId for old Checks ', res);
        const oldSnapshotsDiffIds = oldChecks.map((x) => x.diffId)
            .filter((x) => x);

        taskOutput('>>> calculate all unique snapshots ids for old Checks ', res);

        const allOldSnapshotsUniqueIds = Array.from(
            new Set([...oldSnapshotsBaselineIdIds, ...oldSnapshotsActualSnapshotIdIds, ...oldSnapshotsDiffIds])
        )
            .map((x) => x.valueOf());

        taskOutput('>>> collect all old snapshots', res);
        const oldSnapshots = await Snapshot.find({ _id: { $in: allOldSnapshotsUniqueIds } })
            .lean();

        const outTable = stringTable.create(
            [
                { item: 'all checks', count: allChecksBefore.length },
                { item: 'all snapshots', count: allSnapshotsBefore.length },
                { item: 'all files', count: allFilesBefore.length },
                { item: `checks older than: '${req.query.days}' days`, count: oldChecks.length },
                { item: 'old snapshots baseline ids', count: oldSnapshotsBaselineIdIds.length },
                { item: 'old snapshots actual snapshotId', count: oldSnapshotsActualSnapshotIdIds.length },
                { item: 'old snapshots diffIds', count: oldSnapshotsDiffIds.length },
                { item: 'all old snapshots unique Ids', count: allOldSnapshotsUniqueIds.length },
                { item: 'all old snapshots', count: oldSnapshots.length },
            ]
        );

        taskOutput(outTable, res);

        if (req.query.remove === 'true') {
            taskOutput(`STAGE #2 Remove checks that older that: '${req.query.days}' days,`
                + ` '${format(trashHoldDate, 'yyyy-MM-dd')}'\n`, res);

            taskOutput('> remove checks', res);
            const checkRemovingResult = await Check.deleteMany({ createdDate: { $lt: trashHoldDate } });
            taskOutput(`>>> removed: '${checkRemovingResult.deletedCount}'`, res);

            taskOutput('> remove snapshots', res);

            taskOutput('>> collect data to removing', res);
            taskOutput('>>> get all baselines snapshots id`s', res);
            const baselinesSnapshotsIds = (await Baseline.find({})
                .distinct('snapshootId'));

            // get baselineIds after removing
            taskOutput('>>> get all checks snapshots baselineId', res);
            const checksSnapshotsBaselineId = (await Check.find({})
                .distinct('baselineId'));

            taskOutput('>>> get all checks snapshots actualSnapshotId', res);
            const checksSnapshotsActualSnapshotId = (await Check.find({})
                .distinct('actualSnapshotId'));

            taskOutput('>> remove baselines snapshots', res);

            taskOutput('>> remove all old snapshots that not related to new baseline and check items', res);
            const removedByBaselineSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsBaselineIdIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByBaselineSnapshotsResult.deletedCount}'`, res);

            taskOutput('>> remove actual snapshots', res);
            // here we give all old checks and then exclude all baselines
            // and all checks related to new checks with actual and baseline snapshots with such baselineId
            taskOutput('>> remove all old snapshots that not related to new baseline and check items', res);
            const removedByActualSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $nin: checksSnapshotsBaselineId } },
                    { _id: { $nin: checksSnapshotsActualSnapshotId } },
                    { _id: { $nin: baselinesSnapshotsIds } },
                    { _id: { $in: oldSnapshotsActualSnapshotIdIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByActualSnapshotsResult.deletedCount}'`, res);

            taskOutput('>> remove all old diff snapshots', res);
            const removedByDiffSnapshotsResult = await Snapshot.deleteMany({
                $and: [
                    { _id: { $in: oldSnapshotsDiffIds } },
                ],
            });
            taskOutput(`>>> removed: '${removedByDiffSnapshotsResult.deletedCount}'`, res);

            taskOutput('> remove files', res);
            taskOutput('>>> collect all old snapshots filenames', res);
            const oldSnapshotsUniqueFilenames = Array.from(new Set(oldSnapshots.map((x) => x.filename)));
            taskOutput(`>> found: ${oldSnapshotsUniqueFilenames.length}`, res);

            taskOutput('> get all current snapshots filenames', res);
            const allCurrentSnapshotsFilenames = await Snapshot.find()
                .distinct('filename')
                .exec();

            taskOutput('>> calculate interception between all current snapshot filenames and old shapshots filenames', res);
            const arrayIntersection = (arr1, arr2) => arr1.filter((x) => arr2.includes(x));
            const filesInterception = arrayIntersection(allCurrentSnapshotsFilenames, oldSnapshotsUniqueFilenames);
            taskOutput(`>> found: ${filesInterception.length}`, res);

            taskOutput('>> calculate filenames to remove', res);
            const arrayDiff = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));
            const filesToDelete = arrayDiff(oldSnapshotsUniqueFilenames, filesInterception);
            taskOutput(`>> found: ${filesToDelete.length}`, res);

            taskOutput(`>> remove these files: ${filesToDelete.length}`, res);
            await Promise.all(filesToDelete.map((filename) => fs.unlink(`${config.defaultBaselinePath}/${filename}`)));
            taskOutput(`>> done: ${filesToDelete.length}`, res);

            taskOutput('STAGE #3 Calculate common stats after Removing', res);

            taskOutput('> get all checks data', res);
            const allChecksAfter = await Check.find()
                .lean()
                .exec();
            taskOutput('> get snapshots data', res);
            const allSnapshotsAfter = await Snapshot.find()
                .lean()
                .exec();
            taskOutput('> get files data', res);
            const allFilesAfter = (await fs.readdir(config.defaultBaselinePath, { withFileTypes: true }))
                .filter((item) => !item.isDirectory())
                .map(((x) => x.name))
                .filter((x) => x.includes('.png'));

            const outTableAfter = stringTable.create(
                [
                    { item: 'all checks', count: allChecksAfter.length },
                    { item: 'all snapshots', count: allSnapshotsAfter.length },
                    { item: 'all files', count: allFilesAfter.length },
                ]
            );

            taskOutput(outTableAfter, res);
        }
        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));

        taskOutput(`> done in ${elapsedSeconds} seconds ${elapsedSeconds / 60} min`, res);
    } catch (e) {
        log.error(e.stack.toString() || e);
        taskOutput(e.stack || e, res);
    } finally {
        res.end();
    }
};

exports.task_handle_database_consistency = async (req, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
        'x-no-compression': 'true',
    });
    // res.setHeader('x-no-compression', 'true');
    try {
        const startTime = process.hrtime();
        taskOutput(`- starting...\n`, res);
        taskOutput(`---------------------------------`, res);
        taskOutput(`STAGE #1: Calculate Common stats`, res);
        taskOutput('get runs data', res);
        const allRunsBefore = await Run.find()
            .exec();
        taskOutput('get suites data', res);
        const allSuitesBefore = await Suite.find()
            .exec();
        taskOutput('get tests data', res);
        const allTestsBefore = await Test.find()
            .lean()
            .exec();
        taskOutput('get checks data', res);
        const allChecksBefore = await Check.find()
            .lean()
            .exec();
        taskOutput('get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
            .lean()
            .exec();
        taskOutput('get files data', res);
        const allFilesBefore = (await fs.readdir(config.defaultBaselinePath, { withFileTypes: true }))
            .filter((item) => !item.isDirectory())
            .map(((x) => x.name))
            .filter((x) => x.includes('.png'));

        taskOutput(`-----------------------------`, res);
        const beforeStatTable = stringTable.create(
            [
                { item: 'suites', count: allSuitesBefore.length },
                { item: 'runs', count: allRunsBefore.length },
                { item: 'tests', count: allTestsBefore.length },
                { item: 'checks', count: allChecksBefore.length },
                { item: 'snapshots', count: allSnapshotsBefore.length },
                { item: 'files', count: allFilesBefore.length },
            ]
        );
        res.flush();
        taskOutput(beforeStatTable, res);

        taskOutput(`---------------------------------`, res);
        taskOutput(`STAGE #2: Calculate Inconsistent Items`, res);
        taskOutput(`> calculate abandoned snapshots`, res);
        // eslint-disable-next-line
        const abandonedSnapshots = allSnapshotsBefore.filter((sn) => {
            return !fss.existsSync(`${config.defaultBaselinePath}/${sn.filename}`);
        });

        taskOutput(`> calculate abandoned files`, res);
        const snapshotsUniqueFiles = Array.from(new Set(allSnapshotsBefore.map((x) => x.filename)));
        const abandonedFiles = [];
        const progress = new ProgressBar(allFilesBefore.length);
        // eslint-disable-next-line no-restricted-syntax
        for (const [index, file] of allFilesBefore.entries()) {
            setTimeout(() => {
                progress.writeIfChange(index, allFilesBefore.length, taskOutput, res);
            }, 10);

            if (!(snapshotsUniqueFiles.includes(file.toString()))) {
                abandonedFiles.push(file);
            }
        }
        // we don't remove the abandoned checks yet, need more statistics
        taskOutput(`> calculate abandoned checks`, res);
        const allSnapshotsBeforeIds = allSnapshotsBefore.map((x) => x._id.valueOf());

        const allChecksBeforeLight = allChecksBefore.map((x) => ({
            _id: x._id.valueOf(), baselineId: x.baselineId.valueOf(), actualSnapshotId: x.actualSnapshotId.valueOf(),
        }));
        const abandonedChecks = [];
        const progressChecks = new ProgressBar(allChecksBefore.length);
        for (const [index, check] of allChecksBeforeLight.entries()) {
            progressChecks.writeIfChange(index, allChecksBeforeLight.length, taskOutput, res);
            if (
                !(allSnapshotsBeforeIds.includes(check.baselineId))
                || !(allSnapshotsBeforeIds.includes(check.actualSnapshotId.valueOf()))
            ) {
                abandonedChecks.push(check._id.valueOf());
            }
        }

        taskOutput(`> calculate empty tests`, res);
        const checksUniqueTests = (await Check.find()
            .lean()
            .distinct('test')
            .exec())
            .map((x) => x.valueOf());

        const emptyTests = [];

        // eslint-disable-next-line no-restricted-syntax,no-unused-vars
        for (const [index, test] of allTestsBefore.entries()) {
            if (!checksUniqueTests.includes(test._id.valueOf())) {
                emptyTests.push(test._id.valueOf());
            }
        }

        taskOutput(`> calculate empty runs`, res);

        const checksUniqueRuns = (await Check.find()
            .distinct('run')
            .exec()).map((x) => x.valueOf());

        const emptyRuns = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const run of allRunsBefore) {
            // eslint-disable-next-line no-await-in-loop
            if (!checksUniqueRuns.includes(run._id.valueOf())) {
                emptyRuns.push(run._id.valueOf());
            }
        }

        taskOutput(`> calculate empty suites`, res);

        const checksUniqueSuites = (await Check.find()
            .distinct('suite')
            .exec()).map((x) => x.valueOf());

        const emptySuites = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const suite of allSuitesBefore) {
            // eslint-disable-next-line no-await-in-loop
            if (!checksUniqueSuites.includes(suite._id.valueOf())) {
                emptySuites.push(suite._id.valueOf());
            }
        }
        taskOutput(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, res);
        taskOutput(`Current inconsistent items:`, res);
        const inconsistentStatTable = stringTable.create(
            [
                { item: 'empty suites', count: emptySuites.length },
                { item: 'empty runs', count: emptyRuns.length },
                { item: 'empty tests', count: emptyTests.length },
                { item: 'abandoned checks', count: abandonedChecks.length },
                { item: 'abandoned snapshots', count: abandonedSnapshots.length },
                { item: 'abandoned files', count: abandonedFiles.length },
            ]
        );
        taskOutput(inconsistentStatTable, res);

        if (req.query.clean) {
            taskOutput(`---------------------------------`, res);
            taskOutput(`STAGE #3: Remove non consistent items`, res);

            taskOutput(`> remove empty suites`, res);
            await Suite.deleteMany({ _id: { $in: emptySuites } });
            taskOutput(`> remove empty runs`, res);
            await Run.deleteMany({ _id: { $in: emptyRuns } });
            taskOutput(`> remove empty tests`, res);
            await Test.deleteMany({ _id: { $in: emptyTests } });
            taskOutput(`> remove abandoned checks`, res);
            await Check.deleteMany({ _id: { $in: abandonedChecks } });
            taskOutput(`> remove abandoned snapshots`, res);
            await Snapshot.deleteMany({ _id: { $in: abandonedSnapshots } });
            taskOutput(`> remove abandoned files`, res);
            await Promise.all(abandonedFiles.map((filename) => fs.unlink(`${config.defaultBaselinePath}/${filename}`)));
            const allFilesAfter = fss.readdirSync(config.defaultBaselinePath, { withFileTypes: true })
                .filter((item) => !item.isDirectory())
                .map(((x) => x.name))
                .filter((x) => x.includes('.png'));

            taskOutput(`STAGE #4: Calculate Common stats after cleaning`, res);
            taskOutput(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`, res);
            taskOutput(`Current items:`, res);
            const afterStatTable = stringTable.create(
                [
                    { item: 'suites', count: await Suite.countDocuments() },
                    { item: 'runs', count: await Run.countDocuments() },
                    { item: 'tests', count: await Test.countDocuments() },
                    { item: 'checks', count: await Check.countDocuments() },
                    { item: 'snapshots', count: await Snapshot.countDocuments() },
                    { item: 'files', count: allFilesAfter.length },
                ]
            );
            taskOutput(afterStatTable, res);
        }

        const elapsedSeconds = parseHrtimeToSeconds(process.hrtime(startTime));
        taskOutput(`> Done in ${elapsedSeconds} seconds, ${elapsedSeconds / 60} min`, res);
        taskOutput(`- end...\n`, res);
    } catch (e) {
        log.error(e.stack.toString() || e);
        taskOutput(e.stack || e, res);
    } finally {
        res.end();
    }
};

exports.task_remove_old_logs = async (req, res) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    const trashHoldDate = subDays(new Date(), parseInt(req.query.days, 10));
    const filter = { timestamp: { $lt: trashHoldDate } };
    const allLogsCountBefore = await Log.find({})
        .countDocuments();
    const oldLogsCount = await Log.find(filter)
        .countDocuments();
    taskOutput(`- the count of all documents is: '${allLogsCountBefore}'\n`, res);
    taskOutput(`- the count of documents to be removed is: '${oldLogsCount}'\n`, res);
    if (req.query.statistics === 'false') {
        taskOutput(
            `- will remove all logs older that: '${req.query.days}' days,`
            + ` '${format(trashHoldDate, 'yyyy-MM-dd')}'\n`,
            res
        );
        await Log.deleteMany(filter);
        const allLogsCountAfter = await Log.find({})
            .countDocuments();
        taskOutput(`- the count of all documents now is: '${allLogsCountAfter}'\n`, res);
    }

    taskOutput('> Done', res);
    res.end();
};

exports.task_test = async (req, res, next) => {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });

    const x = 1000;
    const interval = 30;
    let isAborted = false;

    req.on(
        'close',
        () => {
            isAborted = true;
        }
    );

    for (let i = 0; i < x; i += 1) {
        await new Promise((r) => setTimeout(() => r(), interval));
        taskOutput(`- Task Output - '${i}'\n`, res);
        if (isAborted) {
            taskOutput(`the task was aborted\n`, res);
            log.warn('the task was aborted', $this);
            res.flush();
            return res.end();
        }
    }
};
