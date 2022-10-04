/* eslint-disable indent,no-useless-escape */
const httpStatus = require('http-status');
const { EJSON } = require('bson');
const pick = require('../utils/pick');
// eslint-disable-next-line no-unused-vars
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { testService } = require('../services');

const isJSON = (text) => (!text ? '' : (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))));

const deserializeIfJSON = (text) => {
    if (isJSON(text)) return EJSON.parse(text || null) || undefined;
    return text;
};

const getTest = catchAsync(async (req, res) => {
    const filter = {
        ...deserializeIfJSON(req.query.base_filter),
        ...deserializeIfJSON(req.query.filter),
    };

    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await testService.queryTests(filter, options);
    res.status(httpStatus.OK)
        .send(result);
});

const distinct = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
        'suite',
        'run',
        'markedAs',
        'creatorId',
        'creatorUsername',
        'name',
        'status',
        'browserName',
        'browserVersion',
        'branch',
        'tags',
        'viewport',
        'os',
        'app',
        'startDate',
        'filter',
    ]);
    const options = { ...pick(req.query, ['sortBy', 'limit', 'page', 'populate']), field: req.params.id };
    const result = await testService.queryTestsDistinct(filter, options);
    res.status(httpStatus.OK)
        .send(result);
});

module.exports = {
    getTest,
    distinct,
};
