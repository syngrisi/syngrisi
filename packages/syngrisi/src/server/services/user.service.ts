/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import { User } from '@models';
import { ApiError } from '@utils';
import log from "../lib/logger";
import { UserCreateReq } from '../schemas/User.schema';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '../models/plugins/utils';

const createUser = async (userBody: UserCreateReq) => {
    //  @ts-ignore
    if (await User.isEmailTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const logOpts = {
        msgType: 'CREATE',
        itemType: 'user',
        ref: userBody.username,
        scope: 'createUser',
    };
    log.debug(`create the user with name '${userBody.username}', params: '${JSON.stringify(userBody)}'`, logOpts);

    const user = await User.create({ ...userBody, createdDate: Date.now() });

    const updatedUser = await user.setPassword(userBody.password);
    await updatedUser.save();

    log.debug(`password for user: '${userBody.username}' set successfully`, logOpts);

    const userWithSelectedFields = await User.findById(updatedUser._id)
        .select('username firstName lastName role createdDate updatedDate createdDate')
        .exec();

    return userWithSelectedFields;
};
const queryUsers = async (filter:  FilterQuery<typeof Test>, options: PaginateOptions) => {
    const users = await User.paginate(filter, options);
    return users;
};

const getUserById = async (id: string) => User.findById(id)
    .select('username firstName lastName role createdDate updatedDate createdDate')
    .exec();

const getUserByEmail = async (email: string) => User.findOne({ email });

const updateUserById = async (userId: string, updateBody: UserCreateReq) => {
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'user',
        scope: 'updateUserById',
        ref: userId,
    };

    log.info(`update user with id: '${userId}' name '${updateBody.username}', params: '${JSON.stringify(updateBody)}'`, logOpts);
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    //  @ts-ignore
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    if (updateBody.password) {
        log.debug(`update password for '${updateBody.username}'`, logOpts);
        await user.setPassword(updateBody.password);
        await user.save();
        log.debug(`password for '${updateBody.username}' was updated`, logOpts);
    }
    log.debug(`user '${updateBody.username}' was updated successfully`, logOpts);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...newupdateBody } = updateBody;
    Object.assign(user, {
        ...newupdateBody, updatedDate: Date.now(),
    });
    await user.save();
    return user;
};

const deleteUserById = async (userId: string) => User.findByIdAndDelete(userId).exec();

export {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
};
