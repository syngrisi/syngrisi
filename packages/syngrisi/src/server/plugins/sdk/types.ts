/**
 * Syngrisi Plugin SDK - Core Types
 * 
 * This module defines the interfaces and types for building Syngrisi plugins.
 */

import { Request, Response, NextFunction } from 'express';
import { SnapshotDocument } from '@models/Snapshot.model';
import { CheckDocument, Check, User, Baseline } from '@models';
import { UserDocument } from '@models/User.model';
import { BaselineDocument } from '@models/Baseline.model';
import { CreateCheckParamsExtended } from '../../../types/Check';
import { CompareResult, CompareSnapshotsOptions } from '@services/comparison.service';
import { LogOpts } from '@types';

// ============================================================================
// Logger Interface (matches Syngrisi custom logger)
// ============================================================================

/**
 * Logger interface matching Syngrisi's custom Logger class
 */
export interface Logger {
    error(msg: string | object | unknown, ...meta: LogOpts[]): void;
    warn(msg: string | object, ...meta: LogOpts[]): void;
    info(msg: string | object, ...meta: LogOpts[]): void;
    verbose(msg: string | object, ...meta: LogOpts[]): void;
    debug(msg: string | object, ...meta: LogOpts[]): void;
    silly(msg: string | object, ...meta: LogOpts[]): void;
}

// ============================================================================
// Plugin Manifest
// ============================================================================

/**
 * Plugin metadata describing the plugin and its capabilities
 */
export interface PluginManifest {
    /** Unique plugin identifier */
    name: string;

    /** Semantic version (e.g., "1.0.0") */
    version: string;

    /** Human-readable description */
    description?: string;

    /** Plugin author or team */
    author?: string;

    /**
     * Route patterns for request-level hooks.
     * Supports glob patterns: '*', '/v1/client/*', '/v1/checks/:id/accept'
     * Default: ['*'] (all routes)
     */
    routes?: string[];

    /**
     * Execution priority (lower = runs first).
     * Built-in plugins use 100, external plugins should use higher values.
     * Default: 100
     */
    priority?: number;

    /**
     * Whether the plugin is enabled.
     * Can be overridden by environment configuration.
     * Default: true
     */
    enabled?: boolean;
}

// ============================================================================
// Plugin Context
// ============================================================================

/**
 * Application configuration subset available to plugins
 */
export interface AppConfig {
    connectionString: string;
    defaultImagesPath: string;
    [key: string]: unknown;
}

/**
 * Context provided to plugins during initialization and hook execution
 */
export interface PluginContext {
    /** Application configuration */
    config: AppConfig;

    /** Logger instance */
    logger: Logger;

    /** Available Mongoose models */
    models: {
        User: typeof User;
        Check: typeof Check;
        Baseline: typeof Baseline;
    };

    /** Plugin-specific configuration from env/config */
    pluginConfig: Record<string, unknown>;
}

// ============================================================================
// Auth Hook Types
// ============================================================================

/**
 * Result of authentication validation
 */
export interface AuthResult {
    /** Whether authentication succeeded */
    authenticated: boolean;

    /** Authenticated user document (if successful) */
    user?: UserDocument;

    /** Error message (if failed) */
    error?: string;

    /** Additional metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Authentication validation hook.
 * Called before standard auth middleware.
 * Return null to skip this auth method and try next.
 */
export type AuthValidateHook = (
    req: Request,
    res: Response,
    context: PluginContext
) => Promise<AuthResult | null>;

// ============================================================================
// Check Comparison Hook Types
// ============================================================================

/**
 * Context for check comparison hooks
 */
export interface CheckCompareContext {
    /** Expected (baseline) snapshot */
    expectedSnapshot: SnapshotDocument;

    /** Actual snapshot from current check */
    actualSnapshot: SnapshotDocument;

    /** Check parameters */
    checkParams: CreateCheckParamsExtended;

    /** Associated baseline document (if exists) */
    baseline?: BaselineDocument;

    /** Comparison options (ignore regions, match type, etc.) */
    compareOptions?: CompareSnapshotsOptions;
}

/**
 * Result when plugin overrides comparison
 */
export interface CheckOverrideResult {
    /** Final check status */
    status: 'passed' | 'failed' | 'new';

    /** Reasons for failure (if any) */
    failReasons?: string[];

    /** JSON-serialized comparison result details */
    result?: string;

    /** Optional message explaining the override */
    overrideMessage?: string;
}

/**
 * Hook called before image comparison.
 * Can modify context or skip comparison entirely.
 */
export type CheckBeforeCompareHook = (
    context: CheckCompareContext,
    pluginContext: PluginContext
) => Promise<
    | CheckCompareContext                              // Modified context, continue comparison
    | { skip: true; result: CheckOverrideResult }     // Skip comparison, use provided result
>;

/**
 * Hook called after image comparison.
 * Can modify or override the comparison result.
 */
export type CheckAfterCompareHook = (
    context: CheckCompareContext,
    compareResult: CompareResult,
    pluginContext: PluginContext
) => Promise<CompareResult>;

// ============================================================================
// Request Hook Types
// ============================================================================

/**
 * Hook called before request processing.
 * Standard Express middleware signature.
 */
export type RequestBeforeHook = (
    req: Request,
    res: Response,
    next: NextFunction,
    context: PluginContext
) => Promise<void>;

/**
 * Hook called after request processing (before response sent).
 * Can modify response data.
 */
export type RequestAfterHook = (
    req: Request,
    res: Response,
    data: unknown,
    context: PluginContext
) => Promise<unknown>;

// ============================================================================
// Hook Registry
// ============================================================================

/**
 * All available plugin hooks
 */
export interface PluginHooks {
    /** Authentication validation */
    'auth:validate'?: AuthValidateHook;

    /** Before image comparison */
    'check:beforeCompare'?: CheckBeforeCompareHook;

    /** After image comparison */
    'check:afterCompare'?: CheckAfterCompareHook;

    /** Before request processing */
    'request:before'?: RequestBeforeHook;

    /** After request processing */
    'request:after'?: RequestAfterHook;
}

/**
 * Hook names as union type
 */
export type HookName = keyof PluginHooks;

// ============================================================================
// Plugin Interface
// ============================================================================

/**
 * Main plugin interface that all plugins must implement
 */
export interface SyngrisiPlugin {
    /** Plugin metadata */
    manifest: PluginManifest;

    /**
     * Called when plugin is loaded.
     * Use for initialization, validation, etc.
     */
    onLoad?(context: PluginContext): Promise<void>;

    /**
     * Called when plugin is unloaded.
     * Use for cleanup.
     */
    onUnload?(): Promise<void>;

    /**
     * Hook implementations
     */
    hooks?: PluginHooks;
}

// ============================================================================
// Plugin Factory
// ============================================================================

/**
 * Factory function for creating plugins.
 * Useful for plugins that need configuration.
 */
export type PluginFactory = (config: Record<string, unknown>) => SyngrisiPlugin;

/**
 * Plugin module export format.
 * Can be either a plugin instance or a factory.
 */
export type PluginExport = SyngrisiPlugin | PluginFactory;

// ============================================================================
// Internal Types (used by plugin system, not by plugins)
// ============================================================================

/**
 * Registered hook with metadata
 */
export interface RegisteredHook<T extends HookName = HookName> {
    pluginName: string;
    hookName: T;
    handler: PluginHooks[T];
    priority: number;
    routes: string[];
}

/**
 * Loaded plugin with runtime state
 */
export interface LoadedPlugin {
    plugin: SyngrisiPlugin;
    loaded: boolean;
    error?: Error;
}
