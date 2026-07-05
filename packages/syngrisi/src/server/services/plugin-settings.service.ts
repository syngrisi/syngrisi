import { PluginSettings } from '@models';
import { PluginSettingsDocument, PluginSettingSchema } from '@models/PluginSettings.model';

/**
 * Plugin Settings Service
 * Thin wrapper around the PluginSettings model so controllers don't import @models directly.
 */

const find = async (filter: Record<string, unknown> = {}) => PluginSettings.find(filter);

const findOne = async (filter: Record<string, unknown>) => PluginSettings.findOne(filter);

const getEffectiveConfig = async (pluginName: string, envPrefix?: string) =>
    PluginSettings.getEffectiveConfig(pluginName, envPrefix);

const upsertSettings = async (
    pluginName: string,
    updates: Partial<Pick<PluginSettingsDocument, 'enabled' | 'settings' | 'displayName' | 'description' | 'settingsSchema'>>
) => PluginSettings.upsertSettings(pluginName, updates);

const updateOne = async (filter: Record<string, unknown>, update: Record<string, unknown>) =>
    PluginSettings.updateOne(filter, update);

const create = async (doc: {
    pluginName: string;
    displayName: string;
    description?: string;
    enabled: boolean;
    settings: Record<string, unknown>;
    settingsSchema: PluginSettingSchema[];
}) => PluginSettings.create(doc);

export {
    find,
    findOne,
    getEffectiveConfig,
    upsertSettings,
    updateOne,
    create,
};
