import httpStatus from 'http-status';
import passport from 'passport';
import hasha from 'hasha';
import uuidAPIKey from 'uuid-apikey';
import { Response, NextFunction } from "express"
import { User } from '@models';
import { catchAsync, errMsg } from '@utils';
import log from "@logger";
import { RequestUser, ExtRequest } from '@types';
import { appSettings } from "@settings";

function getApiKey(): string {
    return uuidAPIKey.create().apiKey;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apikey = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        user: req?.user?.username || undefined,
        scope: 'apikey',
        msgType: 'GENERATE_API'
    };

    const apiKey = getApiKey();
    log.debug(
        `generate API Key for user: '${req.user?.username}'`,
        logOpts
    );
    const hash = hasha(apiKey);

    if (!req.user?.username) throw new Error(`Username is empty`);

    const user = await User.findOne({ username: req.user.username });
    if (!user) throw new Error(`cannot find the user with username: '${req.user.username}'`);

    user.apiKey = hash;
    await user!.save();
    res.status(200).json({ apikey: apiKey });
});

const login = catchAsync(async (req: ExtRequest, res: Response, next: NextFunction) => {
    const logOpts = {
        scope: 'login',
        msgType: 'AUTHENTICATION',
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate('local', (err: unknown, user: any, info: any) => {
        if (err) {
            log.error(`Authentication error: '${err}'`, logOpts);
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'authentication error' });
        }
        if (!user) {
            log.error(`Authentication error: '${info.message}'`, logOpts);
            return res.status(httpStatus.UNAUTHORIZED).json({ message: `Authentication error: '${info.message}'` });
        }

        req.logIn(user, (e: unknown) => {
            if (e) {
                log.error(e, logOpts);
                return next(e);
            }
            log.info('user is logged in', { user: user.username });
            return res.status(200).json({ message: 'success' });
        });
    })(req, res, next);
});

const logout = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        scope: 'logout',
        msgType: 'AUTHENTICATION',
    };
    try {
        log.debug(`try to log out user: '${req?.user?.username}'`, logOpts);
        await req.logout({}, () => res.status(httpStatus.OK).json({ message: 'success' }));
    } catch (e: unknown) {
        log.error(e, logOpts);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'fail' });
    }
});

const changePassword = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        scope: 'changePassword',
        msgType: 'CHANGE_PASSWORD',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const { currentPassword, newPassword } = req.body;

    const username = req?.user?.username;

    log.debug(`change password for '${username}', params: '${JSON.stringify(req.body)}'`, logOpts);

    const user: RequestUser | null = await User.findOne({ username });
    // if (!user) throw new Error(`cannot find user with username: ${username}`);

    if (!user) {
        log.error('user is not logged in', logOpts);
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'user is not logged in' });
    }

    try {
        await user.changePassword(currentPassword, newPassword);
    } catch (e: unknown) {
        log.error(e, logOpts);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: errMsg(e) });
    }

    log.debug(`password was successfully changed for user: ${req.user?.username}`, logOpts);
    return res.status(200).json({ message: 'success' });
});

const changePasswordFirstRun = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        scope: 'changePasswordFirstRun',
        msgType: 'CHANGE_PASSWORD_FIRST_RUN',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const { newPassword } = req.body;

    const AppSettings = await appSettings;

    if ((await AppSettings.isAuthEnabled()) && ((await AppSettings.isFirstRun()))) {
        log.debug(`first run, change password for default 'Administrator', params: '${JSON.stringify(req.body)}'`, logOpts);
        const user = await User.findOne({ username: 'Administrator' }).exec();
        if (!user) throw new Error(`cannot find the Administrator`);
        logOpts.ref = String(user?.username);
        await user.setPassword(newPassword);
        await user.save();
        log.debug('password was successfully changed for default Administrator', logOpts);
        await AppSettings.set('first_run', false);
        res.status(200).json({ message: 'success' });
    } else {
        log.error(`trying to use first run API with no first run state, auth: '${await AppSettings.isAuthEnabled()}', global settings: '${JSON.stringify(await AppSettings.get('first_run'))}'`, logOpts);
        res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
    }
});

export {
    login,
    changePassword,
    changePasswordFirstRun,
    logout,
    apikey,
};
