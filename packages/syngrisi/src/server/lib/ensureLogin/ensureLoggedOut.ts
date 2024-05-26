/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Ensure that no user is logged in before proceeding to next route middleware.
 *
 * This middleware ensures that no user is logged in.  If a request is received
 * that is authenticated, the request will be redirected to another page (by
 * default to `/`).
 *
 * Options:
 *   - `redirectTo`   URL to redirect to in logged in, defaults to _/_
 *
 * Examples:
 *
 *     app.get('/login',
 *       ensureLoggedOut(),
 *       function(req, res) { ... });
 *
 *     app.get('/login',
 *       ensureLoggedOut('/home'),
 *       function(req, res) { ... });
 *
 *     app.get('/login',
 *       ensureLoggedOut({ redirectTo: '/home' }),
 *       function(req, res) { ... });
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from 'express';

interface Options {
    redirectTo?: string;
}

const ensureLoggedOut = (options?: Options | string) => {
    let opts: Options;

    if (typeof options === 'string') {
        opts = { redirectTo: options };
    } else {
        opts = options || {};
    }

    const url = opts.redirectTo || '/';

    return (req: any, res: Response, next: NextFunction) => {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.redirect(url);
        }
        return next();
    };
};

export default ensureLoggedOut;
