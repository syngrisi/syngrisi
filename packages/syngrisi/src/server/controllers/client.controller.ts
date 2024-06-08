import httpStatus from 'http-status';
import { ApiError, catchAsync, pick, deserializeIfJSON, prettyCheckParams, paramsGuard } from '@utils';
import { clientService, genericService } from '@services';
import { updateItem } from '@lib/dbItems';
import { RequiredIdentOptionsSchema, createCheckParamsSchema } from '@schemas';
import { User, Test, App, Suite } from '@models';
import { Response } from "express";
import log from "../lib/logger";
import { ExtRequest } from '@types';

const startSession = catchAsync(async (req: ExtRequest, res: Response) => {
    const params = pick(
        req.body,
        ['name', 'status', 'app', 'tags', 'branch', 'viewport', 'browser', 'browserVersion', 'browserFullVersion',
            'os', 'run', 'runident', 'suite']
    );
    const result = await clientService.startSession(params, String(req?.user?.username));
    res.send(result);
});

const endSession = catchAsync(async (req: ExtRequest, res: Response) => {
    const testId = req.params.testid;
    if (!testId || testId === 'undefined') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot stop test Session testId is empty');
    }

    const result = await clientService.endSession(testId, String(req?.user?.username));
    res.send(result);
});

const createCheck = catchAsync(async (req: ExtRequest, res: Response) => {
    const apiKey = req.headers.apikey;
    const params = req.body;
    paramsGuard(params, 'createCheck, params', createCheckParamsSchema);

    const logOpts = {
        scope: 'createCheck',
        user: req?.user?.username,
        itemType: 'check',
        msgType: 'CREATE',
    };

    const currentUser = await User.findOne({ apiKey }).exec();
    if (!currentUser) throw new Error(`cannot get current user`);


    log.info(`start create check: '${prettyCheckParams(params.name)}'`, logOpts);

    log.debug(`try to find test with id: '${params.testid}'`, logOpts);
    const test = await Test.findById(params.testid).exec();
    if (!test) {
        const errMsg = `can't find test with id: '${params.testid}', `
            + `parameters: '${JSON.stringify(req.body)}', username: '${currentUser.username}', apiKey: ${apiKey}`;
        res.status(400).send({ status: 'testNotFound', message: errMsg });
        throw new Error(errMsg);
    }
    const app = await App.findOne({ name: params.appName }).exec();
    const suite = await Suite.findOne({ name: params.suitename }).exec();
    if (!suite) throw new Error(`cannot get suite: ${params.suitename}`);


    await updateItem('VRSTest', { _id: test.id }, {
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
        res.status(206).json({
            status: 'requiredFileData',
            message: 'could not find a snapshot with such a hash code, please add image file data and resend request',
            hashCode: params.hashcode,
        });
        return;
    }
    res.json(result);
});

const getIdent = catchAsync(async (req: ExtRequest, res: Response) => {
    const result = clientService.getIdent();
    res.send(result);
});

const getBaselines = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = pick(
        (req.query.filter ? deserializeIfJSON(String(req.query.filter)) : {}),
        ['name', 'viewport', 'browserName', 'os', 'app', 'branch']
    );
    paramsGuard(filter, 'getBaseline, filter', RequiredIdentOptionsSchema);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await clientService.getBaselines(filter, options);
    res.send(result);
});

const getSnapshots = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = pick(
        (req.query.filter ? deserializeIfJSON(String(req.query.filter)) : {}),
        ['_id', 'name', 'imghash', 'createdDate', 'filename', 'id']
    );
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSSnapshot', filter, options);
    res.send(result);
});

export {
    startSession,
    endSession,
    createCheck,
    getIdent,
    getBaselines,
    getSnapshots,
};
