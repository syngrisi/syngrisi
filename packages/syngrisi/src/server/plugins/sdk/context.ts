/**
 * Syngrisi Plugin SDK - Context Builder
 * 
 * Creates plugin context with access to app resources.
 */

import { Check, User, Baseline } from '@models';
import { config } from '@config';
import log from '@logger';
import { PluginContext, AppConfig } from './types';

/**
 * Build plugin context from application resources
 */
export function buildPluginContext(pluginConfig: Record<string, unknown> = {}): PluginContext {
    const appConfig: AppConfig = {
        connectionString: config.connectionString,
        defaultImagesPath: config.defaultImagesPath,
    };

    return {
        config: appConfig,
        logger: log,
        models: {
            User,
            Check,
            Baseline,
        },
        pluginConfig,
    };
}
