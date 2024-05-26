/* eslint-disable valid-jsdoc */
const httpStatus = require('http-status');
const { User } = require('../models');
const { ApiError } = require('../utils');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
    scope: 'user_service',
    msgType: 'USER',
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const logOpts = {
        msgType: 'CREATE',
        itemType: 'user',
        ref: userBody.username,
        scope: 'createUser',
    };
    log2.debug(`create the user with name '${userBody.username}', params: '${JSON.stringify(userBody)}'`, fileLogMeta, logOpts);

    const user = await User.create({ ...userBody, createdDate: Date.now() });

    const updatedUser = await user.setPassword(userBody.password);
    await updatedUser.save();

    log2.debug(`password for user: '${userBody.username}' set successfully`, fileLogMeta, logOpts);
    return updatedUser;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => User.findOne({ email });

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'user',
        scope: 'updateUserById',
    };

    log2.info(
        `update user with id: '${userId}' name '${updateBody.username}', params: '${JSON.stringify(updateBody)}'`,
        fileLogMeta,
        logOpts
    );
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (updateBody.password) {
        log2.debug(`update password for '${updateBody.username}'`, fileLogMeta, logOpts);
        await user.setPassword(updateBody.password);
        await user.save();
        log2.debug(`password for '${updateBody.username}' was updated`, fileLogMeta, logOpts);
    }
    log2.debug(`user '${updateBody.username}' was updated successfully`, fileLogMeta, logOpts);

    // remove password
    const { password, ...newupdateBody } = updateBody;
    Object.assign(user, {
        ...newupdateBody, updatedDate: Date.now(),
    });
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => User.findByIdAndDelete(userId).exec();
// const user = await getUserById(userId);
// if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
// }
// await user.remove();
// return user;

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
