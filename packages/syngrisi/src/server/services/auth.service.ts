import { hashSync, generateApiKey as createApiKey } from '@utils/hash';
import { User } from '@models';
import log from "../lib/logger";
import { RequestUser } from '@types';
import { ApiError, errMsg } from '@utils';
import { appSettings } from "@settings";
import { HttpStatus } from '@utils';

function getApiKey(): string {
    return createApiKey();
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
    const hash = hashSync(apiKey);

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

    log.debug(`change password for '${username}'`, logOpts);

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

    const AppSettings = appSettings;

    if ((await AppSettings.isAuthEnabled()) && ((await AppSettings.isFirstRun()))) {
        log.debug(`first run, change password for default 'Administrator'`, logOpts);
        const user = await User.findOne({ username: 'Administrator' }).exec();

        if (!user) throw new ApiError(HttpStatus.NOT_FOUND, `cannot change password at first run, user withusername: 'Administrator', not found`);

        logOpts.ref = String(user?.username);

        await user.setPassword(newPassword);
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
