/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log from "@logger";


const logOpts = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function updateItemDate(mdClass: string, id: any): Promise<any> {
    log.debug(`update date for the item: '${mdClass}' with id: '${id}'`, logOpts);
    const itemModel = await mongoose.model(mdClass).findById(id);
    const updatedItem = await itemModel?.updateOne({ updatedDate: Date.now() });
    log.debug(`'${mdClass}' date updated: '${JSON.stringify(itemModel)}'`, logOpts);
    return updatedItem;
}
