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
    triagePolicy?: {
        policy: 'suggest' | 'auto';
        autoAcceptThreshold: number; // 0..10
        autoAcceptVerdicts: string[];
    };
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
    triagePolicy: {
        type: {
            policy: { type: String, enum: ['suggest', 'auto'], default: 'suggest' },
            autoAcceptThreshold: { type: Number, min: 0, max: 10, default: 9 },
            autoAcceptVerdicts: { type: [String], default: ['intended_change', 'noise'] },
        },
        _id: false,
        default: undefined,
    },
});

AppSchema.plugin(paginate);
AppSchema.plugin(toJSON);

const App: Model<AppDocument> = mongoose.model<AppDocument>('VRSApp', AppSchema);
export default App as PluginExtededModel<AppDocument>;
