import { Log } from '@models';
import log from '@lib/logger';
import { LogOpts } from '@root/src/types';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '@models/plugins/utils';
import { env } from '@env';


const queryLogs = async (filter: FilterQuery<typeof Log>, options: PaginateOptions) => Log.paginate(filter, options);

const distinct = async (field: string) => Log.distinct(field);

type LogBody = LogOpts & { message: string; level?: string };

const createLogs = async (body: LogBody) => {
    const payload = {
        message: body.message,
        level: body.level || 'debug',
        user: body.user,
        scope: body.scope || 'test_scope',
        msgType: body.msgType || 'TEST_MSG_TYPE',
    };

    // In test mode we write directly to Mongo to keep assertions deterministic
    if (env.SYNGRISI_TEST_MODE) {
        await Log.create({
            message: payload.message,
            level: payload.level,
            meta: { user: payload.user, scope: payload.scope, msgType: payload.msgType },
            timestamp: new Date(),
        });
    } else {
        log[payload.level as keyof typeof log](payload.message, {
            user: payload.user,
            scope: payload.scope,
            msgType: payload.msgType,
        });
    }
    return { message: 'success' };
};

export {
    queryLogs,
    distinct,
    createLogs,
};
