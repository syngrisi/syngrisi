import { HttpStatus } from '@utils';
import { catchAsync, deserializeIfJSON, pick } from '@utils';
import { appService } from '@services';
import { Request, Response } from "express"
import { config } from "@config";
import mongoose from 'mongoose';
import { env } from "@env";
import { AppSettings } from '../models';

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

export {
    info,
    get,
    systemInfo,
};
