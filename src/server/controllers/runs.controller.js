// eslint-disable-next-line no-unused-vars
const httpStatus = require('http-status');
const { EJSON } = require('bson');
const catchAsync = require('../utils/catchAsync');
const { genericService } = require('../services');
const { runService } = require('../services');
const pick = require('../utils/pick');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSRun', filter, options);
    res.send(result);
});

const remove = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await runService.remove(id, req?.user);
    res.send(result);
});

module.exports = {
    get,
    remove,
};
