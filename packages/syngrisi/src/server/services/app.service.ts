import { App } from '@models';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '@models/plugins/utils';

const get = async (filter:  FilterQuery<typeof App> , options: PaginateOptions) => App.paginate(filter, options);

export {
    get,
};
