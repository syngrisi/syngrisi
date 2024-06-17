import mongoose, { FilterQuery } from 'mongoose';
import { removeEmptyProperties } from '@utils';
import log from '@logger';
import { ExtededModelMembers, PaginateOptions } from '@models/plugins/utils';
import { RequestUser } from '@root/src/types';

const get = async (modelName: string, filter: FilterQuery<typeof Test>, options: PaginateOptions) => {
    const itemModel = mongoose.model(modelName);
    return (itemModel as unknown as ExtededModelMembers<typeof itemModel>).paginate(filter, options);
};

const put = async (modelName: string, id: string, options: object, user: RequestUser) => {
    const itemModel = mongoose.model(modelName);

    const logOpts = {
        scope: 'generic.service.put',
        ref: id,
        itemType: modelName,
        msgType: 'UPDATE',
        user: user?.username,
    };

    const opts = removeEmptyProperties(options);
    log.debug(`start update '${modelName}' with id: '${id}', body: '${JSON.stringify(opts)}'`, logOpts);
    const item = await itemModel.findByIdAndUpdate(id, options).exec();
    if (!item) throw new Error(`cannot find the item: ${modelName}, id: ${id}, options: ${JSON.stringify(options)}`);


    await item.save();
    log.debug(`baseline with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`, logOpts);
    return item;
};

export {
    get,
    put,
};
