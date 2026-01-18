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
import { hashSync } from '@utils/hash';
import * as shareService from '@services/share.service';
import { executeAuthHook } from '../../plugins';

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



const handleBasicAuth = async (req: ExtRequest, retryCount = 0): Promise<any> => {

    const logOpts = {
        scope: 'handleBasicAuth',
        msgType: 'AUTH_API',
    };

    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 500;

    const AppSettings = appSettings;

    const authEnabled = await AppSettings.isAuthEnabled();

    log.debug(`handleBasicAuth: checking auth`, {
        ...logOpts,
        authEnabled,
        isAuthenticated: req.isAuthenticated(),
        hasUser: !!req.user,
        username: req.user?.username,
    });

    if (req.isAuthenticated()) {
        log.debug(`handleBasicAuth: user already authenticated, returning success`, logOpts);
        return { type: 'success', status: 200 };
    }
    if (!authEnabled) {
        const guest = await User.findOne({ username: 'Guest' });

        // Retry logic for Guest user lookup during startup (MongoDB indexing race condition)
        if (!guest) {
            if (retryCount < MAX_RETRIES) {
                log.warn(`Guest user not found in handleBasicAuth (attempt ${retryCount + 1}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS}ms...`, logOpts);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                return handleBasicAuth(req, retryCount + 1);
            }
            log.error(`cannot find Guest user after ${MAX_RETRIES} retries`, logOpts);
            return {
                type: 'redirect',
                status: 301,
                value: `/auth?=Error: cannot find Guest user after ${MAX_RETRIES} retries`,
                user: null,
            };
        }

        // When auth is disabled, bypass session-based login to avoid hanging on API requests
        // that don't have an established session. Just set the user directly.
        log.debug(`Auth disabled - setting Guest user directly (bypassing session login)`, logOpts);
        return {
            type: 'success',
            status: 200,
            value: '',
            user: guest,
        };
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
    const logOpts = {
        scope: 'ensureLoggedInOrApiKey',
        msgType: 'AUTH_API',
    };

    return async (req: Request, res: Response, next: NextFunction) => {
        // Try plugin authentication first (e.g., jwt JWT)
        try {
            const pluginAuthResult = await executeAuthHook(req, res);
            if (pluginAuthResult) {
                if (pluginAuthResult.authenticated && pluginAuthResult.user) {
                    log.debug(`Plugin auth succeeded for user: ${pluginAuthResult.user.username}`, logOpts);
                    req.user = pluginAuthResult.user;
                    return next();
                }
                if (pluginAuthResult.authenticated === false) {
                    log.info(`Plugin auth failed: ${pluginAuthResult.error}`, logOpts);
                    res.status(401).json({ error: pluginAuthResult.error || 'Plugin authentication failed' });
                    return next(new Error(pluginAuthResult.error || 'Plugin authentication failed'));
                }
            }
            // pluginAuthResult === null means skip plugin auth, try other methods
        } catch (error) {
            log.error(`Error in plugin auth: ${error}`, logOpts);
            // Continue to regular auth on plugin error
        }

        const basicAuthResult = await handleBasicAuth(req);
        req.user = basicAuthResult.user || req.user;

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

/**
 * Middleware that allows access if:
 * 1. User is logged in, OR
 * 2. A valid share token is present in query params
 *
 * Used for pages that can be accessed anonymously via share links.
 */
import * as shareService from '@services/share.service';

// ... (existing imports)

// ...

export function ensureLoggedInOrShareToken(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Check if share token is present in query params
        const shareToken = req.query.share as string | undefined;

        if (shareToken) {
            // Validate share token
            const tokenDoc = await shareService.findShareToken(shareToken);
            if (!tokenDoc) {
                log.warn('Invalid share token', { scope: 'ensureLoggedInOrShareToken' });
                // If invalid, fall through to normal auth or redirect
                // We can continue to handleBasicAuth which will redirect to login
            } else {
                // Share token present AND valid - allow access without login
                log.debug('Valid share token present, allowing access without login', { scope: 'ensureLoggedInOrShareToken' });

                // Do NOT login as Guest to prevent session creation with write access
                (req as any).isShareMode = true;
                (req as any).shareToken = tokenDoc;
                return next();
            }
        }

        // No share token - require normal authentication
        const result = await handleBasicAuth(req);
        req.user = result.user || req.user;
        if (result.type === 'success') {
            return next();
        }
        res.status(result.status).redirect(result.value);
    };
}

/**
 * Middleware that allows access if:
 * 1. User is logged in, OR
 * 2. Valid API key, OR
 * 3. Valid share token
 *
 * Used for API endpoints that can be accessed via share links (read-only).
 */
export function ensureLoggedInOrApiKeyOrShareToken(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req: Request, res: Response, next: NextFunction) => {
        const logOpts = {
            scope: 'ensureLoggedInOrApiKeyOrShareToken',
            msgType: 'AUTH_API',
        };

        // Check if share token is present in query params or headers
        const shareToken = (req.query.share || req.headers['x-share-token']) as string | undefined;

        if (shareToken) {
            // Validate share token
            const tokenDoc = await shareService.findShareToken(shareToken);

            if (tokenDoc) {
                // Share token present and valid - allow read access without login
                log.debug('Valid share token present in API request, allowing read access', logOpts);

                // Login as Guest user for share mode (with retry for MongoDB indexing race condition)
                const MAX_RETRIES = 3;
                const RETRY_DELAY_MS = 500;
                let guest = null;

                for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                    guest = await User.findOne({ username: 'Guest' });
                    if (guest) break;
                    if (attempt < MAX_RETRIES - 1) {
                        log.warn(`Guest user not found for share API access (attempt ${attempt + 1}/${MAX_RETRIES}), retrying...`, logOpts);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    }
                }

                if (guest) {
                    req.user = guest;
                    // Mark request as share mode to skip creator filtering
                    (req as any).isShareMode = true;
                    (req as any).shareToken = tokenDoc;
                    return next();
                } else {
                    log.error(`Guest user not found for share API access after ${MAX_RETRIES} retries`, logOpts);
                }
            } else {
                log.warn('Invalid share token in API request', logOpts);
            }
        }

        // Try basic auth first
        const basicAuthResult = await handleBasicAuth(req);
        req.user = basicAuthResult.user || req.user;
        if (basicAuthResult.type === 'success') {
            return next();
        }

        // Try API key
        const rawApiKey = req.headers.apikey ?? req.query.apikey;
        const apiKeyResult = await handleAPIAuth(rawApiKey);
        req.user = req.user || apiKeyResult.user;
        if ('apikey' in req.query) {
            delete (req.query as Record<string, unknown>).apikey;
        }

        if (apiKeyResult.type !== 'success') {
            log.info(`Unauthorized - ${req.originalUrl}`, logOpts);
            res.status(401).json({ error: `Unauthorized - ${req.originalUrl}` });
            return next(new Error(`Unauthorized - ${req.originalUrl}`));
        }
        if ('apikey' in req.headers) {
            delete (req.headers as Record<string, unknown>).apikey;
        }
        return next();
    };
}
