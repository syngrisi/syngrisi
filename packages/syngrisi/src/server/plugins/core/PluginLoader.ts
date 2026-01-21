/**
 * Syngrisi Plugin System - Plugin Loader
 * 
 * Loads plugins from configuration and filesystem.
 * Merges DB settings with ENV variables (DB has priority).
 */

import path from 'path';
import fs from 'fs';
import log from '@logger';
import { PluginExport } from '../sdk/types';
import { pluginManager, PluginManager } from './PluginManager';
import { PluginSettings } from '@models';

const logOpts = {
    scope: 'PluginLoader',
    msgType: 'PLUGIN',
};

export interface PluginLoaderConfig {
    /** Directory containing external plugins */
    pluginsDir?: string;

    /** List of enabled plugin names (for built-in plugins) */
    enabledPlugins?: string[];

    /** Plugin-specific configurations */
    pluginConfigs?: Record<string, Record<string, unknown>>;
}

/**
 * Get effective config for a plugin (merges DB settings with ENV)
 * DB settings have priority over ENV variables.
 */
async function getEffectivePluginConfig(
    pluginName: string,
    envConfig: Record<string, unknown>
): Promise<{ config: Record<string, unknown>; enabled: boolean }> {
    try {
        const effectiveConfig = await PluginSettings.getEffectiveConfig(pluginName);

        // Merge: DB config values override ENV config
        const mergedConfig: Record<string, unknown> = { ...envConfig };

        for (const [key, value] of Object.entries(effectiveConfig.config)) {
            if (value.source === 'db' || value.source === 'env') {
                mergedConfig[key] = value.value;
            }
        }

        return {
            config: mergedConfig,
            enabled: effectiveConfig.enabled,
        };
    } catch (error) {
        // DB not available yet or error - fall back to ENV config
        log.debug(`Could not get DB config for ${pluginName}, using ENV only: ${error}`, logOpts);

        // Check ENV for enabled status
        const envKey = `SYNGRISI_PLUGIN_${pluginName.toUpperCase().replace(/-/g, '_')}_ENABLED`;
        const enabled = process.env[envKey]?.toLowerCase() === 'true';

        return { config: envConfig, enabled };
    }
}

/**
 * Load built-in plugins
 */
async function loadBuiltinPlugins(
    manager: PluginManager,
    enabledPlugins: string[],
    configs: Record<string, Record<string, unknown>>
): Promise<void> {
    const builtinPlugins: Record<string, () => Promise<{ default: PluginExport }>> = {
        'jwt-auth': () => import('../builtin/jwt-auth'),
        'custom-check-validator': () => import('../builtin/custom-check-validator'),
    };

    for (const pluginName of enabledPlugins) {
        if (builtinPlugins[pluginName]) {
            try {
                // Get effective config (DB has priority over ENV)
                const envConfig = configs[pluginName] || {};
                const { config, enabled } = await getEffectivePluginConfig(pluginName, envConfig);

                // Skip if disabled in DB
                if (!enabled && !enabledPlugins.includes(pluginName)) {
                    log.info(`Plugin ${pluginName} is disabled, skipping`, logOpts);
                    continue;
                }

                log.info(`Loading built-in plugin: ${pluginName}`, logOpts);
                const module = await builtinPlugins[pluginName]();
                await manager.loadPlugin(module.default, config);
            } catch (error) {
                log.error(`Failed to load built-in plugin '${pluginName}': ${error}`, logOpts);
            }
        }
    }
}

/**
 * Load external plugins from directory
 */
async function loadExternalPlugins(
    manager: PluginManager,
    pluginsDir: string,
    configs: Record<string, Record<string, unknown>>
): Promise<void> {
    if (!pluginsDir || !fs.existsSync(pluginsDir)) {
        log.debug(`Plugins directory not found: ${pluginsDir}`, logOpts);
        return;
    }

    const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory()) {
            continue;
        }

        const pluginDir = path.join(pluginsDir, entry.name);
        const pluginIndexPath = path.join(pluginDir, 'index.js');
        const pluginTsIndexPath = path.join(pluginDir, 'index.ts');

        let pluginPath: string | null = null;

        if (fs.existsSync(pluginIndexPath)) {
            pluginPath = pluginIndexPath;
        } else if (fs.existsSync(pluginTsIndexPath)) {
            pluginPath = pluginTsIndexPath;
        }

        if (!pluginPath) {
            log.warn(`No index file found for plugin in ${pluginDir}`, logOpts);
            continue;
        }

        try {
            log.info(`Loading external plugin from: ${pluginDir}`, logOpts);

            // Dynamic import
            const module = await import(pluginPath);
            const pluginExport: PluginExport = module.default || module;

            // Get plugin name for config lookup
            const pluginName = typeof pluginExport === 'function'
                ? entry.name
                : pluginExport.manifest.name;

            // Get effective config (DB has priority over ENV)
            const envConfig = configs[pluginName] || {};
            const { config, enabled } = await getEffectivePluginConfig(pluginName, envConfig);

            // Skip if disabled
            if (!enabled) {
                log.info(`External plugin ${pluginName} is disabled, skipping`, logOpts);
                continue;
            }

            await manager.loadPlugin(pluginExport, config);
        } catch (error) {
            log.error(`Failed to load external plugin from '${pluginDir}': ${error}`, logOpts);
        }
    }
}

/**
 * Load all plugins based on configuration
 */
export async function loadPlugins(config: PluginLoaderConfig = {}): Promise<void> {
    const {
        pluginsDir,
        enabledPlugins = [],
        pluginConfigs = {},
    } = config;

    log.info('Loading plugins...', logOpts);

    // Initialize plugin manager
    await pluginManager.initialize(pluginConfigs);

    // Load built-in plugins
    if (enabledPlugins.length > 0) {
        await loadBuiltinPlugins(pluginManager, enabledPlugins, pluginConfigs);
    }

    // Load external plugins
    if (pluginsDir) {
        await loadExternalPlugins(pluginManager, pluginsDir, pluginConfigs);
    }

    const loadedCount = pluginManager.getPluginCount();
    log.info(`Loaded ${loadedCount} plugin(s)`, logOpts);
}

/**
 * Get the plugin manager instance
 */
export function getPluginManager(): PluginManager {
    return pluginManager;
}

