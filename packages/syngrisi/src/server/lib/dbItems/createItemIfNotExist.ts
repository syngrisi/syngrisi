/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log from "../logger";

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

        log.info(`ORM item '${modelName}' was created: '${JSON.stringify(item)}'`, { ...logOpts, ...{ ref: item?._id }, ...logsMeta });
        return item;
    } catch (e: any) {
        log.debug(`cannot create '${modelName}' ORM item, error: '${e.stack || e}'`, { ...logOpts, ...logsMeta });
    }
    return null;
}
