import { Schema, Document, FilterQuery } from 'mongoose';
import { EJSON } from 'bson';
import { PaginateOptions, QueryResult } from './utils';

// type QueryResult = {
//   results: Document[];
//   page: number;
//   limit: number;
//   totalPages: number;
//   totalResults: number;
//   timestamp: number;
// };

// type PaginateOptions = {
//   sortBy?: string;
//   populate?: string;
//   limit?: number;
//   page?: number;
//   field: string;
// };

const paginateDistinct = (schema: Schema): void => {
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
  schema.statics.paginateDistinct = async function (filter: FilterQuery<unknown>, options: PaginateOptions): Promise<QueryResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sort: any;
    if (options.sortBy) {
      options.sortBy.split(',')
        .forEach((sortOption: string) => {
          const [key, order] = sortOption.split(':');
          sort[key] = (order === 'desc') ? -1 : 1;
        });
    } else {
      sort = { _id: -1 };
    }

    let limit = options.limit && parseInt(options.limit.toString(), 10) >= 0 ? parseInt(options.limit.toString(), 10) : 10;
    limit = limit === 0 ? 9007199254740991 : limit;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    const groupAggregateObj = { $group: { _id: `$${options.field}` } };

    const documentsCount = (await this.aggregate([groupAggregateObj])
      .exec()).length;
    const aggregateArr = [
      { $match: EJSON.parse(filter.filter || '{}') },
      groupAggregateObj,
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ];
    const aggregatedDocs = (await this.aggregate(aggregateArr))
      .filter((x) => x._id)
      .map((x) => {
        if (x[options.field!]) {
          return x[options.field!][0];
        }
        return { name: x._id };
      });

    return Promise.all([documentsCount, aggregatedDocs])
      .then((values: [number, Document[]]) => {
        const [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);
        const result: QueryResult = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
          timestamp: new Date().getTime(),
        };
        return Promise.resolve(result);
      });
  };
};

export default paginateDistinct;
