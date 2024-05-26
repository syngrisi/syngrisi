const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { clientService, genericService } = require('../services');
const { pick, deserializeIfJSON } = require('../utils');
const orm = require('../lib/dbItems');
const { prettyCheckParams } = require('../utils');
const { paramsGuard } = require('../../../dist/src/server/utils/paramsGuard');
const { RequiredIdentOptionsSchema } = require('../../../dist/src/server/schemas/getBaseline.shema');

const { User, Test, App, Suite } = require('../models');
const { createCheckParamsSchema } = require('../../../dist/src/server/schemas/createCheck.shema');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
    scope: 'client_controller',
    msgType: 'API',
};

// exports.createCheck = async (req, res) => ;
const startSession = catchAsync(async (req, res, next) => {
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

// const lackOfParamsGuard = (req, res) => {
//     let errMsg = null;
//     if (!req.body.testid) {
//         errMsg = 'Cannot create check without \'testid\' parameter, '
//             + `try to initialize the session at first. parameters: '${JSON.stringify(req.body)}'`;
//     }
//     if (!req.body.hashcode) {
//         errMsg = `Cannot create check without 'hashcode' parameter, parameters: '${JSON.stringify(req.body)}'`;
//     }
//
//     if (!req.body.name) {
//         errMsg = 'Cannot create check without check name parameter, '
//             + ` parameters: '${JSON.stringify(req.body)}'`;
//     }
//     if (errMsg) {
//         res.status(400)
//             .send({
//                 status: 'paramNotFound',
//                 message: errMsg,
//             });
//         throw new Error(errMsg);
//     }
// };

const createCheck = catchAsync(async (req, res) => {
    const apiKey = req.headers.apikey;
    const params = req.body;
    paramsGuard(params, 'createCheck, params', createCheckParamsSchema);

    const logOpts = {
        scope: 'createCheck',
        user: req?.user?.username,
        itemType: 'check',
        msgType: 'CREATE',
    };

    const currentUser = await User.findOne({ apiKey })
        .exec();

    log2.info(`start create check: '${prettyCheckParams(params.name)}'`, fileLogMeta, logOpts);

    /** look for or create test and suite */
    log2.debug(`try to find test with id: '${params.testid}'`, fileLogMeta, logOpts);
    const test = await Test.findById(params.testid)
        .exec();
    if (!test) {
        const errMsg = `can't find test with id: '${params.testid}', `
            + `parameters: '${JSON.stringify(req.body)}', username: '${currentUser.username}', apiKey: ${apiKey}`;
        res.status(400)
            .send({ status: 'testNotFound', message: errMsg });
        throw new Error(errMsg);
    }
    const app = await App.findOne({ name: params.appName }).exec();
    const suite = await Suite.findOne({ name: params.suitename }).exec();

    await orm.updateItem('VRSTest', { _id: test.id }, {
        suite: suite.id,
        creatorId: currentUser._id,
        creatorUsername: currentUser.username,
    });

    const result = await clientService.createCheck(
        {
            branch: params.branch,
            hashCode: params.hashcode,
            testId: params.testid,
            name: params.name,
            viewport: params.viewport,
            browserName: params.browserName,
            browserVersion: params.browserVersion,
            browserFullVersion: params.browserFullVersion,
            os: params.os,
            files: req.files,
            domDump: params.domdump,
            vShifting: params.vShifting,
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
                hashCode: params.hashcode,
            });
        return;
    }
    res.json(result);
});

const getIdent = catchAsync(async (req, res) => {
    const result = clientService.getIdent();
    res.send(result);
});
//
// const checkIfScreenshotHasBaselines = catchAsync(async (req, res) => {
//     const result = await clientService.checkIfScreenshotHasBaselines(req.query);
//     res.send(result);
// });

const getBaselines = catchAsync(async (req, res) => {
    const filter = pick(
        (req.query.filter ? deserializeIfJSON(req.query.filter) : {}),
        ['name', 'viewport', 'browserName', 'os', 'app', 'branch']
    );
    paramsGuard(filter, 'getBaseline, filter', RequiredIdentOptionsSchema);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await clientService.getBaselines(filter, options);
    res.send(result);
});

const getSnapshots = catchAsync(async (req, res) => {
    const filter = pick(
        (req.query.filter ? deserializeIfJSON(req.query.filter) : {}),
        ['_id', 'name', 'imghash', 'createdDate', 'filename', 'id']
    );
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSSnapshot', filter, options);
    res.send(result);
});

module.exports = {
    startSession,
    endSession,
    createCheck,
    getIdent,
    // checkIfScreenshotHasBaselines,
    getBaselines,
    getSnapshots,
};
