const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { clientService } = require('../services');
const { pick } = require('../utils');
const orm = require('../../../lib/dbItems');
const { createItemIfNotExistAsync, createSuiteIfNotExist } = require('../../../lib/dbItems');
const prettyCheckParams = require('../utils/prettyCheckParams');

const User = mongoose.model('VRSUser');
const Test = mongoose.model('VRSTest');

const $this = this;
$this.logMeta = {
    scope: 'client_controller',
    msgType: 'API',
};

// exports.createCheck = async (req, res) => ;
const startSession = catchAsync(async (req, res) => {
    const params = pick(
        req.body,
        ['name', 'status', 'app', 'tags', 'branch', 'viewport', 'browser', 'browserVersion', 'browserFullVersion',
            'os', 'run', 'runident', 'suite']
    );
    const result = await clientService.startSession(params, req?.user?.username);
    res.send(result);
});

const endSession = catchAsync(async (req, res) => {
    const testId = req.params.testid;
    if (!testId || testId === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot stop test Session testId is empty');
    }

    const result = await clientService.endSession(testId, req?.user?.username);
    res.send(result);
});

const lackOfParamsGuard = (req, res) => {
    let errMsg = null;
    if (!req.body.testid) {
        errMsg = 'Cannot create check without \'testid\' parameter, '
            + `try to initialize the session at first. parameters: '${JSON.stringify(req.body)}'`;
    }
    if (!req.body.hashcode) {
        errMsg = `Cannot create check without 'hashcode' parameter, parameters: '${JSON.stringify(req.body)}'`;
    }

    if (!req.body.name) {
        errMsg = 'Cannot create check without check name parameter, '
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

const createCheck = catchAsync(async (req, res) => {
    lackOfParamsGuard(req, res);
    const logOpts = {
        scope: 'createCheck',
        user: req?.user?.username,
        itemType: 'check',
        msgType: 'CREATE',
    };
    const apiKey = req.headers.apikey;
    const currentUser = await User.findOne({ apiKey })
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

    const result = await clientService.createCheck(
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
});

const getIdent = catchAsync(async (req, res) => {
    const result = clientService.getIdent();
    res.send(result);
});

const checkIfScreenshotHasBaselines = catchAsync(async (req, res) => {
    const result = clientService.checkIfScreenshotHasBaselines(req.query);
    res.send(result);
});

module.exports = {
    startSession,
    endSession,
    createCheck,
    getIdent,
    checkIfScreenshotHasBaselines,
};
