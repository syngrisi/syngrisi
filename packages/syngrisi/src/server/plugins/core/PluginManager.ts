/**
 * Syngrisi Plugin System - Plugin Manager
 * 
 * Manages plugin lifecycle: loading, initialization, and unloading.
 */

import log from '@logger';
import {
    SyngrisiPlugin,
    PluginFactory,
    PluginExport,
    LoadedPlugin,
    PluginContext,
    HookName,
} from '../sdk/types';
import { buildPluginContext } from '../sdk/context';
import { hookRegistry, HookRegistry } from './HookRegistry';

const logOpts = {
    scope: 'PluginManager',
    msgType: 'PLUGIN',
};

/**
 * Plugin Manager - handles plugin lifecycle
 */
export class PluginManager {
    private plugins: Map<string, LoadedPlugin> = new Map();
    private context: PluginContext | null = null;
    private registry: HookRegistry;
    private pluginConfigs: Map<string, Record<string, unknown>> = new Map();

    constructor(registry: HookRegistry = hookRegistry) {
        this.registry = registry;
    }

    /**
     * Initialize the plugin manager with application context
     */
    async initialize(pluginConfigs: Record<string, Record<string, unknown>> = {}): Promise<void> {
        log.info('Initializing Plugin Manager', logOpts);

        // Store plugin-specific configs
        for (const [name, config] of Object.entries(pluginConfigs)) {
            this.pluginConfigs.set(name, config);
        }

        // Context will be built when plugins are loaded
        this.context = null;
    }

    /**
     * Register and load a plugin
     */
    async loadPlugin(pluginExport: PluginExport, config?: Record<string, unknown>): Promise<void> {
        let plugin: SyngrisiPlugin;

        // Handle factory functions
        if (typeof pluginExport === 'function') {
            const factory = pluginExport as PluginFactory;
            plugin = factory(config || {});
        } else {
            plugin = pluginExport;
        }

        const { manifest } = plugin;
        const pluginName = manifest.name;

        // Check if already loaded
        if (this.plugins.has(pluginName)) {
            log.warn(`Plugin '${pluginName}' is already loaded, skipping`, logOpts);
            return;
        }

        // Check if enabled (default: true)
        if (manifest.enabled === false) {
            log.info(`Plugin '${pluginName}' is disabled, skipping`, logOpts);
            return;
        }

        log.info(`Loading plugin: ${pluginName} v${manifest.version}`, logOpts);

        const loadedPlugin: LoadedPlugin = {
            plugin,
            loaded: false,
        };

        try {
            // Build context for this plugin
            const pluginConfig = config || this.pluginConfigs.get(pluginName) || {};
            const context = buildPluginContext(pluginConfig);

            // Call onLoad lifecycle hook
            if (plugin.onLoad) {
                await plugin.onLoad(context);
            }

            // Register hooks
            this.registerPluginHooks(plugin);

            loadedPlugin.loaded = true;
            this.plugins.set(pluginName, loadedPlugin);

            log.info(`Plugin '${pluginName}' loaded successfully`, logOpts);
        } catch (error) {
            loadedPlugin.error = error instanceof Error ? error : new Error(String(error));
            this.plugins.set(pluginName, loadedPlugin);
            log.error(`Failed to load plugin '${pluginName}': ${error}`, logOpts);
            throw error;
        }
    }

    /**
     * Register all hooks from a plugin
     */
    private registerPluginHooks(plugin: SyngrisiPlugin): void {
        const { manifest, hooks } = plugin;

        if (!hooks) {
            return;
        }

        const priority = manifest.priority ?? 100;
        const routes = manifest.routes ?? ['*'];

        for (const [hookName, handler] of Object.entries(hooks)) {
            if (handler) {
                this.registry.register(
                    manifest.name,
                    hookName as HookName,
                    handler,
                    priority,
                    routes
                );
            }
        }
    }

    /**
     * Unload a plugin
     */
    async unloadPlugin(pluginName: string): Promise<void> {
        const loadedPlugin = this.plugins.get(pluginName);

        if (!loadedPlugin) {
            log.warn(`Plugin '${pluginName}' is not loaded`, logOpts);
            return;
        }

        log.info(`Unloading plugin: ${pluginName}`, logOpts);

        try {
            // Call onUnload lifecycle hook
            if (loadedPlugin.plugin.onUnload) {
                await loadedPlugin.plugin.onUnload();
            }

            // Unregister hooks
            this.registry.unregister(pluginName);

            // Remove from plugins map
            this.plugins.delete(pluginName);

            log.info(`Plugin '${pluginName}' unloaded successfully`, logOpts);
        } catch (error) {
            log.error(`Error unloading plugin '${pluginName}': ${error}`, logOpts);
            throw error;
        }
    }

    /**
     * Unload all plugins
     */
    async unloadAll(): Promise<void> {
        log.info('Unloading all plugins', logOpts);

        const pluginNames = Array.from(this.plugins.keys());

        for (const pluginName of pluginNames) {
            try {
                await this.unloadPlugin(pluginName);
            } catch (error) {
                log.error(`Error unloading plugin '${pluginName}': ${error}`, logOpts);
            }
        }

        this.registry.clear();
    }

    /**
     * Get a loaded plugin by name
     */
    getPlugin(pluginName: string): LoadedPlugin | undefined {
        return this.plugins.get(pluginName);
    }

    /**
     * Get all loaded plugins
     */
    getLoadedPlugins(): Map<string, LoadedPlugin> {
        return new Map(this.plugins);
    }

    /**
     * Get plugin names
     */
    getPluginNames(): string[] {
        return Array.from(this.plugins.keys());
    }

    /**
     * Check if a plugin is loaded
     */
    isPluginLoaded(pluginName: string): boolean {
        const plugin = this.plugins.get(pluginName);
        return plugin?.loaded ?? false;
    }

    /**
     * Get plugin count
     */
    getPluginCount(): number {
        return this.plugins.size;
    }

    /**
     * Get the hook registry
     */
    getHookRegistry(): HookRegistry {
        return this.registry;
    }
}

// Singleton instance
export const pluginManager = new PluginManager();
