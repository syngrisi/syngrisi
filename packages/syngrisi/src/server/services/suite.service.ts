/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, Suite } from '../models';
import * as testService from './test.service';
import log from '../lib/logger';

const remove = async (id: string, user: any) => {
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
    // @ts-ignore
    const suite = await Suite.findByIdAndRemove(id).exec();
    return suite;
};

export {
    remove,
};
