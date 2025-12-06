import { Test, Run } from '@models';
import log from '@lib/logger';
import * as testService from './test.service';
import { RequestUser } from '@types';
import { HttpStatus } from '@utils';
import { ApiError } from '../utils';

const remove = async (id: string, user: RequestUser) => {
   
    const logOpts = {
        scope: 'removeRun',
        itemType: 'run',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove run with, id: '${id}', user: '${user.username}'`, logOpts);
    const tests = await Test.find({ run: id }).exec();

    for (const test of tests) {
        await testService.remove(test._id, user);
    }
    const run = await Run.findByIdAndDelete(id).exec();
    if (!run) {
        throw new ApiError(HttpStatus.NOT_FOUND, `cannot remove run with id: '${id}', not found`);
    }
    return run;
};

export {
    remove,
};
