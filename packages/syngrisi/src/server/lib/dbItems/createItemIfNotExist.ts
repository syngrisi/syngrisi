/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log from "../logger";

const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function createItemIfNotExist(modelName: string, params: any, logsMeta = {}): Promise<any> {
    const logOpts = {
        scope: 'createItemIfNotExist',
        msgType: 'CREATE',
        itemType: modelName,
    };
    try {
        const itemModel = mongoose.model(modelName);
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };

        await itemModel.init();
        const item = await itemModel.findOneAndUpdate(params, params, options);

        log.info(`ORM item '${modelName}' was created: '${JSON.stringify(item)}'`, fileLogMeta, { ...logOpts, ...{ ref: item?._id }, ...logsMeta });
        return item;
    } catch (e: any) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e.stack || e}'`, fileLogMeta, { ...logOpts, ...logsMeta });
    }
    return null;
}
