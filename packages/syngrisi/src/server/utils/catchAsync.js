const log2 = require("../../../dist/src/server/lib/logger2").default;

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        log2.error(err.stack || err.toString());
        return next(err);
    });
};

module.exports = catchAsync;
