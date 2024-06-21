import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface SuiteDocument extends Document {
    name: { [key: string]: string | boolean | number };
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
        required: 'SuiteSchema: the suite name is empty',
    },
    tags: {
        type: [String],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'SuiteSchema: the app field is empty',
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
