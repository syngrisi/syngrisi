/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface AppDocument extends Document {
    name: { [key: string]: string | boolean | number};
    description?: string;
    version?: string;
    updatedDate?: Date;
    createdDate?: Date;
    meta?: any;
}

const AppSchema: Schema<AppDocument> = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'AppSchema: the Application name is empty',
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
export default App;
