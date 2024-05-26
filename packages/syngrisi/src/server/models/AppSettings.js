const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const { Schema } = mongoose;

const AppSettingsSchema = new Schema({
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

const AppSettings = mongoose.model('VRSAppSettings', AppSettingsSchema);
module.exports = AppSettings;
