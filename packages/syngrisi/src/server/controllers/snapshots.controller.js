// eslint-disable-next-line no-unused-vars
const httpStatus = require('http-status');
const { EJSON } = require('bson');
const { catchAsync } = require('../utils');
const { genericService } = require('../../../dist/src/server/services');

const { pick } = require('../utils');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await genericService.get('VRSSnapshot', filter, options);
    res.send(result);
});

module.exports = {
    get,
};
