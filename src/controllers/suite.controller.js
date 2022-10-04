// eslint-disable-next-line no-unused-vars
const httpStatus = require('http-status');
const { EJSON } = require('bson');
const catchAsync = require('../utils/catchAsync');
const { genericService } = require('../services');
const pick = require('../utils/pick');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSuite', filter, options);
    res.send(result);
});

module.exports = {
    get,
};
