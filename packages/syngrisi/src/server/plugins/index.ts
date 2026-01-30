/**
 * Syngrisi Plugin System
 * 
 * Main entry point for the plugin system.
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '@config';
import { env } from '@/server/envConfig';
import log from '@logger';
import { loadPlugins, pluginManager, hookRegistry } from './core';
import { PluginSettings } from '@models';
import { buildPluginContext } from './sdk/context';
import {
    PluginContext,
    AuthResult,
    CheckCompareContext,
    CheckOverrideResult,
} from './sdk/types';
import { CompareResult } from '@services/comparison.service';

const logOpts = {
    scope: 'PluginSystem',
    msgType: 'PLUGIN',
};

// Re-export SDK types for external use
export * from './sdk';
export * from './core';

/**
 * Initialize the plugin system
 */
export async function initPlugins(): Promise<void> {
    log.info('Initializing plugin system...', logOpts);

    // Parse enabled plugins from environment
    const enabledPlugins = env.SYNGRISI_PLUGINS_ENABLED
        ? env.SYNGRISI_PLUGINS_ENABLED.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    // Build plugin configurations from environment
    const jwtPluginConfig: Record<string, unknown> = {
        jwksUrl: process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL,
        issuer: process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER,
        serviceUserRole: process.env.SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE || 'user',
        headerName: process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME || 'Authorization',
    };

    const headerPrefix = process.env.SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX;
    if (headerPrefix !== undefined) {
        jwtPluginConfig.headerPrefix = headerPrefix;
    }

    const audience = process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUDIENCE;
    if (audience !== undefined) {
        jwtPluginConfig.audience = audience;
    }

    const requiredScopes = process.env.SYNGRISI_PLUGIN_JWT_AUTH_REQUIRED_SCOPES;
    if (requiredScopes !== undefined) {
        jwtPluginConfig.requiredScopes = requiredScopes;
    }

    const issuerMatch = process.env.SYNGRISI_PLUGIN_JWT_AUTH_ISSUER_MATCH;
    if (issuerMatch !== undefined) {
        jwtPluginConfig.issuerMatch = issuerMatch;
    }

    const autoProvisionRaw = process.env.SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION;
    if (autoProvisionRaw !== undefined) {
        jwtPluginConfig.autoProvisionUsers = autoProvisionRaw.toLowerCase() === 'true';
    }

    const jwksCacheTtlRaw = process.env.SYNGRISI_PLUGIN_JWT_AUTH_JWKS_CACHE_TTL;
    if (jwksCacheTtlRaw !== undefined) {
        const parsedTtl = parseInt(jwksCacheTtlRaw, 10);
        if (!Number.isNaN(parsedTtl)) {
            jwtPluginConfig.jwksCacheTtl = parsedTtl;
        }
    }

    const pluginConfigs: Record<string, Record<string, unknown>> = {
        'jwt-auth': jwtPluginConfig,
        'custom-check-validator': {
            mismatchThreshold: parseFloat(env.CHECK_MISMATCH_THRESHOLD || '0'),
            scriptPath: env.CHECK_VALIDATOR_SCRIPT,
        },
    };

    // Validate configuration for enabled plugins
    if (enabledPlugins.includes('jwt-auth')) {
        let jwksUrl = pluginConfigs['jwt-auth']?.jwksUrl as string | undefined;
        let issuer = pluginConfigs['jwt-auth']?.issuer as string | undefined;

        if (!jwksUrl || !issuer) {
            try {
                const dbSettings = await PluginSettings.findOne({ pluginName: 'jwt-auth' }).lean();
                const dbConfig = dbSettings?.settings || {};
                jwksUrl = jwksUrl || (dbConfig as Record<string, unknown>).jwksUrl as string | undefined;
                issuer = issuer || (dbConfig as Record<string, unknown>).issuer as string | undefined;
            } catch (error) {
                log.debug(`Failed to read DB config for jwt-auth during startup validation: ${error}`, logOpts);
            }
        }

        if (!jwksUrl || !issuer) {
            throw new Error(
                'Missing required configuration for "jwt-auth" plugin. ' +
                'Please set SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL and SYNGRISI_PLUGIN_JWT_AUTH_ISSUER environment variables.'
            );
        }

        // Validate JWKS URL format
        try {
            new URL(jwksUrl);
        } catch (error) {
            throw new Error(
                `Invalid JWKS URL for "jwt-auth" plugin: "${jwksUrl}". ` +
                'SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL must be a valid URL.'
            );
        }
    }

    await loadPlugins({
        pluginsDir: env.SYNGRISI_PLUGINS_DIR,
        enabledPlugins,
        pluginConfigs,
    });

    log.info(`Plugin system initialized. Enabled plugins: [${enabledPlugins.join(', ') || 'none'}]`, logOpts);
}

/**
 * Get Express middleware for request:before hooks
 */
export function getPluginMiddleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const hooks = hookRegistry.getHooks('request:before', req.path);

        if (hooks.length === 0) {
            return next();
        }

        const context = buildPluginContext();

        for (const hook of hooks) {
            try {
                await hook.handler!(req, res, next, context);
                // Check if response was sent
                if (res.headersSent) {
                    return;
                }
            } catch (error) {
                log.error(`Error in request:before hook from '${hook.pluginName}': ${error}`, logOpts);
            }
        }

        next();
    };
}

/**
 * Execute auth:validate hook
 * Returns AuthResult if a plugin handled auth, null otherwise
 */
export async function executeAuthHook(req: Request, res: Response): Promise<AuthResult | null> {
    if (!hookRegistry.hasHooks('auth:validate')) {
        return null;
    }

    const context = buildPluginContext();
    return hookRegistry.executeAuthValidate(req, res, context);
}

/**
 * Execute check:beforeCompare hook
 */
export async function executeBeforeCompareHook(
    checkContext: CheckCompareContext
): Promise<CheckCompareContext | { skip: true; result: CheckOverrideResult }> {
    if (!hookRegistry.hasHooks('check:beforeCompare')) {
        return checkContext;
    }

    const pluginContext = buildPluginContext();
    return hookRegistry.executeCheckBeforeCompare(checkContext, pluginContext);
}

/**
 * Execute check:afterCompare hook
 */
export async function executeAfterCompareHook(
    checkContext: CheckCompareContext,
    compareResult: CompareResult
): Promise<CompareResult> {
    if (!hookRegistry.hasHooks('check:afterCompare')) {
        return compareResult;
    }

    const pluginContext = buildPluginContext();
    return hookRegistry.executeCheckAfterCompare(checkContext, compareResult, pluginContext);
}

/**
 * Check if any plugins are loaded
 */
export function hasPlugins(): boolean {
    return pluginManager.getPluginCount() > 0;
}

/**
 * Get loaded plugin names
 */
export function getLoadedPluginNames(): string[] {
    return pluginManager.getPluginNames();
}
