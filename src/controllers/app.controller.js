const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { appService } = require('../services');

const info = catchAsync(async (req, res) => {
    res.status(httpStatus.OK)
        .json({ version: global.version });
});

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await appService.get(filter, options);
    res.send(result);
});

module.exports = {
    info,
    get,
};
