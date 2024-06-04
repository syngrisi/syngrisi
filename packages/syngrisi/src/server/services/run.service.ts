/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, Run } from '../models';
import log from '../lib/logger';
import * as testService from './test.service';
import { RequestUser } from '../../types/RequestUser';


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
    // @ts-ignore
    const run = await Run.findByIdAndRemove(id).exec();
    return run;
};

export {
    remove,
};
