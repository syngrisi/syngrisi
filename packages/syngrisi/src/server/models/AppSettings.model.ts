import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface AppSettingsDocument extends Document {
    name: string;
    label: string;
    description?: string;
    type: { [key: string]: string };
    value: Schema.Types.Mixed;
    env_variable?: string;
    enabled?: boolean;
}

const AppSettingsSchema: Schema<AppSettingsDocument> = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'AppSettingsSchema: The "name" field must be required'],
    },
    label: {
        type: String,
        required: [true, 'AppSettingsSchema: The "label" field must be required'],
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        required: [true, 'AppSettingsSchema: The "type" field must be required'],
    },
    value: {
        type: Schema.Types.Mixed,
        required: [true, 'AppSettingsSchema: The "value" field must be required'],
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
export default AppSettings as PluginExtededModel<AppSettingsDocument>;

