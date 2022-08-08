const httpStatus = require('http-status');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const Test = mongoose.model('VRSTest');

/**
 * Query for test
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTests = async (filter, options) => {
    const tests = await Test.paginate(filter, options);
    return tests;
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
};
