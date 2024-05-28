// /* eslint-disable indent,no-useless-escape */
// const httpStatus = require('http-status');
// const { pick } = require('../utils');
// // eslint-disable-next-line no-unused-vars
// const { ApiError } = require('../utils');

// const { catchAsync } = require('../utils');
// // const { testService } = require('../services');
// const { testService } = require('../../../dist/src/server/services');

// const { deserializeIfJSON } = require('../utils');

// const getTest = catchAsync(async (req, res) => {
//     const filter = {
//         ...deserializeIfJSON(req.query.base_filter),
//         ...deserializeIfJSON(req.query.filter),
//     };

//     if (req.user?.role === 'user') {
//         filter.creatorUsername = req.user?.username;
//     }

//     const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
//     const result = await testService.queryTests(filter, options);
//     res.status(httpStatus.OK)
//         .send(result);
// });

// const distinct = catchAsync(async (req, res) => {
//     const filter = pick(req.query, [
//         'suite',
//         'run',
//         'markedAs',
//         'creatorId',
//         'creatorUsername',
//         'name',
//         'status',
//         'browserName',
//         'browserVersion',
//         'branch',
//         'tags',
//         'viewport',
//         'os',
//         'app',
//         'startDate',
//         'filter',
//     ]);
//     const options = { ...pick(req.query, ['sortBy', 'limit', 'page', 'populate']), field: req.params.id };
//     const result = await testService.queryTestsDistinct(filter, options);
//     res.status(httpStatus.OK)
//         .send(result);
// });

// const remove = catchAsync(async (req, res) => {
//     const { id } = req.params;
//     if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the test - Id not found');
//     const result = await testService.remove(id, req?.user);
//     res.send(result);
// });

// const accept = catchAsync(async (req, res) => {
//     const { id } = req.params;
//     if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
//     const result = await testService.accept(id, req?.user);
//     res.send(result);
// });

// module.exports = {
//     getTest,
//     distinct,
//     remove,
//     accept,
// };
