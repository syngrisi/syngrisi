import { HttpStatus } from '@utils';
import { catchAsync, deserializeIfJSON, pick } from '@utils';
import { appService } from '@services';
import { Request, Response } from "express"
import { config } from "@config";
import mongoose from 'mongoose';
import { env } from "@env";
import { AppSettings, App } from '../models';

const info = catchAsync(async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json({
        version: config.version,
        commitHash: config.commitHash,
        apiVersion: config.apiVersion,
        minSupportedSdkVersion: config.minSupportedSdkVersion,
    });
});

const systemInfo = catchAsync(async (req: Request, res: Response) => {
    const ssoEnabledSetting = await AppSettings.findOne({ name: 'sso_enabled' });
    const ssoProtocolSetting = await AppSettings.findOne({ name: 'sso_protocol' });

    const ssoEnabled = env.SSO_ENABLED || (ssoEnabledSetting?.value as unknown as string) === 'true';
    const ssoProtocol = env.SSO_PROTOCOL || (ssoProtocolSetting?.value as unknown as string) || '';

    let authType = 'local';
    if (ssoEnabled && ssoProtocol) {
        authType = ssoProtocol === 'saml' ? 'SSO (SAML)' : ssoProtocol === 'oauth2' ? 'SSO (OAuth2)' : `SSO (${ssoProtocol})`;
    }

    let mongoVersion = '';
    try {
        const admin = mongoose.connection.db?.admin();
        if (admin) {
            const serverInfo = await admin.serverInfo();
            mongoVersion = serverInfo.version;
        }
    } catch {
        mongoVersion = 'N/A';
    }

    res.status(HttpStatus.OK).json({
        version: config.version,
        commitHash: config.commitHash,
        nodeVersion: process.version,
        mongoVersion,
        authType,
        authEnabled: env.SYNGRISI_AUTH,
    });
});

const get = catchAsync(async (req: Request, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter)
        : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await appService.get(filter, options);
    res.send(result);
});

// Update per-project AI Triage config: enable switch, auto-accept policy, and/or custom verdicts.
const updateTriagePolicy = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const set: Record<string, unknown> = {};
    if (req.body.triageEnabled !== undefined) set.triageEnabled = req.body.triageEnabled === true || req.body.triageEnabled === 'true';
    if (req.body.triagePolicy !== undefined) set.triagePolicy = req.body.triagePolicy;
    if (req.body.triageVerdicts !== undefined) set.triageVerdicts = req.body.triageVerdicts;
    if (req.body.triagePrompt !== undefined) set.triagePrompt = req.body.triagePrompt;
    if (req.body.triageExamples !== undefined) set.triageExamples = req.body.triageExamples;
    if (req.body.changeSimGate !== undefined) set.changeSimGate = Number(req.body.changeSimGate);
    if (req.body.mainBranch !== undefined) set.mainBranch = req.body.mainBranch;
    const app = await App.findByIdAndUpdate(id, { $set: set }, { new: true }).exec();
    if (!app) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'App not found' });
        return;
    }
    res.json(app);
});

export {
    info,
    get,
    systemInfo,
    updateTriagePolicy,
};
