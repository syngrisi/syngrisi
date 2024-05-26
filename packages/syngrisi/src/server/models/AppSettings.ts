/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from './plugins';

interface AppSettingsDocument extends Document {
    name: { [key: string]: string | boolean | number };
    label: { [key: string]: string };
    description?: string;
    type: { [key: string]: string };
    value: any;
    env_variable?: string;
    enabled?: boolean;
}

const AppSettingsSchema: Schema<AppSettingsDocument> = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'AppSettingsSchema: the name is empty',
    },
    label: {
        type: String,
        required: 'AppSettingsSchema: the label is empty',
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        required: 'AppSettingsSchema: the type is empty',
    },
    value: {
        type: Schema.Types.Mixed,
        required: 'AppSettingsSchema: the value is empty',
    },
    env_variable: {
        type: String,
    },
    enabled: {
        type: Boolean,
    },
});

AppSettingsSchema.plugin(toJSON);

const AppSettings: Model<AppSettingsDocument> = mongoose.model<AppSettingsDocument>('VRSAppSettings', AppSettingsSchema);
export default AppSettings;
