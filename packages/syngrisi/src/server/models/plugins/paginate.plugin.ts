/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Document, QueryOptions } from 'mongoose';
import { string } from 'zod';

interface QueryResult<T extends Document> {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    timestamp: number;
}

const paginate = <T extends Document>(schema: Model<T>) => {
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc).
     * Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.).
     * Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @returns {Promise<QueryResult>}
     */
    (schema as any).statics.paginate = async function (
        this: Model<T>,
        filter: object,
        options: QueryOptions
    ): Promise<QueryResult<T>> {
        let sort: any = '';
        if (options.sortBy) {
            const sortingCriteria: any[] = [];
            options.sortBy.split(',').forEach((sortOption: any) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = { _id: -1 };
        }

        const limit =
            options.limit && parseInt(options.limit.toString(), 10) >= 0
                ? parseInt(options.limit.toString(), 10)
                : 10;
        const page =
            options.page && parseInt(options.page, 10) > 0
                ? parseInt(options.page, 10)
                : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        if (options.populate && options.populate instanceof String) {
            options.populate?.split(',').forEach((populateOption) => {
                // @ts-ignore
                docsPromise = docsPromise.populate(
                    populateOption
                        .split('.')
                        .reverse()
                        // @ts-ignore
                        .reduce((a, b) => ({ path: b, populate: a }))
                );
            });
        }

        // @ts-ignore
        docsPromise = docsPromise.exec();

        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result: QueryResult<T> = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
                // microseconds
                timestamp: Number(Date.now() + String(process.hrtime()[1]).slice(3, 6)),
            };
            return Promise.resolve(result);
        });
    };
};

export default paginate;
