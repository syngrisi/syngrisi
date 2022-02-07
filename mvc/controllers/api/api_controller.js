/* eslint-disable dot-notation,no-underscore-dangle,quotes,object-shorthand */
// eslint-disable-next-line no-unused-vars
/* global log:readonly */
const querystring = require('querystring');
const mongoose = require('mongoose');
const hasha = require('hasha');
const fs = require('fs').promises;
const fss = require('fs');
const {
    format,
    subDays,
} = require('date-fns');
const { config } = require('../../../config');
const { getDiff } = require('../../../lib/comparator');
const orm = require('../../../lib/dbItems');
const { parseDiff } = require('../../../lib/parseDiff');
const { getAllElementsByPositionFromDump } = require('../../../lib/getElementsByPixPositionsFromDump');

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
    checksGroupedByIdent2,
    calculateAcceptedStatus,
} = require('../utils');
const {
    fatalError,
    waitUntil,
    removeEmptyProperties,
    buildQuery,
    buildIdentObject,
} = require('../utils');
const { createItemIfNotExistAsync } = require('../../../lib/dbItems');

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

// snapshots
async function getSnapshotByImgHash(hash) {
    return Snapshot.findOne({ imghash: hash });
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
    $this.logMeta = {
        scope: 'createSnapshot',
        itemType: 'snapshot',
    };
    if (!fileData) throw new Error(`cannot create the snapshot, the 'fileData' is not set, name: '${name}'`);

    opts.imghash = hashCode || hasha(fileData);
    const snapshot = new Snapshot(opts);
    const path = `${config.defaultBaselinePath}${snapshot.id}.png`;
    log.debug(`save screenshot for: '${name}' snapshot to: '${path}'`, $this);
    await fs.writeFile(path, fileData);
    snapshot.filename = `${snapshot._id}.png`;
    await snapshot.save();
    log.debug(`snapshot was saved: '${JSON.stringify(snapshot)}'`, $this, { ref: snapshot._id });
    return snapshot;
}

async function cloneSnapshot(sourceSnapshot, name) {
    const filename = sourceSnapshot.filename ? sourceSnapshot.filename : `${sourceSnapshot._id}.png`;
    const hashCode = sourceSnapshot.imghash;
    const newSnapshot = new Snapshot({
        name,
        filename,
        imghash: hashCode,
    });
    await newSnapshot.save();
    return newSnapshot;
}

async function compareSnapshots(baseline, actual) {
    const logOpts = {
        scope: 'compareSnapshots',
        ref: baseline.id,
        itemType: 'snapshot',
        msgType: 'COMPARE',
    };
    log.debug(`compare baseline and actual snapshots with ids: [${baseline.id}, ${actual.id}]`, $this, logOpts);
    log.debug(`current baseline: ${JSON.stringify(baseline)}`, $this, logOpts);
    let diff;
    if (baseline.imghash === actual.imghash) {
        log.debug(`baseline and actual snapshot have the identical image hashes: '${baseline.imghash}'`, $this, logOpts);
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
        const baselinePath = `${config.defaultBaselinePath}${baseline.filename || `${baseline.id}.png`}`;
        const actualPath = `${config.defaultBaselinePath}${actual.filename || `${actual.id}.png`}`;
        const baselineData = fs.readFile(baselinePath);
        const actualData = fs.readFile(actualPath);
        log.debug(`baseline path: ${config.defaultBaselinePath}${baseline.id}.png`, $this, logOpts);
        log.debug(`actual path: ${config.defaultBaselinePath}${actual.id}.png`, $this, logOpts);
        let opts = {};
        if (baseline.ignoreRegions) {
            log.debug(`ignore regions: '${baseline.ignoreRegions}', type: '${typeof baseline.ignoreRegions}'`);
        }

        // back compatibility
        if ((baseline.ignoreRegions !== 'undefined') && baseline.ignoreRegions) {
            const ignored = JSON.parse(JSON.parse(baseline.ignoreRegions));
            opts = { ignoredBoxes: ignored };
        }
        opts.ignore = baseline.matchType || 'nothing';
        diff = await getDiff(baselineData, actualData, opts);
    }

    log.silly(`the diff is: '${JSON.stringify(diff, null, 2)}'`);
    if (parseFloat(diff.misMatchPercentage) !== 0) {
        log.debug(`images are different, ids: [${baseline.id}, ${actual.id}], misMatchPercentage: '${diff.misMatchPercentage}'`);
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
            baseline.vOffset = -diff.vOffset;
            await baseline.save();
        }
    }
    return diff;
}

exports.updateSnapshot = async function (req, res) {
    const logOpts = {
        scope: 'updateSnapshot',
        ref: req.id,
        itemType: 'snapshot',
        msgType: 'UPDATE',
    };
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        opts['updatedDate'] = Date.now();
        // eslint-disable-next-line max-len
        log.debug(`start update snapshot with id: '${id}', params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`, $this, logOpts);
        const snp = await Snapshot.findByIdAndUpdate(id, opts)
            .exec();
        await snp.save();
        log.debug(`snapshot with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`, $this, logOpts);
        res.status(200)
            .json({
                item: 'Snapshot',
                action: 'update',
                id,
                opts,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getSnapshot = async function (req, res) {
    let id;
    try {
        id = req.params.id;
        const snp = await Snapshot.findById(id);
        res.json(snp);
        return snp;
    } catch (e) {
        log.error((`cannot get a snapshot with id: '${id}', error: ${e}`, $this, {
            scope: 'getSnapshot',
            msgType: 'GET',
        }));
        fatalError(req, res, e);
    }
    return null;
};

const checksGroupByIdent = async function (req, res) {
    try {
        const testId = req.params.testid;
        res.json(await checksGroupedByIdent({ test: testId }));
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.checksGroupByIdent = checksGroupByIdent;

exports.affectedElements = async function (req, res) {
    try {
        if (!req.query.checktid || !req.query.diffid) {
            const e = 'checktid|diffid query values are empty';
            fatalError(req, res, e);
        }
        const chk = await Check.findById(req.query.checktid)
            .exec()
            .catch((e) => {
                fatalError(req, res, e);
            });
        if (!chk) {
            fatalError(req, res, `Cannot find check with such id: '${req.query.checktid}'`);
        }

        const imDiffData = await fs.readFile(`${config.defaultBaselinePath}${req.query.diffid}.png`);
        const positions = parseDiff(imDiffData);
        const result = await getAllElementsByPositionFromDump(JSON.parse(chk.domDump), positions);
        console.table(Array.from(result), ['tag', 'id', 'x', 'y', 'width', 'height', 'domPath']);
        res.json(result);
        return result;
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

function parseSorting(params) {
    const sortObj = Object.keys(params)
        .filter((key) => key.startsWith('sort_'))
        .reduce((obj, key) => {
            const props = key.split('_');
            const sortBy = props[1];
            const sortDirection = parseInt(props[2], 10);
            obj[sortBy] = sortDirection;
            return obj;
        }, {});

    return sortObj;
}

// users

function getApiKey() {
    const uuidAPIKey = require('uuid-apikey');

    return uuidAPIKey.create().apiKey;
}

exports.generateApiKey = async function (req, res) {
    const apiKey = getApiKey();
    log.debug(`generate API Key for user: '${req.user.username}'`, $this, { user: req.user.username });
    const hash = hasha(apiKey);
    const user = await User.findOne({ username: req.user.username });
    user.apiKey = hash;
    await user.save();
    res.status(200)
        .json({ apikey: apiKey });
};

exports.createUser = async function (req, res) {
    const params = req.body;
    const logOpts = {
        msgType: 'CREATE',
        itemType: 'user',
        ref: params.username,
        user: req?.user?.username,
        scope: 'createUser',
    };
    try {
        log.debug(`create the user with name '${params.username}', params: '${JSON.stringify(params)}'`,
            $this, logOpts);

        const opts = removeEmptyProperties(Object.assign(params, { updatedDate: new Date() }));
        const user = await orm.createUser(opts);
        const updatedUser = await user.setPassword(opts.password);
        await updatedUser.save();
        log.debug(`password for user: '${user.username}' set successfully`, $this, logOpts);
        res.json(user);
        return [req, res, user];
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

exports.getUsers = async function (req, res) {
    const users = await User.find()
        .exec();
    res.status(200)
        .json(users);
    return users;
};

const updateUser = async function (req, res) {
    const params = req.body;
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'user',
        ref: params.username,
        user: req?.user?.username,
        scope: 'updateUser',
    };

    try {
        log.debug(`update user with id: '${params.id}' name '${params.username}', params: '${JSON.stringify(params)}'`,
            $this, logOpts);

        const opts = removeEmptyProperties(Object.assign(params, { updatedDate: new Date() }));

        const user = await User.findById(opts.id);
        if (!user) {
            res.status(500)
                .json({
                    status: 'Error',
                    message: `Cannot find user with id: '${opts.id}'`,
                });
            throw new Error(`cannot find the user with id: ${opts.id}`);
        }
        const { password } = opts;

        await User.findByIdAndUpdate(user._id, params);

        if (password) {
            await user.setPassword(password);
            await user.save();
        }
        log.debug(`user '${user.username}' was updated successfully`, $this, logOpts);
        res.json(user);
        return [req, res, user];
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

exports.updateUser = updateUser;

exports.removeUser = async function (req, res) {
    const params = req.body;
    const logOpts = {
        msgType: 'REMOVE',
        itemType: 'user',
        ref: params.username,
        user: req?.user?.username,
        scope: 'removeUser',
    };
    try {
        const { id } = req.params;
        log.debug(`remove the user with id: '${id}'`, $this, logOpts);
        const user = await User.findByIdAndDelete(id);
        log.debug(`user with id: '${user._id}' and username: '${user.username}' was removed`, $this, logOpts);
        res.status(200)
            .send({ message: `user with id: '${user._id}' and username: '${user.username}' was removed` });
        return;
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.changePassword = function (req, res) {
    const params = req.body;
    const logOpts = {
        scope: 'changePassword',
        msgType: 'CHANGE PWD',
        itemType: 'user',
        ref: req?.user?.username,
    };
    log.debug(`change password for  '${req.user.username}', params: '${JSON.stringify(params)}'`, $this, logOpts);
    User.findOne({ username: req.user.username })
        .then((foundUser) => {
            foundUser.changePassword(params['old-password'], params['new-password'])
                .then(
                    () => {
                        log.debug(`password was successfully changed for user: ${req.user.username}`, $this, logOpts);
                        return res.redirect('/logout');
                    },
                    (e) => fatalError(req, res, e)
                );
        });
};

// tests
async function updateTest(opts) {
    const { id } = opts;
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'test',
        scope: 'updateTest',
    };
    opts['updatedDate'] = Date.now();
    log.debug(`update test id '${id}' with params '${JSON.stringify(opts)}'`, $this, logOpts);

    const test = await Test.findByIdAndUpdate(id, opts)
        .exec();

    test.save();

    return test;
}

exports.updateTest = async function (req, res) {
    const opts = removeEmptyProperties(req.body);
    const { id } = req.params;
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'test',
        ref: id,
        user: req?.user?.username,
        scope: 'updateTest',
    };
    try {
        log.debug(`update test with id '${id}' with params '${JSON.stringify(opts, null, 2)}'`,
            $this, logOpts);

        const test = await Test.findOneAndUpdate({ _id: id }, opts, { new: true });
        res.status(200)
            .json({
                message: `Test with id: '${id}' was updated`,
                test: test.toObject(),
            });
        return test;
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

function removeCheck(id) {
    return new Promise((resolve, reject) => {
        let logOpts = {};
        Check.findByIdAndDelete(id)
            .then(async (check) => {
                logOpts = {
                    scope: 'removeCheck',
                    msgType: 'REMOVE',
                    itemType: 'check',
                    ref: id,
                };
                log.debug(`check with id: '${id}' was removed, update test: ${check.test}`, $this, logOpts);

                const test = await Test.findById(check.test)
                    .exec();
                const testCalculatedStatus = await calculateTestStatus(check.test);
                const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

                test.status = testCalculatedStatus;
                test.markedAs = testCalculatedAcceptedStatus;
                test.updatedDate = new Date();

                await orm.updateItemDate('VRSSuite', check.suite);
                test.save();

                const allCheckIds = {
                    baseline: check.baselineId?.toString(),
                    actual: check.actualSnapshotId?.toString(),
                    diff: check.diffId?.toString(),
                };
                if (check.baselineId ?? true) {
                    log.debug(`try to remove the snapshot, baseline: ${check.baselineId}`, $this, logOpts);
                    await removeSnapshot('baseline', allCheckIds);
                }

                if (check.actualSnapshotId ?? true) {
                    log.debug(`try to remove the snapshot, actual: ${check.actualSnapshotId}`, $this, logOpts);
                    await removeSnapshot('actual', allCheckIds);
                }

                if (check.diffId ?? true) {
                    log.debug(`try to remove snapshot, diff: ${check.diffId}`, $this, logOpts);
                    await removeSnapshot('diff', allCheckIds);
                }
                return resolve();
            })
            .catch(
                (e) => {
                    log.error(`cannot remove a check with id: '${id}', error: '${e}'`, $this, logOpts);
                    return reject(e);
                }
            );
    });
}

async function removeTest(id) {
    const logOpts = {
        itemType: 'test',
        msgType: 'REMOVE',
        ref: id,
    };
    try {
        log.debug(`try to delete all checks associated to test with ID: '${id}'`, $this, logOpts);
        const checks = await Check.find({ test: id });
        const checksRemoveResult = [];
        checks.forEach((check) => {
            checksRemoveResult.push(removeCheck(check._id));
        });
        await Promise.all(checksRemoveResult);

        await Test.findByIdAndDelete(id);
    } catch (e) {
        log.error(`cannot remove test with id: ${id} error: ${e}`, $this, logOpts);
        throw new Error();
    }
}

exports.removeTest = async function (req, res) {
    try {
        const { id } = req.params;
        await removeTest(id);
        res.status(200)
            .json({
                message: `Test with id: '${id}' and all related checks were removed`,
            });
        return;
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.createTest = async function (req, res) {
    const $this = this;
    $this.logMeta = {
        scope: 'createTest',
        user: req?.user?.username,
        itemType: 'test',
        msgType: 'CREATE',
    };

    try {
        const params = req.body;

        log.info(`create test with name '${params.name}', params: '${JSON.stringify(params)}'`, $this);
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

        let run;
        if (params.run) {
            run = await createItemIfNotExistAsync('VRSRun',
                {
                    name: params.run,
                    ident: params.runident,
                },
                { user: req?.user?.username, itemType: 'run' });
            opts.run = run.id;
        }
        const test = await orm.createTest(opts);

        res.json(test);
        return [req, res, test];
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

async function calculateTestStatus(testId) {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.status[0]);
    let testCalculatedStatus = 'Failed';
    if (statuses.every((x) => (x === 'new') || (x === 'passed'))) {
        testCalculatedStatus = 'Passed';
    }
    if (statuses.every((x) => (x === 'new'))) {
        testCalculatedStatus = 'New';
    }
    // console.log({ testCalculatedStatus });
    return testCalculatedStatus;
}

// suites
exports.removeSuite = async function (req, res) {
    const $this = this;
    $this.logMeta = {
        scope: 'removeSuite',
        user: req?.user?.username,
        itemType: 'suite',
        msgType: 'REMOVE',
    };
    const { id } = req.params;
    try {
        const suite = await Suite.findOne({ _id: id });
        log.info(`remove suite with name: '${suite.name}'`, $this, { ref: id });
        const tests = await Test.find({ suite: id });

        const results = [];
        for (const test of tests) {
            results.push(removeTest(test._id));
        }

        await Promise.all(results);
        const out = await Suite.findByIdAndDelete(id);
        res.status(200)
            .send(`Suite with id: '${id}' and all related tests and checks were removed
                    output: '${JSON.stringify(out)}'`);
    } catch (e) {
        log.error(`cannot remove the suite with id: '${id}', error: '${e}'`, $this);
        throw new Error(`cannot remove the suite with id: '${id}', error: '${e}'`);
    }
};

exports.removeRun = async function (req, res) {
    const $this = this;
    $this.logMeta = {
        scope: 'removeRun',
        user: req?.user?.username,
        itemType: 'run',
        msgType: 'REMOVE',
    };
    const { id } = req.params;
    try {
        const run = await Run.findOne({ _id: id });
        log.info(`delete run and checks which associate with the run: '${run.name}'`, this, { ref: id });
        const tests = await Test.find({ run: id });

        const results = [];
        for (const test of tests) {
            results.push(removeTest(test._id));
        }
        await Promise.all(results);
        const out = await Run.findByIdAndDelete(id);
        res.status(200)
            .send(`Run with id: '${id}' and all related tests and checks were removed
                    output: '${JSON.stringify(out)}'`);
    } catch (e) {
        log.error(`cannot remove the run with id: '${id}', error: '${e}'`, $this);
        throw new Error(`cannot remove the run with id: '${id}', error: '${e}'`);
    }
};

// checks
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
    const identFields = buildIdentObject(params);
    const identFieldsAccepted = Object.assign(buildIdentObject(params), { markedAs: 'accepted' });
    const acceptedBaseline = await Baseline.findOne(identFieldsAccepted, {}, { sort: { createdDate: -1 } });
    log.debug(`acceptedBaseline: '${acceptedBaseline ? JSON.stringify(acceptedBaseline) : 'not found'}'`, $this, { itemType: 'baseline' });
    if (acceptedBaseline) return acceptedBaseline;
    const simpleBaseline = await Baseline.findOne(identFields, {}, { sort: { createdDate: -1 } });
    log.debug(`simpleBaseline: '${simpleBaseline ? JSON.stringify(simpleBaseline) : 'not found'}'`, $this, { itemType: 'baseline' });
    if (simpleBaseline) return simpleBaseline;
    return null;
}

async function createNewBaseline(params) {
    const identFields = buildIdentObject(params);

    const newBaseline = await Baseline.create(identFields);
    if (params.markedAs) newBaseline.markedAs = params.markedAs;
    if (params.markedById) newBaseline.markedById = params.markedById;
    if (params.markedByUsername) newBaseline.markedByUsername = params.markedByUsername;
    if (params.markedDate) newBaseline.lastMarkedDate = params.markedDate;
    newBaseline.createdDate = new Date();
    newBaseline.snapshootId = params.actualSnapshotId || params.baselineId;

    return Promise.resolve(await newBaseline.save());
}

async function createBaselineifNotExist(params) {
    // find if baseline already exist
    const baseline = await getBaseline(params);
    if (baseline) return Promise.resolve(baseline);
    return createNewBaseline(params);
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
    currentUser
) {
    const executionTimer = process.hrtime();
    const app = await createItemIfNotExistAsync('VRSApp',
        { name: checkParam.appName || 'Unknown' },
        { user: currentUser.username, itemType: 'app' });

    /** define params for new check */
    const newCheckParams = {
        test: checkParam.testId,
        name: checkParam.name,
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

    /**
     * Usually there is two stage of checking request:
     * Phase 1
     *   1. Client sends request with 'req.body.hashcode' value but without 'req.files.file.data'
     *   2. Server finds for snapshot with this image 'hashcode' and if found - go to Step 3 of Phase2,
     *      if not - sends response "{status: 'requiredFileData', message: 'cannot found an image
     *      with this hashcode,
     *      please add image file data and resend request'}"
     * Phase 2
     *   1. Client receives response with incomplete status and resend the same request but,
     *   with 'req.files.file.data' parameter
     *   2. Server create a new snapshot based on parameters
     *   3. Server handle checking the snapshoot and return to client check response
     *   with one of 'complete` status (eq:. new, failed, passed)
     */

    /** look up the snapshot with same hashcode if didn't find, ask for file data */

    const snapshotFoundedByHashcode = await getSnapshotByImgHash(checkParam.hashCode);
    if (!checkParam.hashCode && !checkParam.files) {
        log.debug('hashCode or files parameters should be present', $this);
        return { status: 'needFiles' };
    }

    if (!checkParam.files && !snapshotFoundedByHashcode) {
        log.debug(`cannot find the snapshot with hash: '${checkParam.hashCode}'`, $this);
        return { status: 'needFiles' };
    }
    if (snapshotFoundedByHashcode) {
        log.debug(`snapshot was found by hashcode: '${checkParam.hashCode}'`, $this);
    }

    /** ASSIGN BASELINE */
    let currentSnapshot;
    let currentBaselineSnapshot;

    const checkIdent = buildIdentObject(newCheckParams);

    const fileData = checkParam.files ? checkParam.files.file.data : false;

    if (snapshotFoundedByHashcode) {
        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' is already exists, will clone it`, $this);
        currentSnapshot = await cloneSnapshot(snapshotFoundedByHashcode, checkParam.name);
    } else {
        log.debug(`snapshot with such hashcode: '${checkParam.hashCode}' does not exists, will create it`, $this);
        currentSnapshot = await createSnapshot({
            name: checkParam.name,
            fileData,
            hashCode: checkParam.hashCode,
        });
    }

    log.info(`find a baseline for the check with identifier: '${JSON.stringify(checkIdent)}'`, $this);
    const storedBaseline = await getBaseline(newCheckParams);

    let check;
    // if last check has baseline id copy properties from last check
    // and set it as `currentBaseline` to make diff
    if (storedBaseline !== null) {
        log.debug(`a baseline for check name: '${checkParam.name}', id: '${storedBaseline.snapshootId}' is already exists`, $this);
        newCheckParams.baselineId = storedBaseline.snapshootId;

        // log.debug(`creating an actual snapshot for check with name: '${checkParam.name}'`, $this);
        newCheckParams.actualSnapshotId = currentSnapshot.id;
        newCheckParams.status = 'pending';
        if (storedBaseline.markedAs) {
            newCheckParams.markedAs = storedBaseline.markedAs;
            newCheckParams.markedDate = storedBaseline.lastMarkedDate;
            newCheckParams.markedByUsername = storedBaseline.markedByUsername;
        }

        currentBaselineSnapshot = await Snapshot.findById(storedBaseline.snapshootId);
        log.debug(`create the new check document with params: '${prettyCheckParams(newCheckParams)}'`, $this);
        check = await Check.create(newCheckParams);
    } else {
        // since the `storedBaseline` does not exist set current snapshot as currentBaseline to make diff
        log.debug(`a baseline snapshot for previous check with name: '${checkParam.name}', does not exist creating new one`, this);
        newCheckParams.baselineId = currentSnapshot.id;
        newCheckParams.actualSnapshotId = currentSnapshot.id;
        newCheckParams.status = 'new';
        currentBaselineSnapshot = currentSnapshot;
        log.debug(`create the new check with params: '${prettyCheckParams(newCheckParams)}'`, $this);
        check = await Check.create(newCheckParams);
        await createNewBaseline(check.toObject());
    }
    let savedCheck = await check.save();
    log.debug(`the check with id: '${check.id}', was successfully created!`, $this, { ref: check.id }, $this);

    // check if we can ignore 1 px dimensions difference from the bottom
    const ignoreDifferentResolutions = (dimensionDifference) => {
        if ((dimensionDifference.width === 0) && (dimensionDifference.height === -1)) return true;
        if ((dimensionDifference.width === 0) && (dimensionDifference.height === 1)) return true;
        return false;
    };
    const areSnapshotsDifferent = (compareResult) => compareResult.misMatchPercentage !== '0.00';
    const areSnapshotsWrongDimensions = (compareResult) => !compareResult.isSameDimensions
        && !ignoreDifferentResolutions(compareResult.dimensionDifference);

    const checkUpdateParams = {};
    let totalCheckHandleTime;
    let compareResult;
    const failReasons = [];
    /** compare actual with baseline if a check isn't new */
    if (check.status.toString() !== 'new') {
        try {
            log.debug(`'the check with name: '${checkParam.name}' isn't new, make comparing'`, $this);
            compareResult = await compareSnapshots(currentBaselineSnapshot, currentSnapshot);
            log.silly(`ignoreDifferentResolutions: '${ignoreDifferentResolutions(compareResult.dimensionDifference)}'`);
            log.silly(`dimensionDifference: '${JSON.stringify(compareResult.dimensionDifference)}`);
            if (areSnapshotsDifferent(compareResult) || areSnapshotsWrongDimensions(compareResult)) {
                let logMsg;
                if (areSnapshotsWrongDimensions(compareResult)) {
                    logMsg = 'snapshots have different dimensions';
                    failReasons.push('wrong_dimensions');
                }
                if (areSnapshotsDifferent(compareResult)) {
                    logMsg = 'snapshots have differences';
                    failReasons.push('different_images');
                }
                checkUpdateParams.failReasons = failReasons;

                log.debug(logMsg, $this);
                log.debug(`saving diff snapshot for check with Id: '${check.id}'`, $this, { ref: check.id });
                const diffSnapshot = await createSnapshot({
                    name: checkParam.name,
                    fileData: compareResult.getBuffer(),
                });
                checkUpdateParams['diffId'] = diffSnapshot.id;
                checkUpdateParams['status'] = 'failed';
            } else {
                await createBaselineifNotExist(check.toObject());
                checkUpdateParams['status'] = 'passed';
            }

            checkUpdateParams['updatedDate'] = Date.now();
            totalCheckHandleTime = process.hrtime(executionTimer)
                .toString();

            compareResult['totalCheckHandleTime'] = totalCheckHandleTime;
            checkUpdateParams['result'] = JSON.stringify(compareResult, null, '\t');
        } catch (e) {
            checkUpdateParams['status'] = 'failed';
            checkUpdateParams['result'] = `{ "server error": "error during comparing - ${e}" }`;
            checkUpdateParams.failReasons = ['internal_server_error'];
            await Check.findByIdAndUpdate(check._id, checkUpdateParams);
            throw e;
        }
    }

    log.debug(`update check with params: '${JSON.stringify(checkUpdateParams)}'`, $this, { ref: check._id });
    await Check.findByIdAndUpdate(check._id, checkUpdateParams);
    savedCheck = await Check.findById(check._id);
    // update test and suite
    test.markedAs = await calculateAcceptedStatus(check.test);
    test.updatedDate = new Date();
    log.debug('update suite', $this);
    await orm.updateItemDate('VRSSuite', check.suite);
    await test.save();

    const lastSuccessCheck = await getLastSuccessCheck(checkIdent);
    const result = {
        ...savedCheck.toObject(),
        executeTime: totalCheckHandleTime,
        lastSuccess: lastSuccessCheck ? (lastSuccessCheck).id : null,
    };
    return result;
}

exports.createCheck = async function (req, res) {
    lackOfParamsGuard(req, res);
    this.logMeta = {
        scope: 'createCheck',
        user: req?.user?.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    try {
        const apiKey = req.headers.apikey;
        const currentUser = await User.findOne({ apiKey: apiKey })
            .exec();

        log.info(`start create check: '${prettyCheckParams(req.body.name)}'`, $this);

        /** look for or create test and suite */
        log.debug(`try to find test with id: '${req.body.testid}'`, $this);
        const test = await Test.findById(req.body.testid)
            .exec();
        if (!test) {
            const errMsg = `can't find test with id: '${req.body.testid}', `
                + `parameters: '${JSON.stringify(req.body)}', username: '${currentUser.username}', apiKey: ${apiKey}`;
            res.status(400)
                .send({ status: 'testNotFound', message: errMsg });
            throw new Error(errMsg);
        }
        const suite = await createItemIfNotExistAsync('VRSSuite',
            { name: req.body.suitename || 'Others' },
            { user: currentUser.username, itemType: 'suite' });

        // const suite = await orm.createSuiteIfNotExist({ name: req.body.suitename || 'Others' });

        await orm.updateItem('VRSTest', { _id: test.id }, {
            suite: suite.id,
            creatorId: currentUser._id,
            creatorUsername: currentUser.username,
        });

        const result = await createCheck(
            {
                branch: req.body.branch,
                appName: req.body.appName,
                // suiteName: req.body.suiteName,
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
            },
            test,
            suite,
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

exports.getChecks2 = async function (req, res) {
    const opts = req.query;

    const pageSize = parseInt(process.env['PAGE_SIZE'], 10) || 50;

    const skip = opts.page ? ((parseInt(opts.page, 10)) * pageSize - pageSize) : 0;

    let sortFilter = parseSorting(opts);
    if (Object.keys(sortFilter).length < 1) {
        sortFilter = { updatedDate: -1 };
    }

    const query = buildQuery(opts);
    // console.log({ query });
    // console.log({opts})
    if (opts.filter_suitename_eq) {
        const decodedQuerystringSuiteName = Object.keys(querystring.decode(opts.filter_suitename_eq))[0];
        const suite = await Suite.findOne({ name: { $eq: decodedQuerystringSuiteName } })
            .exec();
        if (opts.filter_suitename_eq && !suite) {
            res.status(200)
                .json({});
        }
        if (suite) {
            query.suite = suite.id;
            delete query.suitename;
        }
    }

    if (req.user.role === 'user') {
        query.creatorUsername = req.user.username;
    }
    // console.log({ query });
    const tests = await Test
        .find(query)
        .sort(sortFilter)
        .skip(skip)
        .limit(pageSize)
        .exec();
    // console.log({ tests });
    // const suites = await getSuitesByTestsQuery(query);
    const checksByTestGroupedByIdent = [];

    for (const test of tests) {
        const groups = await checksGroupedByIdent2(test.id);
        // console.log(Object.keys(groups).length);
        if (Object.keys(groups).length < 1) {
            continue;
        }
        // console.log({groups})
        checksByTestGroupedByIdent.push({
            id: test.id,
            creatorId: test.creatorId,
            creatorUsername: test.creatorUsername,
            markedAs: test.markedAs,
            markedByUsername: test.markedByUsername,
            markedDate: test.markedDate,
            name: test.name,
            status: test.status,
            browserName: test.browserName,
            browserVersion: test.browserVersion,
            browserFullVersion: test.browserFullVersion,
            viewport: test.viewport,
            calculatedViewport: test.calculatedViewport,
            os: test.os,
            blinking: test.blinking,
            updatedDate: test.updatedDate,
            createdDate: test.createdDate,
            suite: test.suite,
            run: test.run,
            tags: test.tags,
            branch: test.branch,
            app: test.app,
            groups: groups,
        });
    }
    // console.log(Object.keys(checksByTestGroupedByIdent).length);
    res.status(200)
        .json(checksByTestGroupedByIdent);
};

exports.getChecks = async function (req, res) {
    const opts = req.query;

    const pageSize = parseInt(process.env['PAGE_SIZE'], 10) || 50;

    const skip = opts.page ? ((parseInt(opts.page, 10)) * pageSize - pageSize) : 0;

    let sortFilter = parseSorting(opts);
    if (Object.keys(sortFilter).length < 1) {
        sortFilter = { updatedDate: -1 };
    }

    const query = buildQuery(opts);
    // console.log({ query });
    // console.log({opts})
    if (opts.filter_suitename_eq) {
        const decodedQuerystringSuiteName = Object.keys(querystring.decode(opts.filter_suitename_eq))[0];
        const suite = await Suite.findOne({ name: { $eq: decodedQuerystringSuiteName } })
            .exec();
        if (opts.filter_suitename_eq && !suite) {
            res.status(200)
                .json({});
            return;
        }
        if (suite) {
            query.suite = suite.id;
            delete query.suitename;
        }
    }

    if (req.user.role === 'user') {
        query.creatorUsername = req.user.username;
    }
    // console.log({ query });
    const tests = await Test
        .find(query)
        .sort(sortFilter)
        .skip(skip)
        .limit(pageSize)
        .exec();
    // console.log({ tests });
    // const suites = await getSuitesByTestsQuery(query);
    const checksByTestGroupedByIdent = {};

    for (const test of tests) {
        const checkFilter = { test: test.id };
        const groups = await checksGroupedByIdent(checkFilter);
        // console.log(groups.length);
        if (Object.keys(groups).length < 1) {
            continue;
        }
        // console.log({groups})
        checksByTestGroupedByIdent[test.id] = groups;
        checksByTestGroupedByIdent[test.id]['id'] = test.id;
        checksByTestGroupedByIdent[test.id]['creatorId'] = test.creatorId;
        checksByTestGroupedByIdent[test.id]['creatorUsername'] = test.creatorUsername;
        checksByTestGroupedByIdent[test.id]['markedAs'] = test.markedAs;
        checksByTestGroupedByIdent[test.id]['markedByUsername'] = test.markedByUsername;
        checksByTestGroupedByIdent[test.id]['markedDate'] = test.markedDate;
        checksByTestGroupedByIdent[test.id]['markedAs'] = test.markedAs;
        checksByTestGroupedByIdent[test.id]['name'] = test.name;
        checksByTestGroupedByIdent[test.id]['status'] = test.status;
        checksByTestGroupedByIdent[test.id]['browserName'] = test.browserName;
        checksByTestGroupedByIdent[test.id]['browserVersion'] = test.browserVersion;
        checksByTestGroupedByIdent[test.id]['browserFullVersion'] = test.browserFullVersion;
        checksByTestGroupedByIdent[test.id]['viewport'] = test.viewport;
        checksByTestGroupedByIdent[test.id]['calculatedViewport'] = test.calculatedViewport;
        checksByTestGroupedByIdent[test.id]['os'] = test.os;
        checksByTestGroupedByIdent[test.id]['blinking'] = test.blinking;
        checksByTestGroupedByIdent[test.id]['updatedDate'] = test.updatedDate;
        checksByTestGroupedByIdent[test.id]['createdDate'] = test.createdDate;
        checksByTestGroupedByIdent[test.id]['suite'] = test.suite;
        checksByTestGroupedByIdent[test.id]['run'] = test.run;
        checksByTestGroupedByIdent[test.id]['tags'] = test.tags;
        checksByTestGroupedByIdent[test.id]['branch'] = test.branch;
        checksByTestGroupedByIdent[test.id]['app'] = test.app;
    }
    // console.log(Object.keys(checksByTestGroupedByIdent).length);
    res.status(200)
        .json(checksByTestGroupedByIdent);
};

exports.getCheck = async function (req, res) {
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        log.debug(`get check with id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, {
                msgType: 'GET',
                itemType: 'check',
                scope: 'getCheck',
            });
        const snp = await Check.findById(id)
            .exec();

        res.json(snp);
    } catch (e) {
        fatalError(req, res, e);
    }
};

function addMarkedAsOptions(opts, user, mark) {
    opts.markedById = user._id;
    opts.markedByUsername = user.username;
    opts.markedDate = new Date();
    opts.markedAs = mark;
    return opts;
}

exports.updateCheck = async function updateCheck(req, res) {
    let opts = removeEmptyProperties(req.body);
    const checkId = req.params.id;
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'check',
        ref: checkId,
        user: req?.user?.username,
        scope: 'updateCheck',
    };
    try {
        const check = await Check.findById(checkId)
            .exec();
        const test = await Test.findById(check.test)
            .exec();

        if (opts.accept === 'true') {
            log.debug(`ACCEPT check: ${checkId}`, $this, logOpts);
            opts = addMarkedAsOptions(opts, req.user, 'accepted');
        } else {
            await test.updateOne({
                status: 'Running',
                updatedDate: new Date(),
                // .format('YYYY-MM-DD hh:mm'),
            })
                .exec();
        }
        delete opts.id;
        delete opts.accept;
        // await Check.findByIdAndUpdate(check._id, opts);
        Object.assign(check, opts);
        log.debug({ NEW_BASELINE_OPTS: check.toObject() }, $this, logOpts);
        await createNewBaseline(check.toObject());
        await check.save();
        const testCalculatedStatus = await calculateTestStatus(check.test);
        const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

        opts['updatedDate'] = Date.now();

        log.debug(`update check id: '${checkId}' with params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, logOpts);

        test.status = testCalculatedStatus;
        test.markedAs = testCalculatedAcceptedStatus;
        test.updatedDate = new Date();

        await orm.updateItemDate('VRSSuite', check.suite);
        log.debug(`update test with status: '${testCalculatedStatus}', marked: '${testCalculatedAcceptedStatus}'`, $this,
            {
                msgType: 'UPDATE',
                itemType: 'test',
                ref: test._id,
            });
        await test.save();
        await check.save();
        log.debug(`check with id: '${checkId}' was updated`, $this, logOpts);

        res.status(200)
            .json({
                message: `Check with id: '${checkId}' was updated`,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getBaselines = (req, res) => {
    Baseline.find()
        .then((baselines) => {
            res.json(baselines);
        });
};

async function isLastLinkToSnapshoot(id) {
    const baselines = await Check.find({ baselineId: id });
    const actuals = await Check.find({ actualSnapshotId: id });

    // console.log({ BL: baselines.length });
    // console.log({ AL: actuals.length });
    if (!baselines && !actuals) return false;
    return (baselines.length === 0) && (actuals.length === 0);
}

const removeSnapshotFile = async (snapshoot, allChecksIds) => {
    log.debug(`find all snapshots with same filename`, $this);
    const snapshoots = await Snapshot.find({ filename: snapshoot.filename });
    // eslint-disable-next-line arrow-body-style
    const isLastSnapshotFile = () => {
        return (snapshoots.length === 0)
            || (
                (snapshoots.length === 1)
                && (Object.values(allChecksIds)
                    .includes(snapshoots[0]?._id?.toString()))
            );
    };
    if (isLastSnapshotFile()) {
        const path = snapshoot.filename ? `${config.defaultBaselinePath}${snapshoot.id}.png` : `${config.defaultBaselinePath}${snapshoot.id}.png`;
        if (fss.existsSync(path)) {
            log.debug(`remove file: '${path}'`, $this, {
                msgType: 'REMOVE',
                itemType: 'file',
            });
            fss.unlinkSync(path);
        }
    }
    log.debug(`there is '${snapshoots.length}' snapshots with such filename`, $this);
};

const removeSnapshot = async (snapshotName, allCheckIds) => {
    const id = allCheckIds[snapshotName];
    const logOpts = {
        scope: 'removeSnapshot',
        msgType: 'REMOVE',
        itemType: 'snapshot',
        ref: id,
    };
    log.info(`delete snapshot with id: '${id}'`, $this, logOpts);
    log.debug(`check if the snapshot:'${id}' is baseline`, $this, logOpts);
    if (!id) {
        log.warn('id is empty');
        return;
    }
    const snapshot = await Snapshot.findById(id);

    if (snapshot === null) {
        log.info(`cannot find the snapshot with id: '${id}'`);
        return;
    }

    const baselines = await Baseline.find({ snapshootId: id })
        .sort({ createdDate: -1 });
    if (baselines.length > 0) {
        // remove snapshot and baselines
        if (baselines[0].markedAs === undefined && (await isLastLinkToSnapshoot(id))) {
            await Snapshot.findByIdAndDelete(id);

            await Baseline.deleteMany({ snapshootId: id });
            log.debug(`snapshot: '${id}' and related baselines was removed because it was last unaccepted snapshot`);
            log.debug(`try to remove snapshot file, id: '${snapshot._id}', filename: '${snapshot.filename}'`);
            await removeSnapshotFile(snapshot, allCheckIds);
        } else {
            log.debug(`cannot remove the snapshot because it is accepted or not last baseline`);
            return;
        }
    }

    log.debug(`snapshot: '${id}' is not a baseline, try to remove it`, $this, logOpts);
    await Snapshot.findByIdAndDelete(id);
    log.debug(`snapshot: '${id}' was removed`, $this, logOpts);
    log.debug(`try to remove snapshot file, id: '${snapshot._id}', filename: '${snapshot.filename}'`, $this, logOpts);
    await removeSnapshotFile(snapshot, allCheckIds);
};

exports.removeCheck = function (req, res) {
    const { id } = req.params;
    log.info(`DELETE CHECK, id: '${id}', user: '${req.user.username}', params: '${JSON.stringify(req.params)}'`);
    removeCheck(id)
        .then(() => {
            res.status(200)
                .json({ message: `check with id: '${id}' was removed` });
        })
        .catch((e) => {
            fatalError(req, res, e);
        });
};

exports.getTestById = async function (req, res) {
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        log.debug(`get test with id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, {
                msgType: 'GET',
                itemType: 'test',
            });
        await Test.findById(id)
            .then(async (snp) => {
                res.json(snp);
            })
            .catch(
                (err) => {
                    res.status(400)
                        .send(`Cannot GET a test with id: '${id}', error: ${err}`);
                }
            );
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getCheckHistory = async function (req, res) {
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        log.debug(`get check history, id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, {
                msgType: 'GET_HISTORY',
                itemType: 'check',
            });
        const check = await Check.findById(id);
        if (!check) {
            throw new Error(`Cannot find check with id: ${id}`);
        }
        const checkLogs = await Log.find({
            $or: [
                { 'meta.ref': check._id.toString() },
                { 'meta.ref': check.suite.toString() },
                { 'meta.ref': check.test.toString() },
                { 'meta.ref': check.run.toString() },
                { 'meta.ref': check.baselineId.toString() },
                { 'meta.ref': check.actualSnapshotId.toString() },
            ],
        });

        res.json(checkLogs);
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.stopSession = async function (req, res) {
    const testId = req.params.testid;
    const logOpts = {
        msgType: 'END_SESSION',
        itemType: 'test',
        scope: 'stopSession',
        ref: testId,
    };
    try {
        if (!testId || testId === 'undefined') {
            return fatalError(req, res, 'Cannot stop test Session testId is empty');
        }
        await waitUntil(async () => (await Check.find({ test: testId })
            .exec())
            .filter((ch) => ch.status.toString() !== 'pending').length > 0);
        const checksGroup = await checksGroupedByIdent({ test: testId });
        const groupStatuses = Object.keys(checksGroup)
            .map((group) => checksGroup[group].status);
        // console.log(JSON.stringify(checksGroup, null, "\t"));
        const groupViewPorts = Object.keys(checksGroup)
            .map((group) => checksGroup[group].viewport);
        // console.log({groupViewPorts});
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
        log.info(`the session is over, the test will be updated with parameters: '${JSON.stringify(testParams)}'`,
            $this, logOpts);
        const updatedTest = await updateTest(testParams);
        const result = updatedTest.toObject();
        result.calculatedStatus = testStatus;
        res.json(result);
        return result;
    } catch (e) {
        fatalError(req, res, e);
    }
};

// TESTABILITY
exports.checksByFilter = function (req, res) {
    log.debug(JSON.stringify(req.query, null, 2));
    if (Object.keys(req.query).length === 0) {
        res.status(400)
            .json({ error: 'the query is empty' });
    }
    Check.find(req.query)
        .limit(100)
        .then((result) => {
            res.json(result);
        });
};

exports.testsByFilter = function (req, res) {
    log.debug(JSON.stringify(req.query, null, 2));
    if (Object.keys(req.query).length === 0) {
        res.status(400)
            .json({ error: 'the query is empty' });
    }
    Test.find(req.query)
        .limit(100)
        .then((result) => {
            res.json(result);
        });
};

exports.getScreenshotList = function (req, res) {
    const files = fss.readdirSync(config.defaultBaselinePath);
    res.json(files);
};

// TASKS
exports.status = async function (req, res) {
    const count = await User.countDocuments();
    log.info(`server status: check users counts: ${count}`);
    // log.debug({ count });
    if (count > 1) {
        res.json({ alive: true });
        return;
    }
    res.json({ alive: false });
};

exports.loadTestUser = async function (req, res) {
    const logOpts = {
        itemType: 'user',
        msgType: 'LOAD',
        ref: 'Administrator',
    };
    if (process.env.TEST !== '1') {
        return res.json({ message: 'the feature works only in test mode' });
    }
    const testAdmin = await User.findOne({ username: 'Test' });
    if (!testAdmin) {
        log.info('create the test Administrator', $this, logOpts);
        const adminData = JSON.parse(fss.readFileSync('./lib/testAdmin.json'));
        const admin = await User.create(adminData);
        log.info(`test Administrator with id: '${admin._id}' was created`, $this, logOpts);
        res.json(admin);
        return admin;
    }

    log.info(`test admin is exists: ${JSON.stringify(testAdmin, null, 2)}`, $this, logOpts);
    res.json({ msg: `already exist '${testAdmin}'` });
};

function taskOutput(msg, res) {
    res.write(`${msg.toString()}\n`);
    log.debug(msg.toString(), $this);
}

exports.task_remove_empty_tests = async function (req, res) {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    res.write('- query all tests\n');
    log.debug('- query all tests\n', $this);

    Test.find({})
        .then((tests) => {
            res.write(`- all tests count: '${tests.length}'\n`);
            log.debug(`- all tests count: '${tests.length}'\n`, $this);
            res.write('- remove empty tests\n');
            log.debug('- remove empty tests\n', $this);

            let count = 0;
            Promise.all(tests.map((test) => {
                const checkFilter = { test: test.id };
                return checksGroupedByIdent(checkFilter)
                    .then((checkGroups) => {
                        if (Object.keys(checkGroups).length < 1) {
                            count += 1;
                            const targetToRemove = {
                                id: test._id,
                                name: test.name,
                            };
                            console.log({ targetToRemove });
                            res.write(`${JSON.stringify(targetToRemove)}\n`);

                            return Test.findByIdAndDelete(test._id,)
                                .then(() => targetToRemove);
                        }
                    });
            }))
                // eslint-disable-next-line no-unused-vars
                .then((x) => {
                    res.write(`- removed tests count: '${count}'\n`);
                    log.info(`- removed tests count: '${count}'\n`, $this);
                    res.write('- done\n');
                    log.info('- done\n', $this);
                    return res.end();
                });
        });
};

exports.task_remove_empty_runs = async function (req, res) {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    res.write('- query all runs\n');
    log.info('- query all runs\n', $this);

    Run.find({})
        .then((runs) => {
            res.write(`- all runs count: '${runs.length}'\n`);
            log.info(`- all runs count: '${runs.length}'\n`, $this);
            res.write('- remove empty runs\n');
            log.info('- remove empty runs\n', $this);

            let count = 0;
            Promise.all(runs.map((run) => {
                const checkFilter = { run: run.id };
                return checksGroupedByIdent(checkFilter)
                    .then((checkGroups) => {
                        if (Object.keys(checkGroups).length < 1) {
                            count += 1;
                            const targetToRemove = {
                                id: run._id,
                                name: run.name,
                            };
                            console.log({ targetToRemove });
                            res.write(`${JSON.stringify(targetToRemove)}\n`);

                            return Run.findByIdAndDelete(run.id,)
                                .then(() => targetToRemove);
                        }
                    });
            }))
                .then(() => {
                    res.write(`- removed runs count: '${count}'\n`);
                    log.info(`- removed runs count: '${count}'\n`, $this);
                    res.write('- done\n');
                    log.info('- done\n', $this);
                    res.end();
                });
        });
};

exports.task_remove_old_tests = async function (req, res) {
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });
    const trashHoldDate = subDays(new Date(), parseInt(req.query.days, 10));
    taskOutput(
        `- will remove all tests older that: '${req.query.days}' days,`
        + ` '${format(trashHoldDate, 'yyyy-MM-dd')}'\n`,
        res
    );

    const oldTestsCount = await Test.find({ startDate: { $lt: trashHoldDate } })
        .countDocuments();
    const oldTests = await Test.find({ startDate: { $lt: trashHoldDate } });
    taskOutput(`- the count of documents is: '${oldTestsCount}'\n`, res);
    oldTests.forEach((test) => {
        taskOutput(`{\n\tid: ${test._id},\n\tname: ${test.name},\n\tdate:${test.startDate}\n}`, res);
        removeTest(test._id);
    });

    res.end();
};

// const fixDocumentsTypes = async function (req, res) {
//
// };
//
// exports.fixDocumentsTypes = fixDocumentsTypes;

exports.task_migration_1_1_0 = async function (req, res) {
    if (req.user.role !== 'admin') {
        res.status(401)
            .json({ error: 'You need to have \'admin\' role to access the page' });
        return;
    }
    // this header to response with chunks data
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    });

    const checks = await Check.find({});
    const tests = await Test.find({});
    const snapshoots = await Snapshot.find({});
    res.write('\n0. Resync indexes\n');

    await Check.syncIndexes();
    log.info('Check');
    res.write('\nCheck\n');

    await Test.syncIndexes();
    log.info('Test');
    res.write('\nTest\n');

    await Snapshot.syncIndexes();
    log.info('Snapshot');
    res.write('\nSnapshot\n');
    await Run.syncIndexes();
    log.info('Run');
    res.write('\nRun\n');
    await User.syncIndexes();
    log.info('User');
    res.write('\nUser\n');
    await Baseline.syncIndexes();
    log.info('Baseline');
    res.write('\nBaseline\n');
    await App.syncIndexes();
    log.info('App');
    res.write('\nApp\n');
    // await Log.syncIndexes();
    // log.info('Log');
    // res.write('\nLog\n');

    res.write('\n0. Update all check & tests to master branch\n');
    for (const check of checks) {
        check.branch = 'master';
        check.save();
    }
    for (const test of tests) {
        log.info(test.name);
        res.write(`${test.name}\n`);
        test.branch = 'master';
        test.save();
    }
    res.write('\n1. Fix empty diffs\n');
    for (const check of checks) {
        if (!check.diffId) {
            log.info({ DIFF: check.diffId });
            delete check.diffId;
            const tempCheck = check.toObject();
            await check.remove();
            delete tempCheck.diffId;
            Check.create(tempCheck);
        }
    }
    res.write('\n2. Fix docs types\n');
    for (const check of checks) {
        log.info({ check });
        res.write(`${JSON.stringify(check)}\n\n`);
        if (check.baselineId) (check.baselineId = mongoose.Types.ObjectId(check.baselineId));
        if (check.actualSnapshotId) (check.actualSnapshotId = mongoose.Types.ObjectId(check.actualSnapshotId));
        if (check.actualSnapshotId) (check.diffId = mongoose.Types.ObjectId(check.diffId));
        await check.save();
    }

    res.write(`\n2. Change 'The Test App' => 'HPE'`);
    const app = await orm.createAppIfNotExist({ name: 'HPE' });
    // const checks = await Check.find({});
    for (const check of checks) {
        check.app = app.id;
        check.save();
        res.write(`\n${check._id}`);
    }

    res.write('\n3. Fix undefined regions\n');
    for (const snp of snapshoots) {
        if ((snp.ignoreRegions === 'undefined') || (snp.boundRegions === 'undefined')) {
            log.info({ Snp: snp.name });
            res.write(`\n${snp.name}`);
            // delete snp.ignoreRegions;
            // delete snp.boundRegions;
            const tempSnp = snp.toObject();
            await snp.remove();
            delete tempSnp.ignoreRegions;
            delete tempSnp.boundRegions;
            Snapshot.create(tempSnp);
        }
    }
    res.end('\nDone\n');
};
