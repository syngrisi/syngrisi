import { App } from '@models';
import { FilterQuery } from 'mongoose';
import { PaginateOptions } from '@models/plugins/utils';

const get = async (filter:  FilterQuery<typeof App> , options: PaginateOptions) => App.paginate(filter, options);
const getById = async (id: string) => App.findById(id).exec();
const getByName = async (name: string) => App.findOne({ name }).exec();

export {
    get,
    getById,
    getByName,
};
