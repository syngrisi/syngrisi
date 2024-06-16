/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate, paginateDistinct } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface TestDocument extends Document {
    name: { [key: string]: string | boolean | number};
    description?: string;
    status?: string;
    browserName?: string;
    browserVersion?: string;
    branch?: string;
    tags?: string[];
    viewport?: string;
    calculatedViewport?: string;
    os?: string;
    app: Schema.Types.ObjectId;
    blinking?: number;
    updatedDate?: Date;
    startDate?: Date;
    checks?: Schema.Types.ObjectId[];
    suite?: Schema.Types.ObjectId;
    run?: Schema.Types.ObjectId;
    markedAs?: 'Bug' | 'Accepted' | 'Unaccepted' | 'Partially';
    creatorId?: Schema.Types.ObjectId;
    creatorUsername?: string;
    meta?: any;
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
            required: 'TestSchema: the app field is empty',
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
TestSchema.plugin(paginateDistinct);

const Test: Model<TestDocument> = mongoose.model<TestDocument>('VRSTest', TestSchema);


export default Test as PluginExtededModel<TestDocument>;
