import mongoose, { Schema, Document, Model, FilterQuery } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel, PaginateOptions, QueryResult } from './plugins/utils';
import { deserializeIfJSON } from '@utils';

export interface TestDocument extends Document {
    name: string;
    description?: string;
    status?: string;
    browserName: string;
    browserVersion: string;
    branch?: string;
    tags?: string[];
    viewport: string;
    calculatedViewport?: string;
    // calculatedStatus?: string;
    os: string;
    app: Schema.Types.ObjectId;
    blinking?: number;
    updatedDate: Date;
    startDate: Date;
    checks?: Schema.Types.ObjectId[];
    suite?: Schema.Types.ObjectId;
    run: Schema.Types.ObjectId;
    markedAs?: 'Bug' | 'Accepted' | 'Unaccepted' | 'Partially';
    creatorId?: Schema.Types.ObjectId;
    creatorUsername?: string;
    meta?: Record<string, unknown>;
}

const TestSchema: Schema<TestDocument> = new Schema(
    {
        name: {
            type: String,
            required: 'TestSchema: the test name is empty',
        },
        description: {
            type: String,
        },
        status: {
            type: String,
        },
        browserName: {
            type: String,
        },
        browserVersion: {
            type: String,
        },
        branch: {
            type: String,
        },
        tags: {
            type: [String],
        },
        viewport: {
            type: String,
        },
        calculatedViewport: {
            type: String,
        },
        os: {
            type: String,
        },
        app: {
            type: Schema.Types.ObjectId,
            ref: 'VRSApp',
            required: [true, 'TestSchema: The "app" field must be required'],

        },
        blinking: {
            type: Number,
            default: 0,
        },
        updatedDate: {
            type: Date,
        },
        startDate: {
            type: Date,
        },
        checks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'VRSCheck',
            },
        ],
        suite: {
            type: Schema.Types.ObjectId,
            ref: 'VRSSuite',
        },
        run: {
            type: Schema.Types.ObjectId,
            ref: 'VRSRun',
        },
        markedAs: {
            type: String,
            enum: ['Bug', 'Accepted', 'Unaccepted', 'Partially'],
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'VRSUser',
        },
        creatorUsername: {
            type: String,
        },
        meta: {
            type: Object,
        },
    },
    { strictQuery: true }
);

TestSchema.plugin(toJSON);
TestSchema.plugin(paginate);

TestSchema.statics.paginateDistinct = async function (
    filter: FilterQuery<unknown>,
    options: PaginateOptions
): Promise<QueryResult> {
    let sort: Record<string, 1 | -1> = { _id: -1 };

    if (options.sortBy) {
        sort = {};
        options.sortBy.split(',').forEach((sortOption: string) => {
            const [key, order] = sortOption.split(':');
            sort[key] = order === 'desc' ? -1 : 1;
        });
    }

    let limit =
        options.limit && parseInt(options.limit.toString(), 10) >= 0
            ? parseInt(options.limit.toString(), 10)
            : 10;
    limit = limit === 0 ? Number.MAX_SAFE_INTEGER : limit;

    const page =
        options.page && parseInt(options.page.toString(), 10) > 0
            ? parseInt(options.page.toString(), 10)
            : 1;
    const skip = (page - 1) * limit;
    const groupAggregateObj = { $group: { _id: `$${options.field}` } };
    const parsedFilter =
        typeof filter?.filter === 'string' ? deserializeIfJSON(filter.filter) || {} : {};

    const documentsCount = (
        await this.aggregate([{ $match: parsedFilter }, groupAggregateObj]).exec()
    ).length;

    const aggregatedDocs = (await this.aggregate([
        { $match: parsedFilter },
        groupAggregateObj,
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
    ]))
        .filter((x: { _id?: unknown }) => x._id)
        .map((x: Record<string, unknown>) => {
            const fieldValue = options.field ? x[options.field] : undefined;
            if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                return fieldValue[0] as Document;
            }
            return { name: x._id } as Document;
        });

    const totalPages = Math.ceil(documentsCount / limit);

    return {
        results: aggregatedDocs,
        page,
        limit,
        totalPages,
        totalResults: documentsCount,
        timestamp: Date.now(),
    };
};

const Test: Model<TestDocument> = mongoose.model<TestDocument>('VRSTest', TestSchema);

export default Test as PluginExtededModel<TestDocument>;
