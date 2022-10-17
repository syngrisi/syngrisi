const mongoose = require('mongoose');
const testUtil = require('../../mvc/controllers/api/utils/tests');
const checkService = require('./check.service');

const Test = mongoose.model('VRSTest');
const Check = mongoose.model('VRSCheck');

const $this = this;
$this.logMeta = {
    scope: 'test_service',
    msgType: 'TEST',
};

/**
 * Query for test
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} - result
 */
const queryTests = async (filter, options) => {
    const tests = await Test.paginate(filter, options);
    return tests;
};
const queryTestsDistinct = async (filter, options) => {
    const tests = await Test.paginateDistinct(filter, options);
    return tests;
};

/**
 * Remove a test
 * @param {String} id - test id
 * @param {Object} user - current user
 * @returns {Promise<Check>} - removed test
 */
const remove = async (id, user) => {
    const logOpts = {
        scope: 'removeTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove test with, id: '${id}', user: '${user.username}'`, $this, logOpts);
    return testUtil.removeTest(id);
};

const accept = async (id, user) => {
    const logOpts = {
        scope: 'acceptTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'ACCEPT',
    };
    log.info(`accept test with, id: '${id}', user: '${user.username}'`, $this, logOpts);

    const checks = await Check.find({ test: id })
        .exec();

    for (const check of checks) {
        await checkService.accept(check._id, check.actualSnapshotId, user);
    }
    return { message: 'success' };
};

// /**
//  * Get user by id
//  * @param {ObjectId} id
//  * @returns {Promise<User>}
//  */
// const getUserById = async (id) => {
//     return User.findById(id);
// };
//
// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//     return User.findOne({ email });
// };
//
// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//     const user = await getUserById(userId);
//     if (!user) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//     }
//     Object.assign(user, updateBody);
//     await user.save();
//     return user;
// };
//
// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId) => {
//     const user = await getUserById(userId);
//     if (!user) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }
//     await user.remove();
//     return user;
// };

module.exports = {
    queryTests,
    queryTestsDistinct,
    remove,
    accept,
};
