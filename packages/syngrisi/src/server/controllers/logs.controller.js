const httpStatus = require('http-status');
const { EJSON } = require('bson');
const { catchAsync } = require('../utils');
const { logsService } = require('../services');
const { pick } = require('../utils');

const getLogs = catchAsync(async (req, res) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await logsService.queryLogs(filter, options);
    res.send(result);
});

const distinct = catchAsync(async (req, res) => {
    const { field } = pick(req.query, ['field']);
    const result = await logsService.distinct(field);
    res.send(result);
});

const createLog = catchAsync(async (req, res) => {
    const user = await logsService.createLogs(req.body);
    res.status(httpStatus.CREATED)
        .send(user);
});

module.exports = {
    getLogs,
    distinct,
    createLog,
};
