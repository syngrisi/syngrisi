const httpStatus = require('http-status');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
// const { authService, userService, tokenService, emailService } = require('../services');

const login = catchAsync(async (req, res, next) => {
    const logOpts = {
        scope: 'login',
        msgType: 'AUTHENTICATION',
    };
    const { email, password } = req.body;
    console.log(email, password);

    passport.authenticate('local',
        (err, user, info) => {
            console.log({ user });
            console.log({ err });
            console.log({ info });

            if (err) {
                log.error(`authentication error: '${err}'`, this, logOpts);
                return res.status(httpStatus.UNAUTHORIZED)
                    .json({ error: 'authentication error' });
            }
            // req.login()
            if (!user) {
                return res.status(httpStatus.UNAUTHORIZED)
                    .json({ error: 'authentication error' });
            }
            //

            req.logIn(user, (e) => {
                if (e) {
                    return next(e);
                }

                console.log(req.cookies);
                console.log(res.headers);

                console.log(req.session.passport);
                // console.log(req.session.passport.user);
                log.info('user is logged in', this, { user: user.username });
                res.status(200)
                    .json({ message: 'user is logged in' });
                // this is for tests http login purpose
                // if (req.query.noredirect) {
                //     return res.status(200)
                //         .json({
                //             autoTests: true,
                //         });
                // }
                // return res.redirect(origin);
            });

        })(req, res, next);

    // res.send({ message: '!!!!!!!!!!' });
});
//
// const logout = catchAsync(async (req, res) => {
//     await authService.logout(req.body.refreshToken);
//     res.status(httpStatus.NO_CONTENT).send();
// });
//
// const resetPassword = catchAsync(async (req, res) => {
//     await authService.resetPassword(req.query.token, req.body.password);
//     res.status(httpStatus.NO_CONTENT).send();
// });

module.exports = {
    login,
    // logout,
    // resetPassword,
};
