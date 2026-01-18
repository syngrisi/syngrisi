import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON } from './plugins';
import { PluginExtededModel } from './plugins/utils';

/**
 * Plugin Settings Model
 * Stores plugin configurations that override environment variables.
 * Settings from DB have priority over ENV variables.
 */

export interface PluginSettingValue {
    value: unknown;
    source: 'db' | 'env' | 'default';
}

export interface PluginSettingsDocument extends Document {
    /** Unique plugin identifier (e.g., 'jwt-auth') */
    pluginName: string;

    /** Plugin display name for UI */
    displayName: string;

    /** Plugin description */
    description?: string;

    /** Whether plugin is enabled (from UI, overrides ENV) */
    enabled: boolean;

    /** Plugin settings as key-value pairs */
    settings: Record<string, unknown>;

    /** Schema definition for settings (for UI form generation) */
    settingsSchema?: PluginSettingSchema[];

    /** Last update timestamp */
    updatedAt: Date;

    /** Created timestamp */
    createdAt: Date;
}

export interface PluginSettingSchema {
    /** Setting key */
    key: string;

    /** Display label */
    label: string;

    /** Description/help text */
    description?: string;

    /** Input type: string, number, boolean, select, password */
    type: 'string' | 'number' | 'boolean' | 'select' | 'password';

    /** Default value */
    defaultValue?: unknown;

    /** Corresponding environment variable */
    envVariable?: string;

    /** Options for select type */
    options?: Array<{ value: string; label: string }>;

    /** Whether this setting is required */
    required?: boolean;
}

const PluginSettingSchemaDefinition = new Schema({
    key: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean', 'select', 'password'],
        required: true
    },
    defaultValue: { type: Schema.Types.Mixed },
    envVariable: { type: String },
    options: [{ value: String, label: String }],
    required: { type: Boolean, default: false },
}, { _id: false });

const PluginSettingsSchema: Schema<PluginSettingsDocument> = new Schema({
    pluginName: {
        type: String,
        unique: true,
        required: [true, 'PluginSettings: pluginName is required'],
        index: true,
    },
    displayName: {
        type: String,
        required: [true, 'PluginSettings: displayName is required'],
    },
    description: {
        type: String,
    },
    enabled: {
        type: Boolean,
        default: false,
    },
    settings: {
        type: Schema.Types.Mixed,
        default: {},
    },
    settingsSchema: {
        type: [PluginSettingSchemaDefinition],
        default: [],
    },
}, {
    timestamps: true,
});

PluginSettingsSchema.plugin(toJSON);

/**
 * Static method to get effective config (merged DB + ENV)
 */
PluginSettingsSchema.statics.getEffectiveConfig = async function (
    pluginName: string,
    envPrefix: string = 'SYNGRISI_PLUGIN_'
): Promise<{ config: Record<string, PluginSettingValue>; enabled: boolean }> {
    const doc = await this.findOne({ pluginName });

    // Build env key from plugin name (e.g., 'jwt-auth' -> 'jwt_AUTH')
    const envPluginKey = pluginName.toUpperCase().replace(/-/g, '_');

    // Check if enabled (DB has priority over ENV)
    const envEnabledKey = `${envPrefix}${envPluginKey}_ENABLED`;
    const envEnabled = process.env[envEnabledKey]?.toLowerCase() === 'true';
    const dbEnabled = doc?.enabled;

    // DB takes priority if document exists
    const enabled = doc ? dbEnabled : envEnabled;

    const config: Record<string, PluginSettingValue> = {};

    // Get schema from document or empty array
    const schema = doc?.settingsSchema || [];

    for (const field of schema) {
        const envKey = field.envVariable || `${envPrefix}${envPluginKey}_${field.key.toUpperCase()}`;
        const envValue = process.env[envKey];
        const dbValue = doc?.settings?.[field.key];

        // DB value takes priority over ENV
        if (dbValue !== undefined) {
            config[field.key] = { value: dbValue, source: 'db' };
        } else if (envValue !== undefined) {
            // Parse env value based on type
            let parsedValue: unknown = envValue;
            if (field.type === 'boolean') {
                parsedValue = envValue.toLowerCase() === 'true';
            } else if (field.type === 'number') {
                parsedValue = parseFloat(envValue);
            }
            config[field.key] = { value: parsedValue, source: 'env' };
        } else if (field.defaultValue !== undefined) {
            config[field.key] = { value: field.defaultValue, source: 'default' };
        }
    }

    return { config, enabled };
};

/**
 * Static method to upsert plugin settings
 */
PluginSettingsSchema.statics.upsertSettings = async function (
    pluginName: string,
    updates: Partial<Pick<PluginSettingsDocument, 'enabled' | 'settings' | 'displayName' | 'description' | 'settingsSchema'>>
): Promise<PluginSettingsDocument> {
    return this.findOneAndUpdate(
        { pluginName },
        { $set: updates },
        { upsert: true, new: true, runValidators: true }
    );
};

export interface PluginSettingsModel extends Model<PluginSettingsDocument> {
    getEffectiveConfig(
        pluginName: string,
        envPrefix?: string
    ): Promise<{ config: Record<string, PluginSettingValue>; enabled: boolean }>;

    upsertSettings(
        pluginName: string,
        updates: Partial<Pick<PluginSettingsDocument, 'enabled' | 'settings' | 'displayName' | 'description' | 'settingsSchema'>>
    ): Promise<PluginSettingsDocument>;
}

const PluginSettings = mongoose.model<PluginSettingsDocument, PluginSettingsModel>(
    'VRSPluginSettings',
    PluginSettingsSchema
);

export default PluginSettings;
