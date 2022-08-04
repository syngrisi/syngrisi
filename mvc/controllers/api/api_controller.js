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
const { parseDiff } = require('../../../lib/parseDiff');
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
    checksGroupedByIdent2,
    calculateAcceptedStatus,
    ProgressBar,
} = require('../utils');
const {
    fatalError,
    waitUntil,
    removeEmptyProperties,
    buildQuery,
    buildIdentObject,
    ident,
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

exports.updateSnapshot = async (req, res) => {
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

exports.updateBaseline = async (req, res) => {
    const logOpts = {
        scope: 'updateBaseline',
        ref: req.id,
        itemType: 'baseline',
        msgType: 'UPDATE',
    };
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        // eslint-disable-next-line max-len
        log.debug(`start update baseline with id: '${id}', params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`, $this, logOpts);
        const baseline = await Baseline.findByIdAndUpdate(id, opts)
            .exec();
        await baseline.save();
        log.debug(`baseline with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`, $this, logOpts);
        res.status(200)
            .json({
                item: 'Baseline',
                action: 'update',
                id,
                opts,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.updateBaselineBySnapshotId = async (req, res) => {
    const logOpts = {
        scope: 'updateBaseline',
        ref: req.id,
        itemType: 'baseline',
        msgType: 'UPDATE',
    };
    try {
        const opts = removeEmptyProperties(req.body);
        const { id: snapshotId } = req.params;
        // eslint-disable-next-line max-len
        log.debug(`start update baseline with snapshot id: '${snapshotId}', params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`, $this, logOpts);
        const baseline = await Baseline.findOneAndUpdate({ snapshootId: snapshotId }, opts)
            .exec();
        await baseline.save();
        log.debug(`baseline with id: '${snapshotId}' and opts: '${JSON.stringify(opts)}' was updated`, $this, logOpts);
        res.status(200)
            .json({
                item: 'Baseline',
                action: 'update',
                snapshotId,
                opts,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getBaseline = async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(await Baseline.findById(req.params.id));
        if (!req.params.id) {
            return res.status(204)
                .json([]);
        }
        return res.json(await Baseline.findById(req.params.id));
    } catch (e) {
        log.error(`cannot get a snapshot with id: '${req.params.id}', error: ${e}`,
            $this,
            {
                scope: 'getSnapshot',
                msgType: 'GET',
            });
        return fatalError(req, res, e);
    }
};

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

const checksGroupByIdent = async (req, res) => {
    try {
        const testId = req.params.testid;
        res.json(await checksGroupedByIdent({ test: testId }));
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.checksGroupByIdent = checksGroupByIdent;

exports.affectedElements = async (req, res) => {
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

exports.createUser = async (req, res) => {
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

exports.getUsers = async (req, res) => {
    const users = await User.find()
        .exec();
    res.status(200)
        .json(users);
    return users;
};

const updateUser = async (req, res) => {
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

exports.removeUser = async (req, res) => {
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
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.firstRunAdminPassword = async (req, res) => {
    const params = req.body;
    const logOpts = {
        scope: 'firstRunAdminPassword',
        msgType: 'CHANGE PWD',
        itemType: 'administrator',
    };
    if (process.env.SYNGRISI_AUTH === '1' && (await global.appSettings.get('firstRun'))) {
        try {
            log.debug(`first run, change password for default 'Administrator', params: '${JSON.stringify(params)}'`, $this, logOpts);
            const user = await User.findOne({ username: 'Administrator' })
                .exec();
            await user.setPassword(params['new-password']);
            await user.save();
            log.debug('password was successfully changed for default Administrator', $this, logOpts);
            await global.appSettings.set('firstRun', false);
            res.redirect('/logout');
        } catch (e) {
            fatalError(req, res, e);
        }
    } else {
        res.status(403)
            .json({ error: 'Forbidden' });
    }
};

exports.changePassword = (req, res) => {
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

exports.updateTest = async (req, res) => {
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

exports.removeTest = async (req, res) => {
    try {
        const { id } = req.params;
        await testUtil.removeTest(id);
        res.status(200)
            .json({
                message: `Test with id: '${id}' and all related checks were removed`,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

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

        const run = await createItemIfNotExistAsync('VRSRun',
            {
                name: params.run,
                ident: params.runident,
            },
            { user: req?.user?.username, itemType: 'run' });
        opts.run = run.id;

        const app = await createItemIfNotExistAsync('VRSApp',
            {
                name: params.app,
            },
            { user: req?.user?.username, itemType: 'app' });
        opts.app = app.id;
        // console.log({ opts });
        const test = await orm.createTest(opts);

        res.json(test);
        return [req, res, test];
    } catch (e) {
        fatalError(req, res, e);
    }
    return null;
};

// suites
exports.removeSuite = async (req, res) => {
    const logOpts = {
        scope: 'removeSuite',
        user: req?.user?.username,
        itemType: 'suite',
        msgType: 'REMOVE',
    };
    const { id } = req.params;
    try {
        const suite = await Suite.findOne({ _id: id });
        log.info(`remove suite with name: '${suite.name}'`, $this, { ...logOpts, ...{ ref: id } });
        const tests = await Test.find({ suite: id });

        const results = [];
        for (const test of tests) {
            results.push(testUtil.removeTest(test._id));
        }

        await Promise.all(results);
        const out = await Suite.findByIdAndDelete(id);
        res.status(200)
            .send(`Suite with id: '${id}' and all related tests and checks were removed
                    output: '${JSON.stringify(out)}'`);
    } catch (e) {
        const errMsg = `cannot remove the suite with id: '${id}', error: '${e}'`;
        log.error(errMsg, $this, logOpts);
        throw new Error(errMsg);
    }
};

exports.removeRun = async (req, res) => {
    const logOpts = {
        scope: 'removeRun',
        user: req?.user?.username,
        itemType: 'run',
        msgType: 'REMOVE',
    };
    const { id } = req.params;
    try {
        const run = await Run.findOne({ _id: id });
        log.info(`delete run and checks which associate with the run: '${run.name}'`, $this, { ...logOpts, ...{ ref: id } });
        const tests = await Test.find({ run: id });

        const results = [];
        for (const test of tests) {
            results.push(testUtil.removeTest(test._id));
        }
        await Promise.all(results);
        const out = await Run.findByIdAndDelete(id);
        res.status(200)
            .send(`Run with id: '${id}' and all related tests and checks were removed
                    output: '${JSON.stringify(out)}'`);
    } catch (e) {
        const errMsg = `cannot remove the run with id: '${id}', error: '${e}'`;
        log.error(errMsg, $this, logOpts);
        throw new Error(errMsg);
    }
};

// checks
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
        test.save();
        check.save();
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
    const sameBaseline = await Baseline.findOne({ ...identFields, ...{ snapshootId: params.actualSnapshotId } })
        .exec();

    if (sameBaseline) {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} already exist`, $this);
    } else {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} does not exist, create new one`, $this);
    }

    log.silly({ sameBaseline });

    const resultedBaseline = sameBaseline || await Baseline.create(identFields);

    resultedBaseline.markedAs = params.markedAs;
    resultedBaseline.markedById = params.markedById;
    resultedBaseline.markedByUsername = params.markedByUsername;
    resultedBaseline.lastMarkedDate = params.markedDate;
    resultedBaseline.createdDate = new Date();
    resultedBaseline.snapshootId = params.actualSnapshotId;

    return resultedBaseline.save();
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
                const diffSnapshot = await createSnapshot({
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
    return {
        ...savedCheck.toObject(),
        executeTime: totalCheckHandleTime,
        lastSuccess: lastSuccessCheck ? (lastSuccessCheck).id : null,
    };
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
        const suite = await createItemIfNotExistAsync('VRSSuite',
            { name: req.body.suitename || 'Others' },
            { user: currentUser?.username, itemType: 'suite' });

        // const suite = await orm.createSuiteIfNotExist({ name: req.body.suitename || 'Others' });

        await orm.updateItem('VRSTest', { _id: test.id }, {
            suite: suite.id,
            creatorId: currentUser._id,
            creatorUsername: currentUser.username,
        });

        const app = await createItemIfNotExistAsync('VRSApp',
            { name: req.body.appName || 'Unknown' },
            { user: currentUser.username, itemType: 'app' });

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

exports.getChecks2 = async (req, res) => {
    const opts = req.query;

    const pageSize = parseInt(process.env['SYNGRISI_PAGINATION_SIZE'], 10) || 50;

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
        if (Object.keys(groups).length > 0) {
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
    }
    // console.log(Object.keys(checksByTestGroupedByIdent).length);
    res.status(200)
        .json(checksByTestGroupedByIdent);
};

exports.getChecks = async (req, res) => {
    const opts = req.query;

    const pageSize = parseInt(process.env['SYNGRISI_PAGINATION_SIZE'], 10) || 50;

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
    const checksByTestGroupedByIdent = {};

    for (const test of tests) {
        const checkFilter = { test: test.id };
        const groups = await checksGroupedByIdent(checkFilter);
        // console.log(groups.length);
        if (Object.keys(groups).length > 0) {
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
            checksByTestGroupedByIdent[test.id]['platform'] = global.devices.filter((x) => x.device === test.os)[0]?.os || test.os;
            checksByTestGroupedByIdent[test.id]['blinking'] = test.blinking;
            checksByTestGroupedByIdent[test.id]['updatedDate'] = test.updatedDate;
            checksByTestGroupedByIdent[test.id]['createdDate'] = test.createdDate;
            checksByTestGroupedByIdent[test.id]['suite'] = test.suite;
            checksByTestGroupedByIdent[test.id]['run'] = test.run;
            checksByTestGroupedByIdent[test.id]['tags'] = test.tags;
            checksByTestGroupedByIdent[test.id]['branch'] = test.branch;
            checksByTestGroupedByIdent[test.id]['app'] = test.app;
        }
    }
    // console.log(Object.keys(checksByTestGroupedByIdent).length);
    res.status(200)
        .json(checksByTestGroupedByIdent);
};

exports.getCheck = async (req, res) => {
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        log.debug(`get check with id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, {
                msgType: 'GET',
                itemType: 'check',
                scope: 'getCheck',
            });
        const check = await Check.findById(id)
            .exec();

        res.json(check);
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getIdent = async (req, res) => {
    res.json(ident);
};

exports.getRun = async (req, res) => {
    try {
        const opts = removeEmptyProperties(req.body);
        const { id } = req.params;
        log.debug(`get run with id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`,
            $this, {
                msgType: 'GET',
                itemType: 'run',
                scope: 'getRun',
            });
        const run = await Run.findById(id)
            .exec();

        res.json(run);
    } catch (e) {
        fatalError(req, res, e);
    }
};

function addMarkedAsOptions(params, user, mark) {
    const opts = { ...params };
    opts.markedById = user._id;
    opts.markedByUsername = user.username;
    opts.markedDate = new Date();
    opts.markedAs = mark;
    return opts;
}

exports.acceptCheck = async function acceptCheck(req, res) {
    const checkId = req.params.id;
    const logOpts = {
        msgType: 'ACCEPT',
        itemType: 'check',
        ref: checkId,
        user: req?.user?.username,
        scope: 'acceptCheck',
    };
    try {
        log.debug(`accept check: ${checkId}`, $this, logOpts);
        const check = await Check.findById(checkId)
            .exec();
        const test = await Test.findById(check.test)
            .exec();

        /** update check */
        let opts = removeEmptyProperties(req.body);
        if (!opts.baselineId) {
            const errMsg = `fail to accept check with id: '${checkId}' - the baselineId is empty`;
            log.error(errMsg);
            res.status(400)
                .json({
                    message: errMsg,
                });
            return;
        }
        opts = addMarkedAsOptions(opts, req.user, 'accepted');
        opts.status = (check.status[0] === 'new') ? 'new' : 'passed';
        opts['updatedDate'] = Date.now();

        log.debug(`update check id: '${checkId}' with opts: '${JSON.stringify(opts)}'`,
            $this, logOpts);

        Object.assign(check, opts);
        log.debug(`update check with options: '${JSON.stringify(check.toObject())}'`, $this, logOpts);

        await createNewBaseline(check.toObject());
        await check.save();

        /** update test statuses and date, suite date */
        const testCalculatedStatus = await testUtil.calculateTestStatus(check.test);
        const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

        test.status = testCalculatedStatus;
        test.markedAs = testCalculatedAcceptedStatus;
        test.updatedDate = new Date();

        await orm.updateItemDate('VRSSuite', check.suite);
        log.debug(`update test with status: '${testCalculatedStatus}', marked: '${testCalculatedAcceptedStatus}'`,
            $this,
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
                message: `check with id: '${checkId}' was accepted`,
            });
    } catch (e) {
        fatalError(req, res, e);
    }
};

exports.getBaselines = (req, res) => {
    Baseline.find(req.query)
        .then((baselines) => {
            res.json(baselines);
        });
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

exports.removeCheck = async (req, res) => {
    const { id } = req.params;
    const logOpts = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        msgType: 'REMOVE',
    };
    try {
        log.info(`remove check with, id: '${id}', user: '${req.user.username}', params: '${JSON.stringify(req.params)}'`, $this, logOpts);
        await checkUtil.removeCheck(id);
        res.status(200)
            .json({ message: `check with id: '${id}' was removed` });
    } catch (e) {
        log.error(`cannot remove the check with id: '${id}', error: '${e}'`, $this, logOpts);
        fatalError(req, res, e);
    }
};

exports.getTestById = async (req, res) => {
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

exports.getCheckHistory = async (req, res) => {
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
exports.checksByFilter = (req, res) => {
    log.debug(JSON.stringify(req.query, null, 2));
    if (Object.keys(req.query).length === 0) {
        res.status(400)
            .json({ error: 'the query is empty' });
    }
    Check.find(req.query)
        // .limit(100)
        .then((result) => {
            res.json(result);
        });
};

exports.shapshotsByFilter = (req, res) => {
    log.debug(JSON.stringify(req.query, null, 2));
    if (Object.keys(req.query).length === 0) {
        res.status(400)
            .json({ error: 'the query is empty' });
    }
    Snapshot.find(req.query)
        .then((result) => {
            res.json(result);
        });
};

exports.testsByFilter = (req, res) => {
    log.debug(JSON.stringify(req.query, null, 2));
    if (Object.keys(req.query).length === 0) {
        res.status(400)
            .json({ error: 'the query is empty' });
    }
    Test.find(req.query)
        .then((result) => {
            res.json(result);
        });
};

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
            .exec();
        taskOutput('> get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
            .exec();
        taskOutput('> get files data', res);
        const allFilesBefore = (await fs.readdir(config.defaultBaselinePath, { withFileTypes: true }))
            .filter((item) => !item.isDirectory())
            .map(((x) => x.name))
            .filter((x) => x.includes('.png'));

        taskOutput('> get old checks data', res);
        const oldChecks = await Check.find({ createdDate: { $lt: trashHoldDate } });

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
        const oldSnapshots = await Snapshot.find({ _id: { $in: allOldSnapshotsUniqueIds } });

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

        if (req.query.remove) {
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
                .exec();
            taskOutput('> get snapshots data', res);
            const allSnapshotsAfter = await Snapshot.find()
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
            .exec();
        taskOutput('get checks data', res);
        const allChecksBefore = await Check.find()
            .exec();
        taskOutput('get snapshots data', res);
        const allSnapshotsBefore = await Snapshot.find()
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
                abandonedChecks.push(check);
            }
        }

        taskOutput(`> calculate empty tests`, res);
        const checksUniqueTests = (await Check.find()
            .distinct('test')
            .exec()).map((x) => x.valueOf());

        const emptyTests = [];

        // eslint-disable-next-line no-restricted-syntax,no-unused-vars
        for (const [index, test] of allTestsBefore.entries()) {
            if (!checksUniqueTests.includes(test._id.valueOf())) {
                emptyTests.push(test);
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
                emptyRuns.push(run);
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
                emptySuites.push(suite);
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
            await Promise.all(emptySuites.map((x) => x.delete()));
            taskOutput(`> remove empty runs`, res);
            await Promise.all(emptyRuns.map((x) => x.delete()));
            taskOutput(`> remove empty tests`, res);
            await Promise.all(emptyTests.map((x) => x.delete()));
            taskOutput(`> remove abandoned snapshots`, res);
            await Promise.all(abandonedSnapshots.map((x) => x.delete()));
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
                    { item: 'suites', count: (await Suite.find()).length },
                    { item: 'runs', count: (await Run.find()).length },
                    { item: 'tests', count: (await Test.find()).length },
                    { item: 'checks', count: (await Check.find()).length },
                    { item: 'snapshots', count: (await Snapshot.find()).length },
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
    if (!req.query.statistics) {
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
