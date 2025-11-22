import httpStatus from 'http-status';
import { ApiError, catchAsync, pick, deserializeIfJSON, paramsGuard } from '@utils';
import { clientService, genericService } from '@services';
import { updateItem } from '@lib/dbItems';
import { RequiredIdentOptionsSchema, RequiredIdentOptionsType, createCheckParamsSchema } from '@schemas';
import { Test, App, Suite } from '@models';
import { Response } from "express";
import log from "../lib/logger";
import { ExtRequest } from '@types';
import { ClientStartSessionType } from '../schemas/Client.schema';
import { CreateCheckParams } from '../../types/Check';

const startSession = catchAsync(async (req: ExtRequest, res: Response) => {
    const params = pick(
        req.body,
        ['name', 'status', 'app', 'tags', 'branch', 'viewport', 'browser', 'browserVersion', 'browserFullVersion',
            'os', 'run', 'runident', 'suite']
    ) as ClientStartSessionType;
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
    const params = req.body;
    paramsGuard(params, 'createCheck, params', createCheckParamsSchema);

    const currentUser = req.user;
    if (!currentUser) throw new ApiError(httpStatus.UNAUTHORIZED, 'cannot get current user by API');


    const logOpts = {
        scope: 'createCheck',
        user: currentUser.username,
        itemType: 'check',
        msgType: 'CREATE',
    };

    log.info(`start to create check: '${params.name}'`, logOpts);

    log.debug(`try to find test with id: '${params.testid}'`, logOpts);
    const test = await Test.findById(params.testid);
    if (!test) {
        const errMsg = `can't find test with id: '${params.testid}', `
            + `parameters: '${JSON.stringify(req.body)}', username: '${currentUser.username}'`;
        // res.status(400).send({ status: 'testNotFound', message: errMsg });
        throw new ApiError(httpStatus.NOT_FOUND, errMsg);
    }
    const app = await App.findOne({ name: params.appName });
    if (!app) throw new ApiError(httpStatus.NOT_FOUND, `cannot get the app: ${params.appName}`);
    const suite = await Suite.findOne({ name: params.suitename });
    if (!suite) throw new ApiError(httpStatus.NOT_FOUND, `cannot get the suite: ${params.suitename}`);

    const result = await clientService.createCheck(
        {
            branch: params.branch,
            hashCode: params.hashcode,
            // testId: params.testid,
            name: params.name,
            viewport: params.viewport,
            browserName: params.browserName,
            browserVersion: params.browserVersion,
            browserFullVersion: params.browserFullVersion,
            os: params.os,
            files: req.files,
            domDump: params.domdump,
            vShifting: params.vShifting,
        } as CreateCheckParams,
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
    ) as RequiredIdentOptionsType;
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
