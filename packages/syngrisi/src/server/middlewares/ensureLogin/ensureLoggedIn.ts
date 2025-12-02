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
import { hashSync } from 'hasha';

export const normalizeIncomingApiKey = (rawKey: unknown): string | undefined => {
    if (Array.isArray(rawKey)) {
        rawKey = rawKey[0];
    }
    if (rawKey === undefined || rawKey === null) return undefined;
    const apiKey = String(rawKey).trim();
    if (!apiKey) return undefined;
    const hashedPattern = /^[a-f0-9]{128}$/i;
    if (hashedPattern.test(apiKey)) return apiKey;
    return hashSync(apiKey);
};



const handleBasicAuth = async (req: ExtRequest): Promise<any> => {

    const logOpts = {
        scope: 'handleBasicAuth',
        msgType: 'AUTH_API',
    };

    const AppSettings = appSettings;

    const authEnabled = await AppSettings.isAuthEnabled();



    if (req.isAuthenticated()) {
        return { type: 'success', status: 200 };
    }
    if (!authEnabled) {
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
    if (authEnabled
        && ((await AppSettings.isFirstRun()))
        && !env.SYNGRISI_DISABLE_FIRST_RUN
    ) {
        log.info('first run, set admin password', logOpts);
        result.type = 'redirect';
        result.status = 301;
        result.value = '/auth/change?first_run=true';
        return result;
    }

    if (authEnabled) {
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
        // return next('redirect'); // Do not call next with error for redirect
    };
}

const handleAPIAuth = async (rawApiKey: unknown, retryCount = 0): Promise<any> => {
    const logOpts = {
        scope: 'handleAPIAuth',
        msgType: 'AUTH_API',
    };

    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 500;

    const result: any = {
        status: 400,
        type: 'error',
        value: '',
        user: null,
    };
    const AppSettings = appSettings;
    if (!(await AppSettings.isAuthEnabled())) {
        const guest = await User.findOne({ username: 'Guest' });

        if (!guest) {
            // Retry logic for Guest user lookup during startup (MongoDB indexing race condition)
            if (retryCount < MAX_RETRIES) {
                log.warn(`Guest user not found (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms...`, logOpts);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                return handleAPIAuth(rawApiKey, retryCount + 1);
            }
            log.error(`cannot find Guest user after ${MAX_RETRIES} retries`, logOpts);
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

    const hashedApiKey = normalizeIncomingApiKey(rawApiKey);
    if (!hashedApiKey) {
        log.debug('API key missing', logOpts);
        result.type = 'error';
        result.status = 401;
        result.value = 'API key missing';
        return result;
    }

    const user = await User.findOne({ apiKey: hashedApiKey });
    if (!user) {
        // Retry logic for API key lookup during startup (MongoDB indexing race condition)
        if (retryCount < MAX_RETRIES) {
            log.warn(`API key not found (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms...`, logOpts);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            return handleAPIAuth(rawApiKey, retryCount + 1);
        }
        log.error(`wrong API key provided after ${MAX_RETRIES} retries`, logOpts);
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
        const rawApiKey = req.headers.apikey ?? req.query.apikey;
        const result = await handleAPIAuth(rawApiKey);
        req.user = req.user || result.user;
        if ('apikey' in req.query) {
            delete (req.query as Record<string, unknown>).apikey;
        }
        if (result.type !== 'success') {
            log.info(`${result.value} - ${req.originalUrl}`, logOpts);
            res.status(result.status).json({ error: result.value });
            return next(new Error(result.value));
        }
        if ('apikey' in req.headers) {
            delete (req.headers as Record<string, unknown>).apikey;
        }
        return next();
    };
}

export function ensureLoggedInOrApiKey(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {

        const basicAuthResult = await handleBasicAuth(req);



        if (basicAuthResult.type === 'success') {
            return next();
        }

        const rawApiKey = req.headers.apikey ?? req.query.apikey;
        const apiKeyResult = await handleAPIAuth(rawApiKey);
        req.user = req.user || apiKeyResult.user;
        if ('apikey' in req.query) {
            delete (req.query as Record<string, unknown>).apikey;
        }

        if (apiKeyResult.type !== 'success') {
            log.info(`Unauthorized - ${req.originalUrl}`);
            res.status(401).json({ error: `Unauthorized - ${req.originalUrl}` });
            return next(new Error(`Unauthorized - ${req.originalUrl}`));
        }
        if ('apikey' in req.headers) {
            delete (req.headers as Record<string, unknown>).apikey;
        }
        return next();
    };
}
