const httpStatus = require('http-status');
const passport = require('passport');
const hasha = require('hasha');
const uuidAPIKey = require('uuid-apikey');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');

function getApiKey() {
    return uuidAPIKey.create().apiKey;
}

const $this = this;
$this.logMeta = {
    scope: 'authentication',
    msgType: 'AUTHENTICATION',
};
// const { authService, userService, tokenService, emailService } = require('../services');

const apikey = catchAsync(async (req, res, next) => {
    const apiKey = getApiKey();
    log.debug(
        `generate API Key for user: '${req.user.username}'`,
        $this,
        { user: req.user.username, scope: 'apikey', msgType: 'GENERATE_API' }
    );
    const hash = hasha(apiKey);
    const user = await User.findOne({ username: req.user.username });
    user.apiKey = hash;
    await user.save();
    res.status(200)
        .json({ apikey: apiKey });
});

const login = catchAsync(async (req, res, next) => {
    const logOpts = {
        scope: 'login',
        msgType: 'AUTHENTICATION',
    };
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                log.error(`Authentication error: '${err}'`, this, logOpts);
                return res.status(httpStatus.UNAUTHORIZED)
                    .json({ message: 'authentication error' });
            }
            if (!user) {
                log.error(`Authentication error: '${info.message}'`, this, logOpts);
                return res.status(httpStatus.UNAUTHORIZED)
                    .json({ message: `Authentication error: '${info.message}'` });
            }

            req.logIn(user, (e) => {
                if (e) {
                    log.error(e.stack || e.toString());
                    return next(e);
                }
                log.info('user is logged in', this, { user: user.username });
                return res.status(200)
                    .json({ message: 'success' });
            });
        })(req, res, next);
});

const logout = catchAsync(async (req, res) => {
    const logOpts = {
        scope: 'logout',
        msgType: 'AUTHENTICATION',
    };
    try {
        log.debug(`try to log out user: '${req?.user?.username}'`, $this, logOpts);
        await req.logout(
            {},
            () => res.status(httpStatus.OK)
                .json({ message: 'success' })
        );
    } catch (e) {
        log.error(e.stack || e.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'fail' });
    }
});

const changePassword = catchAsync(async (req, res) => {
    const logOpts = {
        scope: 'changePassword',
        msgType: 'CHANGE_PASSWORD',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const {
        currentPassword,
        newPassword,
        // newPasswordConfirmation,
    } = req.body;

    const username = req?.user?.username;

    log.debug(`change password for '${username}', params: '${JSON.stringify(req.body)}'`, this, logOpts);

    const user = await User.findOne({ username });
    if (!user) {
        log.error('user is not logged in', this, logOpts);
        return res.status(httpStatus.UNAUTHORIZED)
            .json({ message: 'user is not logged in' });
    }

    try {
        await user.changePassword(currentPassword, newPassword);
    } catch (e) {
        log.error(e.stack || e.toString(), this, logOpts);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: e.toString() });
    }

    log.debug(`password was successfully changed for user: ${req.user.username}`, this, logOpts);
    return res.status(200)
        .json({ message: 'success' });
});

const changePasswordFirstRun = catchAsync(async (req, res) => {
    const logOpts = {
        scope: 'changePasswordFirstRun',
        msgType: 'CHANGE_PASSWORD_FIRST_RUN',
        itemType: 'user',
        ref: req?.user?.username,
    };

    const { newPassword } = req.body;

    if ((await global.AppSettings.isAuthEnabled()) && ((await global.AppSettings.isFirstRun()))) {
        log.debug(`first run, change password for default 'Administrator', params: '${JSON.stringify(req.body)}'`, $this, logOpts);
        const user = await User.findOne({ username: 'Administrator' })
            .exec();
        logOpts.ref = user?.username;

        await user.setPassword(newPassword);
        await user.save();
        log.debug('password was successfully changed for default Administrator', $this, logOpts);
        await global.AppSettings.set('first_run', false);
        return res.status(200)
            .json({ message: 'success' });
    }
    log.error(`trying to use first run API with no first run state, auth: '${await global.AppSettings.isAuthEnabled()}', `
        + `global settings: '${(await global.AppSettings.get('first_run'))}'`, $this, logOpts);
    return res.status(httpStatus.FORBIDDEN)
        .json({ message: 'forbidden' });
});

module.exports = {
    login,
    changePassword,
    changePasswordFirstRun,
    logout,
    apikey,
};
