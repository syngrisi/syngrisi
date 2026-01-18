/**
 * Syngrisi Plugin System - Hook Registry
 * 
 * Manages hook registration and execution.
 */

import { Request } from 'express';
import { match } from 'path-to-regexp';
import log from '@logger';
import {
    HookName,
    PluginHooks,
    RegisteredHook,
    PluginContext,
    AuthResult,
    CheckCompareContext,
    CheckOverrideResult,
} from '../sdk/types';
import { getHookExecutionMode, HOOK_EXECUTION_MODE } from '../sdk/hooks';
import { CompareResult } from '@services/comparison.service';

const logOpts = {
    scope: 'HookRegistry',
    msgType: 'PLUGIN',
};

/**
 * Registry for managing plugin hooks
 */
export class HookRegistry {
    private hooks: Map<HookName, RegisteredHook[]> = new Map();

    /**
     * Register a hook from a plugin
     */
    register<T extends HookName>(
        pluginName: string,
        hookName: T,
        handler: NonNullable<PluginHooks[T]>,
        priority: number = 100,
        routes: string[] = ['*']
    ): void {
        const existing = this.hooks.get(hookName) || [];

        const registeredHook: RegisteredHook<T> = {
            pluginName,
            hookName,
            handler: handler as PluginHooks[T],
            priority,
            routes,
        };

        existing.push(registeredHook as RegisteredHook);

        // Sort by priority (lower = runs first)
        existing.sort((a, b) => a.priority - b.priority);

        this.hooks.set(hookName, existing);

        log.info(`Registered hook '${hookName}' from plugin '${pluginName}' (priority: ${priority})`, logOpts);
    }

    /**
     * Unregister all hooks from a plugin
     */
    unregister(pluginName: string): void {
        for (const [hookName, hooks] of this.hooks.entries()) {
            const filtered = hooks.filter(h => h.pluginName !== pluginName);
            if (filtered.length !== hooks.length) {
                this.hooks.set(hookName, filtered);
                log.info(`Unregistered hooks from plugin '${pluginName}' for '${hookName}'`, logOpts);
            }
        }
    }

    /**
     * Get all hooks for a given hook name, optionally filtered by route
     */
    getHooks<T extends HookName>(hookName: T, route?: string): RegisteredHook<T>[] {
        const hooks = (this.hooks.get(hookName) || []) as RegisteredHook<T>[];

        if (!route) {
            return hooks;
        }

        // Filter by route pattern
        return hooks.filter(hook => this.matchesRoute(hook.routes, route));
    }

    /**
     * Check if a route matches any of the patterns
     */
    private matchesRoute(patterns: string[], route: string): boolean {
        for (const pattern of patterns) {
            if (pattern === '*') {
                return true;
            }

            // Convert glob-like pattern to path-to-regexp format
            const regexPattern = pattern
                .replace(/\*/g, '(.*)');

            try {
                const matcher = match(regexPattern, { decode: decodeURIComponent });
                if (matcher(route)) {
                    return true;
                }
            } catch {
                // Fallback to simple string matching
                if (route.startsWith(pattern.replace('*', ''))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Execute auth:validate hooks (first-match mode)
     */
    async executeAuthValidate(
        req: Request,
        res: Express.Response,
        context: PluginContext
    ): Promise<AuthResult | null> {
        const hooks = this.getHooks('auth:validate', req.path);

        for (const hook of hooks) {
            try {
                log.debug(`Executing auth:validate hook from '${hook.pluginName}'`, logOpts);
                const result = await (hook.handler as NonNullable<PluginHooks['auth:validate']>)(
                    req,
                    res as any,
                    context
                );

                if (result !== null) {
                    log.debug(`Auth hook '${hook.pluginName}' returned result: ${result.authenticated}`, logOpts);
                    return result;
                }
            } catch (error) {
                log.error(`Error in auth:validate hook from '${hook.pluginName}': ${error}`, logOpts);
                // Continue to next hook on error
            }
        }

        return null; // No plugin handled auth
    }

    /**
     * Execute check:beforeCompare hooks (waterfall mode)
     */
    async executeCheckBeforeCompare(
        context: CheckCompareContext,
        pluginContext: PluginContext
    ): Promise<CheckCompareContext | { skip: true; result: CheckOverrideResult }> {
        const hooks = this.getHooks('check:beforeCompare');

        let currentContext = context;

        for (const hook of hooks) {
            try {
                log.debug(`Executing check:beforeCompare hook from '${hook.pluginName}'`, logOpts);
                const result = await (hook.handler as NonNullable<PluginHooks['check:beforeCompare']>)(
                    currentContext,
                    pluginContext
                );

                if ('skip' in result && result.skip) {
                    log.info(`Check comparison skipped by plugin '${hook.pluginName}'`, logOpts);
                    return result;
                }

                currentContext = result as CheckCompareContext;
            } catch (error) {
                log.error(`Error in check:beforeCompare hook from '${hook.pluginName}': ${error}`, logOpts);
                // Continue with current context on error
            }
        }

        return currentContext;
    }

    /**
     * Execute check:afterCompare hooks (waterfall mode)
     */
    async executeCheckAfterCompare(
        context: CheckCompareContext,
        compareResult: CompareResult,
        pluginContext: PluginContext
    ): Promise<CompareResult> {
        const hooks = this.getHooks('check:afterCompare');

        let currentResult = compareResult;

        for (const hook of hooks) {
            try {
                log.debug(`Executing check:afterCompare hook from '${hook.pluginName}'`, logOpts);
                currentResult = await (hook.handler as NonNullable<PluginHooks['check:afterCompare']>)(
                    context,
                    currentResult,
                    pluginContext
                );
            } catch (error) {
                log.error(`Error in check:afterCompare hook from '${hook.pluginName}': ${error}`, logOpts);
                // Continue with current result on error
            }
        }

        return currentResult;
    }

    /**
     * Check if any hooks are registered for a given hook name
     */
    hasHooks(hookName: HookName): boolean {
        const hooks = this.hooks.get(hookName);
        return hooks !== undefined && hooks.length > 0;
    }

    /**
     * Get count of registered hooks
     */
    getHookCount(hookName?: HookName): number {
        if (hookName) {
            return (this.hooks.get(hookName) || []).length;
        }

        let total = 0;
        for (const hooks of this.hooks.values()) {
            total += hooks.length;
        }
        return total;
    }

    /**
     * Clear all hooks
     */
    clear(): void {
        this.hooks.clear();
        log.info('Cleared all hooks', logOpts);
    }
}

// Singleton instance
export const hookRegistry = new HookRegistry();
