/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

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

import { Request, Response, NextFunction } from 'express';
import { User } from '@models';
import log from "../../lib/logger";
import { ExtRequest } from '../../../types/ExtRequest';
import { appSettings } from "@settings";
import { env } from "@/server/envConfig";



const handleBasicAuth = async (req: ExtRequest): Promise<any> => {
    const logOpts = {
        scope: 'handleBasicAuth',
        msgType: 'AUTH_API',
    };

    if (req.isAuthenticated()) {
        return { type: 'success', status: 200 };
    }
    const AppSettings = await appSettings;
    if (!(await AppSettings.isAuthEnabled())) {
        const guest = await User.findOne({ username: 'Guest' });
        const result = new Promise((resolve) => {
            req.logIn(guest, (err: any) => {
                if (err) {
                    log.error(`cannot find guest user: '${err}'`, logOpts);
                    resolve({
                        type: 'redirect',
                        status: 301,
                        value: `/auth?=Error: cannot find guest user: ${err}`,
                        user: null,
                    });
                } else {
                    resolve({
                        type: 'success',
                        status: 200,
                        value: '',
                        user: guest,
                    });
                }
            });
        });
        return result;
    }

    const result: any = {
        type: 'error',
        status: 400,
        value: '',
        user: null,
    };
    if ((await AppSettings.isAuthEnabled())
        && ((await AppSettings.isFirstRun()))
        && !env.SYNGRISI_DISABLE_FIRST_RUN
    ) {
        log.info('first run, set admin password', logOpts);
        result.type = 'redirect';
        result.status = 301;
        result.value = '/auth/change?first_run=true';
        return result;
    }

    if (await AppSettings.isAuthEnabled()) {
        log.info(`user is not authenticated, will redirected - ${req.originalUrl}`, logOpts);

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ensureLoggedIn(options?: any): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await handleBasicAuth(req);
        req.user = result.user || req.user;
        if (result.type === 'success') {
            return next();
        }
        res.status(result.status).redirect(result.value);
        return next('redirect');
    };
}

const handleAPIAuth = async (hashedApiKey: string): Promise<any> => {
    const logOpts = {
        scope: 'handleAPIAuth',
        msgType: 'AUTH_API',
    };

    const result: any = {
        status: 400,
        type: 'error',
        value: '',
        user: null,
    };
    const AppSettings = await appSettings;
    if (!(await AppSettings.isAuthEnabled())) {
        const guest = await User.findOne({ username: 'Guest' });

        if (!guest) {
            log.error('cannot find Guest user', logOpts);
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
    log.debug('authenticated', { ...logOpts, ...{ user: user?.username } });
    result.type = 'success';
    result.status = 200;
    result.user = user;
    return result;
};

export function ensureApiKey(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    const logOpts = {
        scope: 'ensureApiKey',
        msgType: 'AUTH_API',
    };
    return async (req: Request, res: Response, next: NextFunction) => {
        log.silly(`headers: ${JSON.stringify(req.headers, null, '..')}`, logOpts);
        log.silly(`SYNGRISI_AUTH: '${env.SYNGRISI_AUTH}'`);
        const hashedApiKey = req.headers.apikey || req.query.apikey;
        const result = await handleAPIAuth(hashedApiKey);
        req.user = req.user || result.user;
        req.headers.apikey = result?.user?.apiKey || req?.headers?.apikey;
        if (result.type !== 'success') {
            log.info(`${result.value} - ${req.originalUrl}`, logOpts);
            res.status(result.status).json({ error: result.value });
            return next(new Error(result.value));
        }
        return next();
    };
}

export function ensureLoggedInOrApiKey(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const basicAuthResult = await handleBasicAuth(req);

        const hashedApiKey = req.headers.apikey || req.query.apikey;
        const apiKeyResult = await handleAPIAuth(hashedApiKey);
        req.user = req.user || apiKeyResult.user;

        if (
            (basicAuthResult.type !== 'success')
            && (apiKeyResult.type !== 'success')
        ) {
            log.info(`Unauthorized - ${req.originalUrl}`);
            res.status(401).json({ error: `Unauthorized - ${req.originalUrl}` });
            return next(new Error(`Unauthorized - ${req.originalUrl}`));
        }
        return next();
    };
}
