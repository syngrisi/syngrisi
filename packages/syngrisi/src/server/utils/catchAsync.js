const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        log.error(err.stack || err.toString());
        return next(err);
    });
};

module.exports = catchAsync;
