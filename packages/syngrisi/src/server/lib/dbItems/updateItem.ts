/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log2 from "../../lib/logger2";


const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function updateItem(itemType: string, filter: any, params: any): Promise<any> {
    const logOpts = {
        scope: 'updateItem',
        msgType: 'UPDATE',
        itemType,
    };
    log2.debug(`update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`, fileLogMeta, logOpts);
    const itemModel = await mongoose.model(itemType).findOne(filter);
    const updatedItem = await itemModel?.updateOne(params);
    log2.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, fileLogMeta, { ...logOpts, ...{ ref: itemModel?._id } });
    return updatedItem;
}
