/**
 * Ensure that a user is logged in before proceeding to next route middleware.
 *
 * This middleware ensures that a user is logged in.  If a request is received
 * that is unauthenticated, the request will be redirected to a login page (by
 * default to `/login`).
 *
 * Additionally, `returnTo` will be be set in the session to the URL of the
 * current request.  After authentication, this value can be used to redirect
 * the user to the page that was originally requested.
 *
 * Options:
 *   - `redirectTo`   URL to redirect to for login, defaults to _/login_
 *   - `setReturnTo`  set redirectTo in session, defaults to _true_
 *
 * Examples:
 *
 *     app.get('/profile',
 *       ensureLoggedIn(),
 *       function(req, res) { ... });
 *
 *     app.get('/profile',
 *       ensureLoggedIn('/signin'),
 *       function(req, res) { ... });
 *
 *     app.get('/profile',
 *       ensureLoggedIn({ redirectTo: '/session/new', setReturnTo: false }),
 *       function(req, res) { ... });
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
const mongoose = require('mongoose');

const User = mongoose.model('VRSUser');
const $this = this;
$this.logMeta = {
    scope: 'Authentication',
    msgType: 'LOGIN',
};

// eslint-disable-next-line consistent-return
const handleBasicAuth = async (req) => {
    const logOpts = {
        scope: 'handleBasicAuth',
        msgType: 'AUTH_API',
    };

    const result = {
        type: 'error', // error, success, redirect
        status: 400,
        value: '',
        user: null,
    };

    if (req.isAuthenticated()) {
        return { type: 'success', status: 200 };
    }
    if (!(await global.AppSettings.isAuthEnabled())) {
        const guest = await User.findOne({ username: 'Guest' });
        // if (guest === null) {
        //     console.log(req.originalUrl);
        // }
        await req.logIn(guest, (err) => {
            if (err) {
                log.error(`cannot find quest user: '${err}'`, $this, logOpts);
                result.type = 'redirect';
                result.status = 301;
                result.value = `/auth?=Error: cannot find quest user: ${err}`;
            } else {
                result.type = 'success';
                result.status = 200;
                result.user = guest;
            }
        });
        return result;
    }

    if ((await global.AppSettings.isAuthEnabled())
        && ((await global.AppSettings.isFirstRun()))
        && process.env.SYNGRISI_DISABLE_FIRST_RUN !== '1'
    ) {
        log.info('first run, set admin password', $this, logOpts);
        result.type = 'redirect';
        result.status = 301;
        result.value = '/auth/change?first_run=true';
        return result;
    }

    if (await global.AppSettings.isAuthEnabled()) {
        log.info(`user is not authenticated - ${req.originalUrl}`, $this, logOpts);

        result.type = 'redirect';
        result.status = 301;

        if (req?.originalUrl !== '/') {
            result.value = `/auth?origin=${encodeURIComponent(req.originalUrl)}`;
            return result;
        }

        result.value = '/auth';
        return result;
    }
};

exports.ensureLoggedIn = function ensureLoggedIn() {
    // eslint-disable-next-line consistent-return
    return async (req, res, next) => {
        const result = await handleBasicAuth(req);
        // log.silly(result, {
        //     scope: 'ensureLoggedIn',
        //     msgType: 'AUTH_API',
        // }, $this);
        req.user = result.user || req.user;
        if (result.type === 'success') {
            return next();
        }
        res.status(result.status)
            .redirect(result.value);
        return next('redirect');
    };
};

const handleAPIAuth = async (hashedApiKey) => {
    const logOpts = {
        scope: 'handleAPIAuth',
        msgType: 'AUTH_API',
    };

    const result = {
        status: 400,
        type: 'error',
        value: '',
        user: null,
    };

    if (!(await global.AppSettings.isAuthEnabled())) {
        const guest = await User.findOne({ username: 'Guest' });

        if (!guest) {
            log.error('cannot find Guest user');
            result.type = 'error';
            result.value = 'cannot find Guest user';
            return result;
        }
        log.debug('authentication disabled', logOpts, { user: 'Guest' });
        result.type = 'success';
        result.user = guest;
        result.status = 200;
        return result;
    }

    if (!hashedApiKey) {
        log.debug('API key missing', logOpts);
        result.type = 'error';
        result.status = 401;
        result.value = 'API key missing';
        return result;
    }

    const user = await User.findOne({ apiKey: hashedApiKey });
    if (!user) {
        log.error(`wrong API key: ${hashedApiKey}`, logOpts);
        result.type = 'error';
        result.status = 401;
        result.value = 'wrong API key';
        return result;
    }
    log.debug('authenticated', $this, { ...logOpts, ...{ user: user?.username } });
    result.type = 'success';
    result.status = 200;
    result.user = user;
    return result;
};

exports.ensureApiKey = function ensureApiKey() {
    const logOpts = {
        scope: 'ensureApiKey',
        msgType: 'AUTH_API',
    };
    // eslint-disable-next-line consistent-return
    return async (req, res, next) => {
        log.silly(`headers: ${JSON.stringify(req.headers, null, '..')}`, logOpts);
        log.silly(`SYNGRISI_AUTH: '${process.env.SYNGRISI_AUTH}'`);
        const hashedApiKey = req.headers.apikey || req.query.apikey;
        const result = await handleAPIAuth(hashedApiKey);
        req.user = req.user || result.user;
        req.headers.apikey = result?.user?.apiKey || req?.headers?.apikey;
        if (result.type !== 'success') {
            log.info(`${result.value} - ${req.originalUrl}`, $this, logOpts);
            res.status(result.status)
                .json({ error: result.value });
            return next(new Error(result.value));
        }
        return next();
    };
};

exports.ensureLoggedInOrApiKey = () => async (req, res, next) => {
    const basicAuthResult = await handleBasicAuth(req);

    const hashedApiKey = req.headers.apikey || req.query.apikey;
    const apiKeyResult = await handleAPIAuth(hashedApiKey);
    req.user = req.user || apiKeyResult.user;

    if (
        (basicAuthResult.type !== 'success')
        && (apiKeyResult.type !== 'success')
    ) {
        log.info(`Unauthorized - ${req.originalUrl}`);
        // res.status(401).json({ error: `${`${apiKeyResult.value} ${basicAuthResult.value}`} - ${req.originalUrl}` });
        res.status(401)
            .json({ error: `Unauthorized - ${req.originalUrl}` });
        return next(new Error(`Unauthorized - ${req.originalUrl}`));
    }
    return next();
};
