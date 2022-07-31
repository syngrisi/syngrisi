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
const hasha = require('hasha');

const User = mongoose.model('VRSUser');
const $this = this;
$this.logMeta = {
    scope: 'Authentication',
    msgType: 'LOGIN',
};

exports.ensureLoggedIn = function ensureLoggedIn() {
    const logOpts = { scope: 'ensureLoggedIn' };

    // eslint-disable-next-line consistent-return
    return async (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        if (process.env.SYNGRISI_AUTH !== '1') {
            // log.silly('authentication is disabled', $this, logOpts);
            User.findOne({ username: 'Guest' })
                .then((guest) => {
                    req.logIn(guest, (err) => {
                        if (err) {
                            log.error(`cannot find quest user: '${err}'`, $this, logOpts);
                            res.redirect(`/login?=Error: cannot find quest user: ${err}`);
                        }
                        return next();
                    });
                });
        }

        if (process.env.SYNGRISI_AUTH === '1'
            && (await global.appSettings.get('firstRun'))
            && process.env.SYNGRISI_DISABLE_FIRST_RUN !== '1'
        ) {
            log.debug('first run, set admin password', $this, logOpts);
            res.redirect('/first_run_password?admin=true');
            return next();
        }

        if (process.env.SYNGRISI_AUTH === '1') {
            log.debug('user is not authenticated', $this, logOpts);
            if (req.originalUrl && req.originalUrl !== '/') {
                res.redirect(`/login?origin=${encodeURIComponent(req.originalUrl)}`);
            } else {
                res.redirect('/login');
            }
        }
    };
};

exports.ensureLoggedInOrApiKey = function ensureLoggedInOrApiKey() {
    const logOpts = {
        scope: 'ensureLoggedInOrApiKey',
        msgType: 'AUTH_API',
    };
    return function (req, res, next) {
        // when Auth is disabled
        if (process.env.SYNGRISI_AUTH !== '1') {
            // log.silly('authentication is disabled', $this, logOpts);
            User.findOne({ username: 'Guest' })
                .then((guest) => {
                    req.logIn(guest, (err) => {
                        if (err) {
                            console.error(`cannot find quest user: '${err}'`);
                            res.redirect(`/login?=Error: cannot find quest user: ${err}`);
                        }
                        next();
                    });
                });
        } else if (!req.isAuthenticated()) {
            if (req.query.apikey) {
                const apiKey = req.query.apikey;
                // console.log({ apiKey });
                User.findOne({ apiKey: hasha(apiKey) })
                    .then((usr) => {
                        if (!usr) {
                            log.error(`wrong or empty API key: ${apiKey}`, $this, logOpts);
                            return res.status(401)
                                .json({ error: `wrong or empty API key: ${apiKey}` });
                        }
                        log.debug('user was authenticated', $this, { ...logOpts, ...{ user: usr?.username } });
                        req.user = usr;
                        next();
                    });
                return;
            }
            log.debug('user is not authenticated', $this, logOpts);
            if (req.originalUrl && req.originalUrl !== '/') {
                res.redirect(`/login?origin=${encodeURIComponent(req.originalUrl)}`);
            } else {
                res.redirect('/login');
            }
        } else {
            next();
        }
    };
};

const handleAPIAuth = async (hashedApiKey) => {
    const logOpts = {
        scope: 'handleAPIAuth',
        msgType: 'AUTH_API',
    };

    const result = {
        status: 400,
        message: '',
        user: null,
    };

    if (process.env.SYNGRISI_AUTH !== '1') {
        const guest = await User.findOne({ username: 'Guest' });

        if (!guest) {
            log.error('cannot find Guest user');
            result.message = 'cannot find Guest user';
            return result;
        }
        log.debug('authentication disabled', logOpts, { user: 'Guest' });
        result.user = guest;
        result.status = 200;
        return result;
    }

    if (!hashedApiKey) {
        log.debug('API key missing', logOpts);
        result.status = 401;
        result.message = 'API key missing';
        return result;
    }

    const user = await User.findOne({ apiKey: hashedApiKey });
    if (!user) {
        log.error(`wrong API key: ${hashedApiKey}`, logOpts);
        result.status = 401;
        result.message = 'wrong API key';
        return result;
    }
    log.debug('authenticated', logOpts, { user: user?.username });
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
        req.user = result.user;
        if (result.status !== 200) {
            res.status(result.status)
                .json({ error: result.message });
            return next(new Error(result.message));
        }
        return next();
    };
};
