const httpStatus = require('http-status');

const { ApiError } = require('../utils');

const { catchAsync } = require('../utils');
const log = require("../../../dist/src/server/lib/logger").default;

const fileLogMeta = {
    scope: 'authorization',
    msgType: 'AUTHORIZATION',
};

exports.authorization = (type) => {
    const types = {
        admin: catchAsync(async (req, res, next) => {
            if (!(await global.AppSettings.isAuthEnabled())) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
        user: catchAsync(async (req, res, next) => {
            if (!(await global.AppSettings.isAuthEnabled())) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            if (
                type === 'user'
                && (req.user?.role === 'user' || req.user?.role === 'reviewer')
            ) {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
    };
    if (types[type]) return types[type];
    return catchAsync(
        () => {
            log.error(JSON.stringify(new ApiError(httpStatus.FORBIDDEN, 'Wrong type of authorization')));
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong type of authorization');
        }
    );
};
