import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface AppDocument extends Document {
    name: string;
    description?: string;
    version?: string;
    updatedDate?: Date;
    createdDate?: Date;
    meta?: Record<string, unknown>;
}

const AppSchema: Schema<AppDocument> = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: [true, 'AppSchema: The "name" field must be required'],
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    updatedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

AppSchema.plugin(paginate);
AppSchema.plugin(toJSON);

const App: Model<AppDocument> = mongoose.model<AppDocument>('VRSApp', AppSchema);
export default App as PluginExtededModel<AppDocument>;
