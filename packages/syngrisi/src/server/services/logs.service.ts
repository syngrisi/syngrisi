import { Log } from '@models';
import log from '@lib/logger';
import { LogOpts } from '@root/src/types';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '@models/plugins/utils';


const queryLogs = async (filter: FilterQuery<typeof Log>, options: PaginateOptions) => Log.paginate(filter, options);

const distinct = async (field: string) => Log.distinct(field);

type LogBody = LogOpts & { message: string; level?: string };

const createLogs = async (body: LogBody) => {
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
