import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface BaselineDocument extends Document {
    snapshootId: Schema.Types.ObjectId;
    name: string;
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
    meta?: Record<string, unknown>;
}

const BaselineSchema: Schema<BaselineDocument> = new Schema({
    snapshootId: {
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: [true, 'VRSBaselineSchema: The "name" field must be required'],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: [true, 'VRSBaselineSchema: The "app" field must be required'],
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
export default Baseline as PluginExtededModel<BaselineDocument>;

