
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface RunDocument extends Document {
    name: string;
    app: Schema.Types.ObjectId;
    ident: string;
    description?: string;
    updatedDate?: Date;
    createdDate?: Date;
    parameters?: string[];
    meta?: Record<string, unknown>;
}

const RunSchema: Schema<RunDocument> = new Schema({
    name: {
        type: String,
        required: [true, 'RunSchema: The "name" field must be required'],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: [true, 'RunSchema: The "app" field must be required'],
    },
    ident: {
        type: String,
        unique: true,
        required: [true, 'RunSchema: The "ident" field must be required'],
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
    parameters: {
        type: [String],
    },
    meta: {
        type: Object,
    },
});

RunSchema.plugin(paginate);
RunSchema.plugin(toJSON);

const Run: Model<RunDocument> = mongoose.model<RunDocument>('VRSRun', RunSchema);
export default Run as PluginExtededModel<RunDocument>;

