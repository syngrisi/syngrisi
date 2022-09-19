const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const $this = this;
$this.logMeta = {
    scope: 'authorization',
    msgType: 'AUTHORIZATION',
};

exports.authorization = (type) => {
    const types = {
        admin: catchAsync((req, res, next) => {
            if (req.user?.role === 'admin') {
                log.warn(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
    };
    if (types[type]) return types[type];
    return catchAsync(
        async () => {
            log.error(JSON.stringify(new ApiError(httpStatus.FORBIDDEN, 'Wrong type of authorization')));
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong type of authorization');
        }
    );
};
