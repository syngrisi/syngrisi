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

exports.ensureLoggedIn = function ensureLoggedIn(options) {
    if (typeof options == 'string') {
        options = {redirectTo: options}
    }
    options = options || {};

    const url = options.redirectTo || '/login';
    const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

    return function (req, res, next) {
        if (process.env.SYNGRISY_AUTH !== '1') {
            User.findOne({username: 'Guest'}).then((guest) => {
                req.logIn(guest, (err) => {
                    if (err) {
                        console.log({err});
                        next(err);
                    }
                })
            })
            return next()
        }

        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return res.redirect(url);
        }
        next();
    }
}

exports.ensureLoggedInApi = function ensureLoggedInApi(options) {

    return function (req, res, next) {
        if (process.env.SYNGRISY_AUTH !== '1') {
            User.findOne({username: 'Guest'}).then((guest) => {
                console.log({guest})
                req.logIn(guest, (err) => {
                    if (err) {
                        console.log({err});
                        next(err);
                    }
                })
            })
            return next()
        }

        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.status(401).json({error: 'user not loggen in'});
        }
        next();
    }
}
