/**
 * Custom Check Validator Plugin
 * 
 * Allows custom logic for determining check pass/fail status.
 * Supports:
 * - Configurable mismatch threshold
 * - Custom JavaScript validation scripts
 */

import fs from 'fs';
import vm from 'vm';
import { SyngrisiPlugin, PluginContext, CheckCompareContext } from '../../sdk/types';
import { CompareResult } from '@services/comparison.service';

interface CheckValidatorConfig {
    /** Mismatch percentage threshold below which checks pass (default: 0) */
    mismatchThreshold: number;

    /** Path to custom validation script (optional) */
    scriptPath?: string;

    /** Inline validation script (optional, takes precedence over scriptPath) */
    script?: string;
}

interface ValidationContext {
    /** Check context (snapshots, params, baseline) */
    check: CheckCompareContext;

    /** Comparison result */
    result: CompareResult;

    /** Parsed result data */
    resultData: {
        rawMisMatchPercentage?: number;
        isSameDimensions?: boolean;
        dimensionDifference?: { width: number; height: number };
        analysisTime?: number;
        [key: string]: unknown;
    };

    /** Logger for the script */
    log: (message: string) => void;
}

interface ValidationResult {
    /** Override status (if set, replaces original status) */
    status?: 'passed' | 'failed';

    /** Override fail reasons */
    failReasons?: string[];

    /** Message explaining the decision */
    message?: string;
}

/**
 * Load and compile validation script
 */
function loadScript(
    config: CheckValidatorConfig,
    logger: PluginContext['logger']
): ((ctx: ValidationContext) => ValidationResult | void) | null {
    let scriptSource: string | undefined;

    // Inline script takes precedence
    if (config.script) {
        scriptSource = config.script;
    } else if (config.scriptPath && fs.existsSync(config.scriptPath)) {
        try {
            scriptSource = fs.readFileSync(config.scriptPath, 'utf-8');
            logger.info(`Loaded validation script from: ${config.scriptPath}`, { scope: 'custom-check-validator' });
        } catch (error) {
            logger.error(`Failed to load validation script: ${error}`, { scope: 'custom-check-validator' });
            return null;
        }
    }

    if (!scriptSource) {
        return null;
    }

    try {
        // Wrap script in a function
        const wrappedScript = `
            (function(ctx) {
                ${scriptSource}
            })
        `;

        const script = new vm.Script(wrappedScript, {
            filename: 'validation-script.js',
        });

        // Run in a new context to get the function
        const sandbox = {};
        const context = vm.createContext(sandbox);
        const fn = script.runInContext(context);

        return fn as (ctx: ValidationContext) => ValidationResult | void;
    } catch (error) {
        logger.error(`Failed to compile validation script: ${error}`, { scope: 'custom-check-validator' });
        return null;
    }
}

/**
 * Custom Check Validator Plugin factory
 */
export function createCustomCheckValidator(config: Partial<CheckValidatorConfig> = {}): SyngrisiPlugin {
    const fullConfig: CheckValidatorConfig = {
        mismatchThreshold: config.mismatchThreshold ?? 0,
        scriptPath: config.scriptPath,
        script: config.script,
    };

    let validationScript: ((ctx: ValidationContext) => ValidationResult | void) | null = null;

    return {
        manifest: {
            name: 'custom-check-validator',
            version: '1.0.0',
            description: 'Custom check validation with threshold and scripting support',
            author: 'Syngrisi Team',
            routes: ['/v1/client/*'],
            priority: 50,
        },

        async onLoad(context: PluginContext): Promise<void> {
            // Merge config from plugin context
            Object.assign(fullConfig, context.pluginConfig);

            context.logger.info('Custom Check Validator plugin loaded', {
                scope: 'custom-check-validator',
                msgType: 'PLUGIN',
                mismatchThreshold: fullConfig.mismatchThreshold,
                hasScript: !!(fullConfig.script || fullConfig.scriptPath),
            });

            // Load validation script if provided
            validationScript = loadScript(fullConfig, context.logger);
        },

        hooks: {
            'check:afterCompare': async (
                checkContext: CheckCompareContext,
                compareResult: CompareResult,
                pluginContext: PluginContext
            ): Promise<CompareResult> => {
                const logger = pluginContext.logger;
                const logOpts = { scope: 'custom-check-validator', msgType: 'VALIDATE' };

                // Parse result data
                let resultData: ValidationContext['resultData'] = {};
                try {
                    if (compareResult.result) {
                        resultData = JSON.parse(compareResult.result);
                    }
                } catch {
                    // Ignore parse errors
                }

                const mismatch = resultData.rawMisMatchPercentage ?? 0;

                // Check threshold
                if (fullConfig.mismatchThreshold > 0 && mismatch > 0 && mismatch < fullConfig.mismatchThreshold) {
                    logger.info(
                        `Mismatch ${mismatch}% is below threshold ${fullConfig.mismatchThreshold}%, marking as passed`,
                        logOpts
                    );

                    return {
                        ...compareResult,
                        status: 'passed',
                        failReasons: [],
                        result: JSON.stringify({
                            ...resultData,
                            pluginOverride: {
                                plugin: 'custom-check-validator',
                                reason: `Mismatch ${mismatch}% below threshold ${fullConfig.mismatchThreshold}%`,
                            },
                        }, null, '\t'),
                    };
                }

                // Run custom script if available
                if (validationScript) {
                    const validationContext: ValidationContext = {
                        check: checkContext,
                        result: compareResult,
                        resultData,
                        log: (msg: string) => logger.debug(`[script] ${msg}`, logOpts),
                    };

                    try {
                        const scriptResult = validationScript(validationContext);

                        if (scriptResult && scriptResult.status) {
                            logger.info(
                                `Script override: status=${scriptResult.status}, message=${scriptResult.message || 'none'}`,
                                logOpts
                            );

                            return {
                                ...compareResult,
                                status: scriptResult.status,
                                failReasons: scriptResult.failReasons ?? (scriptResult.status === 'passed' ? [] : compareResult.failReasons),
                                result: JSON.stringify({
                                    ...resultData,
                                    pluginOverride: {
                                        plugin: 'custom-check-validator',
                                        reason: scriptResult.message || 'Custom script override',
                                        originalStatus: compareResult.status,
                                    },
                                }, null, '\t'),
                            };
                        }
                    } catch (error) {
                        logger.error(`Validation script error: ${error}`, logOpts);
                        // Continue with original result on script error
                    }
                }

                // No override
                return compareResult;
            },
        },
    };
}

// Default export for plugin loader
export default createCustomCheckValidator;
