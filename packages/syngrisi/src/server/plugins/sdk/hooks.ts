/**
 * Syngrisi Plugin SDK - Hook Definitions
 * 
 * Utility functions and constants for working with hooks.
 */

import { HookName } from './types';

/**
 * All available hook names
 */
export const HOOK_NAMES: readonly HookName[] = [
    'auth:validate',
    'check:beforeCompare',
    'check:afterCompare',
    'request:before',
    'request:after',
] as const;

/**
 * Hook execution modes
 */
export const HOOK_EXECUTION_MODE = {
    /** First successful result wins (auth hooks) */
    FIRST_MATCH: 'first-match',
    /** Result passes through all handlers (waterfall) */
    WATERFALL: 'waterfall',
    /** All handlers run, results collected */
    PARALLEL: 'parallel',
} as const;

export type HookExecutionMode = typeof HOOK_EXECUTION_MODE[keyof typeof HOOK_EXECUTION_MODE];

/**
 * Execution mode for each hook type
 */
export const HOOK_MODES: Record<HookName, HookExecutionMode> = {
    'auth:validate': HOOK_EXECUTION_MODE.FIRST_MATCH,
    'check:beforeCompare': HOOK_EXECUTION_MODE.WATERFALL,
    'check:afterCompare': HOOK_EXECUTION_MODE.WATERFALL,
    'request:before': HOOK_EXECUTION_MODE.WATERFALL,
    'request:after': HOOK_EXECUTION_MODE.WATERFALL,
};

/**
 * Check if a hook name is valid
 */
export function isValidHookName(name: string): name is HookName {
    return HOOK_NAMES.includes(name as HookName);
}

/**
 * Get the execution mode for a hook
 */
export function getHookExecutionMode(hookName: HookName): HookExecutionMode {
    return HOOK_MODES[hookName];
}
