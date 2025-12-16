import { Test, Suite } from '@models';
import * as testService from './test.service';
import log from '@lib/logger';
import { RequestUser } from '@types';
import { ApiError } from '../utils';
import httpStatus from 'http-status';

const remove = async (id: string, user: RequestUser) => {
    const logOpts = {
        scope: 'removeSuite',
        itemType: 'suite',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove suite with, id: '${id}', user: '${user.username}'`, logOpts);
    const tests = await Test.find({ suite: id }).exec();

    for (const test of tests) {
        await testService.remove(test._id, user);
    }
    const suite = await Suite.findByIdAndDelete(id).exec();
    if (!suite) throw new ApiError(httpStatus.NOT_FOUND, `cannot remove suite with id: '${id}', not found`);
    
    return suite;
};

export {
    remove,
};
