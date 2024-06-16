/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

interface RunDocument extends Document {
    name: { [key: string]: string | boolean | number};
    app: Schema.Types.ObjectId;
    ident: { [key: string]: string | boolean | number};
    description?: string;
    updatedDate?: Date;
    createdDate?: Date;
    parameters?: string[];
    meta?: any;
}

const RunSchema: Schema<RunDocument> = new Schema({
    name: {
        type: String,
        required: 'RunSchema: the run name cannot be empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'RunSchema: the app field is empty',
    },
    ident: {
        type: String,
        unique: true,
        required: 'RunSchema: the run ident run cannot be empty',
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

