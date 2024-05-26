/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Schema, Document } from 'mongoose';

type QueryResult = {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  timestamp: number;
};

type PaginateOptions = {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
};

const paginate = (schema: Schema) => {
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
  schema.statics.paginate = async function (filter: any, options: PaginateOptions): Promise<QueryResult> {
    let sort: any = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',')
        .forEach((sortOption: string) => {
          const [key, order] = sortOption.split(':');
          sortingCriteria.push((order === 'desc' ? '-' : '') + key);
        });
      sort = sortingCriteria.join(' ');
    } else {
      sort = { _id: -1 };
    }

    const limit = options.limit && parseInt(options.limit.toString(), 10) >= 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      options.populate.split(',')
        .forEach((populateOption: string) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split('.')
              .reverse()
              // @ts-ignore
              .reduce((a: any, b: any) => ({ path: b, populate: a }))
          );
        });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise])
      .then((values: [number, Document[]]) => {
        const [totalResults, results] = values;
        const totalPages = Math.ceil(totalResults / limit);
        const result: QueryResult = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
          timestamp: Number(Date.now() + String(process.hrtime()[1]).slice(3, 6)),
        };
        return Promise.resolve(result);
      });
  };
};

export default paginate;
