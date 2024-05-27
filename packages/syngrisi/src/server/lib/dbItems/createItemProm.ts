/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log from "../logger";

const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function createItemProm(modelName: string, params: any): Promise<any> {
    try {
        const itemModel = mongoose.model(modelName);
        log.debug(`start to create ORM item via promise: '${modelName}', params: '${JSON.stringify(params)}'`, fileLogMeta);
        const item = await itemModel.create(params);
        return item;
    } catch (e: any) {
        const errMsg = `cannot create '${modelName}', error: '${e.stack || e}'`;
        log.error(errMsg, fileLogMeta);
        throw new Error(errMsg);
    }
}
