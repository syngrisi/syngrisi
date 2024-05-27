/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import log2 from "../../lib/logger2";


const fileLogMeta = {
    scope: 'dbitems',
    msgType: 'DB',
};

export async function updateItemDate(mdClass: string, id: any): Promise<any> {
    log2.debug(`update date for the item: '${mdClass}' with id: '${id}'`, fileLogMeta);
    const itemModel = await mongoose.model(mdClass).findById(id);
    const updatedItem = await itemModel?.updateOne({ updatedDate: Date.now() });
    log2.debug(`'${mdClass}' date updated: '${JSON.stringify(itemModel)}'`, fileLogMeta);
    return updatedItem;
}
