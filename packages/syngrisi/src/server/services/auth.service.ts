/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import hasha from 'hasha';
import uuidAPIKey from 'uuid-apikey';
import { User } from '../models';
import log from "../lib/logger";
import { RequestUser } from '../../types/RequestUser';
import { errMsg } from '../utils';
import { appSettings } from "../lib/AppSettings";

function getApiKey(): string {
    return uuidAPIKey.create().apiKey;
}

const generateApiKey = async (username: string): Promise<string> => {
    const logOpts = {
        user: username,
        scope: 'apikey',
        msgType: 'GENERATE_API'
    };

    const apiKey = getApiKey();
    log.debug(
        `generate API Key for user: '${username}'`,
        logOpts
    );
    const hash = hasha(apiKey);

    const user: RequestUser | null = await User.findOne({ username });
    if (!user) throw new Error(`cannot find the user with username: '${username}'`);

    user.apiKey = hash;
    await user.save();
    return apiKey;
};

const changeUserPassword = async (username: string, currentPassword: string, newPassword: string): Promise<void> => {
    const logOpts = {
        scope: 'changePassword',
        msgType: 'CHANGE_PASSWORD',
        itemType: 'user',
        ref: username,
    };

    log.debug(`change password for '${username}', params: '${JSON.stringify({ currentPassword, newPassword })}'`, logOpts);

    const user: RequestUser | null = await User.findOne({ username });
    if (!user) {
        log.error('user is not logged in', logOpts);
        throw new Error('user is not logged in');
    }

    try {
        await user.changePassword(currentPassword, newPassword);
    } catch (e: unknown) {
        log.error(e, logOpts);
        throw new Error(errMsg(e));
    }

    log.debug(`password was successfully changed for user: ${username}`, logOpts);
};

const changePasswordFirstRun = async (newPassword: string): Promise<void> => {
    const logOpts = {
        scope: 'changePasswordFirstRun',
        msgType: 'CHANGE_PASSWORD_FIRST_RUN',
        itemType: 'user',
        ref: 'Administrator',
    };

    const AppSettings = await appSettings;

    if ((await AppSettings.isAuthEnabled()) && ((await AppSettings.isFirstRun()))) {
        log.debug(`first run, change password for default 'Administrator', params: '${JSON.stringify({ newPassword })}'`, logOpts);
        const user = await User.findOne({ username: 'Administrator' }).exec();
        logOpts.ref = String(user?.username);

        // @ts-ignore
        await user.setPassword(newPassword);
        // @ts-ignore
        await user.save();
        log.debug('password was successfully changed for default Administrator', logOpts);
        await AppSettings.set('first_run', false);
    } else {
        log.error(`trying to use first run API with no first run state, auth: '${await AppSettings.isAuthEnabled()}', global settings: '${(await AppSettings.get('first_run'))}'`, logOpts);
        throw new Error('forbidden');
    }
};

export {
    generateApiKey,
    changeUserPassword,
    changePasswordFirstRun,
};