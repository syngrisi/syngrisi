/* eslint-disable @typescript-eslint/no-explicit-any */

import { App } from '@models';
import log from "@logger";

export async function createAppIfNotExist(params: any): Promise<any> {
    const logOpts = {
        scope: 'createAppIfNotExist',
        msgType: 'CREATE',
        itemType: 'VRSApp',
    };
    if (!params.name) return {};

    log.debug(`try to create app if exist, params: '${JSON.stringify(params)}'`, logOpts);

    const filter = { name: params.name };
    const update = {
        $setOnInsert: {
            ...params,
            createdDate: params.createdDate || new Date(),
        },
    };

    try {
        const app = await App.findOneAndUpdate(
            filter,
            update,
            { new: true, upsert: true }
        ).exec();
        log.debug(`app with name: '${params.name}' was created or reused`, logOpts);
        return app;
    } catch (e: any) {
        if (e.code === 11000) {
            log.warn(`app key duplication collision: '${JSON.stringify(params)}'`, logOpts);
            const existing = await App.findOne(filter).exec();
            if (existing) return existing;
        }
        log.error(`cannot create app, params: '${JSON.stringify(params)}', error: '${e?.stack || e}'`, logOpts);
        throw e;
    }
}
