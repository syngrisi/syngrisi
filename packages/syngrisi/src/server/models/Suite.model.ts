import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface SuiteDocument extends Document {
    name: string;
    tags?: string[];
    app: Schema.Types.ObjectId;
    description?: string;
    updatedDate?: Date;
    createdDate?: Date;
    meta?: Record<string, unknown>;
}

const SuiteSchema: Schema<SuiteDocument> = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: [true, 'SuiteSchema: The "name" field must be required'],
    },
    tags: {
        type: [String],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: [true, 'SuiteSchema: The "app" field must be required'],
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

SuiteSchema.plugin(paginate);
SuiteSchema.plugin(toJSON);

const Suite: Model<SuiteDocument> = mongoose.model<SuiteDocument>('VRSSuite', SuiteSchema);

export default Suite as PluginExtededModel<SuiteDocument>;
