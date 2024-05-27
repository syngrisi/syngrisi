/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import passport from 'passport';
import hasha from 'hasha';
import uuidAPIKey from 'uuid-apikey';
import { User } from '../models';
import { catchAsync } from '../utils';
import log from "../lib/logger";

function getApiKey(): string {
    return uuidAPIKey.create().apiKey;
}

const fileLogMeta = {
    scope: 'authentication',
    msgType: 'AUTHENTICATION',
};

type UserType = {
    changePassword: (currentPasswor: string, newPassword: string) => void,
    apiKey: string,
    username: string,
    save: () => void,
    setPassword: (newPassword: string) => void,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apikey = catchAsync(async (req: any, res: any, next: any) => {
    const apiKey = getApiKey();
    log.debug(
        `generate API Key for user: '${req.user.username}'`,
        fileLogMeta,
        { user: req.user.username, scope: 'apikey', msgType: 'GENERATE_API' }
    );
    const hash = hasha(apiKey);

    const user: UserType | null = await User.findOne({ username: req.user.username });
    user!.apiKey = hash;
    await user!.save();
    res.status(200).json({ apikey: apiKey });
});

const login = catchAsync(async (req: any, res: any, next: any) => {
    const logOpts = {
        scope: 'login',
        msgType: 'AUTHENTICATION',
    };
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
            log.error(`Authentication error: '${err}'`, this, logOpts);
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'authentication error' });
        }
        if (!user) {
            log.error(`Authentication error: '${info.message}'`, this, logOpts);
            return res.status(httpStatus.UNAUTHORIZED).json({ message: `Authentication error: '${info.message}'` });
        }

        req.logIn(user, (e: any) => {
            if (e) {
                log.error(e.stack || e.toString());
                return next(e);
            }
            log.info('user is logged in', this, { user: user.username });
            return res.status(200).json({ message: 'success' });
        });
    })(req, res, next);
});

const logout = catchAsync(async (req: any, res: any) => {
    const logOpts = {
        scope: 'logout',
        msgType: 'AUTHENTICATION',
    };
    try {
        log.debug(`try to log out user: '${req?.user?.username}'`, fileLogMeta, logOpts);
        await req.logout({}, () => res.status(httpStatus.OK).json({ message: 'success' }));
    } catch (e: any) {
        log.error(e.stack || e.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'fail' });
    }
});

const changePassword = catchAsync(async (req: any, res: any) => {
    const logOpts = {
        scope: 'changePassword',
        msgType: 'CHANGE_PASSWORD',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const { currentPassword, newPassword } = req.body;

    const username = req?.user?.username;

    log.debug(`change password for '${username}', params: '${JSON.stringify(req.body)}'`, this, logOpts);

    const user: UserType | null = await User.findOne({ username });
    if (!user) {
        log.error('user is not logged in', this, logOpts);
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'user is not logged in' });
    }

    try {
        await user.changePassword(currentPassword, newPassword);
    } catch (e: any) {
        log.error(e.stack || e.toString(), this, logOpts);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.toString() });
    }

    log.debug(`password was successfully changed for user: ${req.user.username}`, this, logOpts);
    return res.status(200).json({ message: 'success' });
});

const changePasswordFirstRun = catchAsync(async (req: any, res: any) => {
    const logOpts = {
        scope: 'changePasswordFirstRun',
        msgType: 'CHANGE_PASSWORD_FIRST_RUN',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const { newPassword } = req.body;
    const AppSettings = (global as any).AppSettings;

    if ((await AppSettings.isAuthEnabled()) && ((await AppSettings.isFirstRun()))) {
        log.debug(`first run, change password for default 'Administrator', params: '${JSON.stringify(req.body)}'`, fileLogMeta, logOpts);
        const user = await User.findOne({ username: 'Administrator' }).exec();
        logOpts.ref = user?.username;

        // @ts-ignore
        await user.setPassword(newPassword);
        // @ts-ignore
        await user.save();
        log.debug('password was successfully changed for default Administrator', fileLogMeta, logOpts);
        await AppSettings.set('first_run', false);
        return res.status(200).json({ message: 'success' });
    }
    log.error(`trying to use first run API with no first run state, auth: '${await AppSettings.isAuthEnabled()}', global settings: '${(await AppSettings.get('first_run'))}'`, fileLogMeta, logOpts);
    return res.status(httpStatus.FORBIDDEN).json({ message: 'forbidden' });
});

export {
    login,
    changePassword,
    changePasswordFirstRun,
    logout,
    apikey,
};
