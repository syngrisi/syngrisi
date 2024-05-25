const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const log2 = require("../../../dist/src/server/lib/logger2").default;

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
                log2.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log2.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
        user: catchAsync(async (req, res, next) => {
            if (!(await global.AppSettings.isAuthEnabled())) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log2.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            if (
                type === 'user'
                && (req.user?.role === 'user' || req.user?.role === 'reviewer')
            ) {
                log2.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log2.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
    };
    if (types[type]) return types[type];
    return catchAsync(
        () => {
            log2.error(JSON.stringify(new ApiError(httpStatus.FORBIDDEN, 'Wrong type of authorization')));
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong type of authorization');
        }
    );
};
