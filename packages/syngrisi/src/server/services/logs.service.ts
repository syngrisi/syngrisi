/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Log } from '../models';
import log from '../lib/logger';



// @ts-ignore
const queryLogs = async (filter: any, options: any) => Log.paginate(filter, options);

const distinct = async (field: string) => Log.distinct(field);

const createLogs = async (body: any) => {
    log[(body.level || 'debug') as keyof typeof log](body.message, {
        user: body.user,
        scope: body.scope || 'test_scope',
        msgType: body.msgType || 'TEST_MSG_TYPE',
    });
    return { message: 'success' };
};

export {
    queryLogs,
    distinct,
    createLogs,
};
