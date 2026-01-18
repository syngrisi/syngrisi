/**
 * Syngrisi Plugin SDK
 * 
 * Public exports for plugin developers.
 */

// Core types
export type {
    PluginManifest,
    PluginContext,
    AppConfig,
    Logger,
    SyngrisiPlugin,
    PluginFactory,
    PluginExport,
    PluginHooks,
    HookName,
    // Auth hooks
    AuthResult,
    AuthValidateHook,
    // Check hooks
    CheckCompareContext,
    CheckOverrideResult,
    CheckBeforeCompareHook,
    CheckAfterCompareHook,
    // Request hooks
    RequestBeforeHook,
    RequestAfterHook,
} from './types';

// Hook utilities
export {
    HOOK_NAMES,
    HOOK_EXECUTION_MODE,
    HOOK_MODES,
    isValidHookName,
    getHookExecutionMode,
} from './hooks';

// Context builders
export {
    buildPluginContext,
} from './context';
