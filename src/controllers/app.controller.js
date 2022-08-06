const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const info = catchAsync(async (req, res) => {
    res.status(httpStatus.OK)
        .json({ version: global.version });
});

module.exports = {
    info,
};
