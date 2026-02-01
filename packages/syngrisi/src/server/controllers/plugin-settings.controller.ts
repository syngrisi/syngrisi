/**
 * Plugin Settings Controller
 * Handles CRUD operations for plugin configurations.
 */

import { Request, Response } from 'express';
import { PluginSettings } from '@models';
import { getPluginManager } from '../plugins/core/PluginLoader';
import log from '@logger';

const logOpts = { scope: 'PluginSettingsController' };

/**
 * Get all plugins with their effective configuration
 */
export const getAllPluginSettings = async (req: Request, res: Response): Promise<void> => {
    log.info('getAllPluginSettings: Request received', logOpts);
    try {
        // Get all plugin settings from DB
        const dbSettings = await PluginSettings.find({});

        // Get loaded plugins from PluginManager
        const pluginManager = getPluginManager();
        const loadedPlugins = pluginManager.getLoadedPlugins();

        // Build combined response
        const plugins = [];

        // Add DB-configured plugins
        for (const doc of dbSettings) {
            const effectiveConfig = await PluginSettings.getEffectiveConfig(doc.pluginName);
            const loadedPlugin = loadedPlugins.get(doc.pluginName);

            plugins.push({
                pluginName: doc.pluginName,
                displayName: doc.displayName,
                description: doc.description,
                enabled: effectiveConfig.enabled,
                loaded: loadedPlugin?.loaded ?? false,
                version: loadedPlugin?.plugin.manifest.version,
                settings: doc.settings,
                settingsSchema: doc.settingsSchema,
                effectiveConfig: effectiveConfig.config,
                updatedAt: doc.updatedAt,
            });
        }

        // Add loaded plugins that don't have DB settings yet
        for (const [name, loadedPlugin] of loadedPlugins) {
            if (!dbSettings.find(d => d.pluginName === name)) {
                const effectiveConfig = await PluginSettings.getEffectiveConfig(name);
                plugins.push({
                    pluginName: name,
                    displayName: loadedPlugin.plugin.manifest.name,
                    description: loadedPlugin.plugin.manifest.description,
                    enabled: effectiveConfig.enabled,
                    loaded: loadedPlugin.loaded,
                    version: loadedPlugin.plugin.manifest.version,
                    settings: {},
                    settingsSchema: [],
                    effectiveConfig: effectiveConfig.config,
                    updatedAt: null,
                });
            }
        }

        res.json({ plugins });
    } catch (error) {
        log.error(`Failed to get plugin settings: ${error}`, logOpts);
        res.status(500).json({ error: 'Failed to get plugin settings' });
    }
};

/**
 * Get single plugin settings with effective configuration
 */
export const getPluginSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pluginName } = req.params;

        const doc = await PluginSettings.findOne({ pluginName });
        const effectiveConfig = await PluginSettings.getEffectiveConfig(pluginName);

        const pluginManager = getPluginManager();
        const loadedPlugin = pluginManager.getPlugin(pluginName);

        res.json({
            pluginName,
            displayName: doc?.displayName || loadedPlugin?.plugin.manifest.name || pluginName,
            description: doc?.description || loadedPlugin?.plugin.manifest.description,
            enabled: effectiveConfig.enabled,
            loaded: loadedPlugin?.loaded ?? false,
            version: loadedPlugin?.plugin.manifest.version,
            settings: doc?.settings || {},
            settingsSchema: doc?.settingsSchema || [],
            effectiveConfig: effectiveConfig.config,
            updatedAt: doc?.updatedAt || null,
        });
    } catch (error) {
        log.error(`Failed to get plugin settings: ${error}`, logOpts);
        res.status(500).json({ error: 'Failed to get plugin settings' });
    }
};

/**
 * Update plugin settings
 */
export const updatePluginSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pluginName } = req.params;
        const { enabled, settings, displayName, description, settingsSchema } = req.body;

        // Validate jwt-auth configuration if being enabled or updated
        if (pluginName === 'jwt-auth' && (enabled || settings)) {
            const effectiveConfig = await PluginSettings.getEffectiveConfig(pluginName);
            const newSettings = settings || effectiveConfig.config;

            // Check for required fields
            const jwksUrl = newSettings.jwksUrl?.value || settings?.jwksUrl;
            const issuer = newSettings.issuer?.value || settings?.issuer;

            if (enabled && (!jwksUrl || !issuer)) {
                res.status(400).json({
                    error: 'Missing required configuration for jwt-auth plugin',
                    details: 'jwksUrl and issuer are required when enabling jwt-auth plugin'
                });
                return;
            }

            // Validate JWKS URL format if provided
            if (jwksUrl) {
                try {
                    new URL(jwksUrl);
                } catch (error) {
                    res.status(400).json({
                        error: 'Invalid JWKS URL format',
                        details: `jwksUrl must be a valid URL: ${jwksUrl}`
                    });
                    return;
                }
            }
        }

        const updates: Record<string, unknown> = {};
        if (enabled !== undefined) updates.enabled = enabled;
        if (settings !== undefined) updates.settings = settings;
        if (displayName !== undefined) updates.displayName = displayName;
        if (description !== undefined) updates.description = description;
        if (settingsSchema !== undefined) updates.settingsSchema = settingsSchema;

        const doc = await PluginSettings.upsertSettings(pluginName, updates);
        const effectiveConfig = await PluginSettings.getEffectiveConfig(pluginName);

        log.info(`Plugin settings updated: ${pluginName}`, logOpts);

        res.json({
            pluginName: doc.pluginName,
            displayName: doc.displayName,
            description: doc.description,
            enabled: effectiveConfig.enabled,
            settings: doc.settings,
            settingsSchema: doc.settingsSchema,
            effectiveConfig: effectiveConfig.config,
            updatedAt: doc.updatedAt,
            message: 'Settings updated. Server restart may be required for changes to take effect.',
        });
    } catch (error) {
        log.error(`Failed to update plugin settings: ${error}`, logOpts);
        res.status(500).json({ error: 'Failed to update plugin settings' });
    }
};

/**
 * Toggle plugin enabled/disabled
 */
export const togglePlugin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pluginName } = req.params;
        const { enabled } = req.body;

        if (typeof enabled !== 'boolean') {
            res.status(400).json({ error: 'enabled must be a boolean' });
            return;
        }

        const doc = await PluginSettings.upsertSettings(pluginName, { enabled });

        log.info(`Plugin ${pluginName} ${enabled ? 'enabled' : 'disabled'}`, logOpts);

        res.json({
            pluginName: doc.pluginName,
            enabled: doc.enabled,
            message: `Plugin ${enabled ? 'enabled' : 'disabled'}. Server restart required.`,
        });
    } catch (error) {
        log.error(`Failed to toggle plugin: ${error}`, logOpts);
        res.status(500).json({ error: 'Failed to toggle plugin' });
    }
};

/**
 * Register plugin schema (called by plugins on load)
 */
export const registerPluginSchema = async (
    pluginName: string,
    displayName: string,
    description: string,
    settingsSchema: Array<{
        key: string;
        label: string;
        description?: string;
        type: 'string' | 'number' | 'boolean' | 'select' | 'password';
        defaultValue?: unknown;
        envVariable?: string;
        options?: Array<{ value: string; label: string }>;
        required?: boolean;
    }>
): Promise<void> => {
    try {
        // Only update schema, don't override existing settings
        const existing = await PluginSettings.findOne({ pluginName });

        if (existing) {
            // Update schema but keep existing settings
            await PluginSettings.updateOne(
                { pluginName },
                {
                    $set: {
                        settingsSchema,
                        displayName,
                        description,
                    }
                }
            );
        } else {
            // Check environment variable for initial enabled state
            const envPluginKey = pluginName.toUpperCase().replace(/-/g, '_');
            const envEnabledKey = `SYNGRISI_PLUGIN_${envPluginKey}_ENABLED`;
            const initialEnabled = process.env[envEnabledKey]?.toLowerCase() === 'true';

            // Create new entry
            await PluginSettings.create({
                pluginName,
                displayName,
                description,
                enabled: initialEnabled,
                settings: {},
                settingsSchema,
            });
        }

        log.info(`Plugin schema registered: ${pluginName}`, logOpts);
    } catch (error) {
        log.error(`Failed to register plugin schema: ${error}`, logOpts);
    }
};
