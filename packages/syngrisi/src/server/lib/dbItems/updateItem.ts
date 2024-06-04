/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import log from "../logger";


export async function updateItem(itemType: string, filter: any, params: any): Promise<any> {
    const logOpts = {
        scope: 'updateItem',
        msgType: 'UPDATE',
        itemType,
    };
    log.debug(`update item type: '${itemType}', filter: '${JSON.stringify(filter)}', params: '${JSON.stringify(params)}'`, logOpts);
    const itemModel = await mongoose.model(itemType).findOne(filter);
    const updatedItem = await itemModel?.updateOne(params);
    log.debug(`'${itemType}' was updated: '${JSON.stringify(updatedItem)}'`, { ...logOpts, ...{ ref: String(itemModel?._id) } });
    return updatedItem;
}
