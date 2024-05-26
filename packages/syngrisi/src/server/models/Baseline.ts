/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface BaselineDocument extends Document {
    snapshootId?: Schema.Types.ObjectId;
    name: { [key: string]: string | boolean | number};
    app: Schema.Types.ObjectId;
    branch?: string;
    browserName?: string;
    browserVersion?: string;
    browserFullVersion?: string;
    viewport?: string;
    os?: string;
    markedAs?: 'bug' | 'accepted';
    lastMarkedDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
    markedById?: Schema.Types.ObjectId;
    markedByUsername?: string;
    ignoreRegions?: string;
    boundRegions?: string;
    matchType?: 'antialiasing' | 'nothing' | 'colors';
    meta?: any;
}

const BaselineSchema: Schema<BaselineDocument> = new Schema({
    snapshootId: {
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: 'VRSBaselineSchema: the name of the snapshoot entity is empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'VRSBaselineSchema: the app field is empty',
    },
    branch: {
        type: String,
    },
    browserName: {
        type: String,
    },
    browserVersion: {
        type: String,
    },
    browserFullVersion: {
        type: String,
    },
    viewport: {
        type: String,
    },
    os: {
        type: String,
    },
    markedAs: {
        type: String,
        enum: ['bug', 'accepted'],
    },
    lastMarkedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
    },
    markedById: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
    },
    markedByUsername: {
        type: String,
    },
    ignoreRegions: {
        type: String,
    },
    boundRegions: {
        type: String,
    },
    matchType: {
        type: String,
        enum: ['antialiasing', 'nothing', 'colors'],
    },
    meta: {
        type: Object,
    },
});

BaselineSchema.plugin(toJSON);
BaselineSchema.plugin(paginate);

const Baseline: Model<BaselineDocument> = mongoose.model<BaselineDocument>('VRSBaseline', BaselineSchema);
export default Baseline;
