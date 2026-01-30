/**
 * JWT Auth Plugin
 * 
 * Provides M2M (Machine-to-Machine) authentication via JWT tokens.
 * Validates JWT tokens using JWKS.
 */

import * as jose from 'jose';
import { SyngrisiPlugin, PluginContext, AuthResult } from '../../sdk/types';
import { registerPluginSchema } from '../../../controllers/plugin-settings.controller';

interface JwtAuthConfig {
    /** JWKS endpoint URL for token validation */
    jwksUrl: string;

    /** Expected JWT issuer */
    issuer: string;

    /** Header name containing the JWT token */
    headerName: string;

    /** Header value prefix (e.g. "Bearer ") */
    headerPrefix: string;

    /** Role to assign to service users */
    serviceUserRole: 'user' | 'reviewer' | 'admin';

    /** Whether to auto-provision service users in DB */
    autoProvisionUsers: boolean;

    /** Cache TTL for JWKS in milliseconds */
    jwksCacheTtl: number;

    /** Optional audience(s) to validate */
    audience?: string[] | string;

    /** Optional required scopes */
    requiredScopes?: string[] | string;

    /** Issuer matching mode: strict (default) or host */
    issuerMatch?: 'strict' | 'host';
}

const DEFAULT_CONFIG: JwtAuthConfig = {
    jwksUrl: '',
    issuer: '',
    headerName: 'Authorization',
    headerPrefix: 'Bearer ',
    serviceUserRole: 'user',
    autoProvisionUsers: true,
    jwksCacheTtl: 3600000, // 1 hour
    issuerMatch: 'strict',
};

const SETTINGS_SCHEMA = [
    {
        key: 'jwksUrl',
        label: 'JWKS URL',
        description: 'URL to the JWKS (JSON Web Key Set) endpoint for token validation',
        type: 'string' as const,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL',
        required: true,
    },
    {
        key: 'issuer',
        label: 'JWT Issuer',
        description: 'Expected issuer claim in the JWT token',
        type: 'string' as const,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_ISSUER',
        required: true,
    },
    {
        key: 'headerName',
        label: 'Header Name',
        description: 'HTTP header name containing the token (e.g. Authorization)',
        type: 'string' as const,
        defaultValue: 'Authorization',
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_HEADER_NAME',
    },
    {
        key: 'headerPrefix',
        label: 'Header Prefix',
        description: 'Prefix to strip from header value (e.g. "Bearer "). Leave empty if none.',
        type: 'string' as const,
        defaultValue: 'Bearer ',
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_HEADER_PREFIX',
    },
    {
        key: 'serviceUserRole',
        label: 'Service User Role',
        description: 'Role to assign to auto-provisioned service users',
        type: 'select' as const,
        defaultValue: 'user',
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_SERVICE_USER_ROLE',
        options: [
            { value: 'user', label: 'User' },
            { value: 'reviewer', label: 'Reviewer' },
            { value: 'admin', label: 'Admin' },
        ],
    },
    {
        key: 'autoProvisionUsers',
        label: 'Auto-provision Users',
        description: 'Automatically create service users in database for new clients',
        type: 'boolean' as const,
        defaultValue: true,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_AUTO_PROVISION',
    },
    {
        key: 'jwksCacheTtl',
        label: 'JWKS Cache TTL (ms)',
        description: 'Cache duration for JWKS keys in milliseconds',
        type: 'number' as const,
        defaultValue: 3600000,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_JWKS_CACHE_TTL',
    },
    {
        key: 'audience',
        label: 'Audience',
        description: 'Expected audience claim(s). Comma- or space-separated.',
        type: 'string' as const,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_AUDIENCE',
    },
    {
        key: 'requiredScopes',
        label: 'Required Scopes',
        description: 'Required scopes. Comma- or space-separated.',
        type: 'string' as const,
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_REQUIRED_SCOPES',
    },
    {
        key: 'issuerMatch',
        label: 'Issuer Match Mode',
        description: 'Strict requires exact issuer match. Host allows matching by hostname.',
        type: 'select' as const,
        defaultValue: 'strict',
        envVariable: 'SYNGRISI_PLUGIN_JWT_AUTH_ISSUER_MATCH',
        options: [
            { value: 'strict', label: 'Strict' },
            { value: 'host', label: 'Host' },
        ],
    },
];

const parseList = (value?: string | string[]): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(Boolean);
    }
    return value
        .split(/[\s,]+/)
        .map(v => v.trim())
        .filter(Boolean);
};

const extractHost = (issuer: string): string | null => {
    try {
        const parsed = new URL(issuer);
        return parsed.host;
    } catch {
        return null;
    }
};

/**
 * Create JWT Auth Plugin
 */
export function createJwtAuthPlugin(initialConfig: Partial<JwtAuthConfig> = {}): SyngrisiPlugin {
    let config: JwtAuthConfig = { ...DEFAULT_CONFIG, ...initialConfig };
    let jwks: jose.JWTVerifyGetKey | null = null;
    let jwksInitialized = false;

    return {
        manifest: {
            name: 'jwt-auth',
            version: '1.0.0',
            description: 'M2M authentication via JWT (OAuth2/OIDC)',
            author: 'Syngrisi Team',
            priority: 10, // High priority - runs before standard auth
        },

        async onLoad(context: PluginContext): Promise<void> {
            const logger = context.logger;
            const logOpts = { scope: 'jwt-auth', msgType: 'PLUGIN' };

            // Merge config from plugin context (DB settings have priority)
            config = { ...config, ...context.pluginConfig as Partial<JwtAuthConfig> };

            // Register settings schema for UI
            await registerPluginSchema(
                'jwt-auth',
                'JWT Authentication',
                'M2M authentication via JWT (OAuth2 Client Credentials)',
                SETTINGS_SCHEMA
            );

            // Validate required config - throw errors to prevent silent failures
            if (!config.jwksUrl) {
                throw new Error(
                    'JWT Auth: JWKS URL not configured. ' +
                    'Set SYNGRISI_PLUGIN_JWT_AUTH_JWKS_URL environment variable or configure via Admin UI.'
                );
            }

            if (!config.issuer) {
                throw new Error(
                    'JWT Auth: Issuer not configured. ' +
                    'Set SYNGRISI_PLUGIN_JWT_AUTH_ISSUER environment variable or configure via Admin UI.'
                );
            }

            // Initialize JWKS client
            try {
                jwks = jose.createRemoteJWKSet(new URL(config.jwksUrl), {
                    cacheMaxAge: config.jwksCacheTtl,
                });
                jwksInitialized = true;
                logger.info(`JWT Auth plugin loaded. JWKS: ${config.jwksUrl}`, logOpts);
            } catch (error) {
                throw new Error(`JWT Auth: Failed to initialize JWKS client: ${error}`);
            }
        },

        async onUnload(): Promise<void> {
            jwks = null;
            jwksInitialized = false;
        },

        hooks: {
            'auth:validate': async (req, res, context): Promise<AuthResult | null> => {
                const logger = context.logger;
                const logOpts = { scope: 'jwt-auth', msgType: 'AUTH' };

                // Skip if not properly initialized
                if (!jwksInitialized || !jwks) {
                    return null;
                }

                // Get token from header
                const headerName = config.headerName.toLowerCase();
                const authHeader = req.headers[headerName];

                if (!authHeader || typeof authHeader !== 'string') {
                    return null;
                }

                // Extract token (remove prefix)
                let token = authHeader;
                if (config.headerPrefix) {
                    const prefix = config.headerPrefix;
                    if (token.startsWith(prefix)) {
                        token = token.slice(prefix.length);
                    } else if (token.toLowerCase().startsWith(prefix.toLowerCase())) {
                        token = token.slice(prefix.length);
                    }
                }
                token = token.trim();

                if (!token) {
                    return {
                        authenticated: false,
                        error: 'Missing token in authorization header',
                    };
                }

                try {
                    const expectedIssuers = parseList(config.issuer);
                    const audiences = parseList(config.audience);
                    const requiredScopes = parseList(config.requiredScopes);

                    // Validate JWT signature and claims
                    const verifyOptions: jose.JWTVerifyOptions = {};
                    if (config.issuerMatch !== 'host') {
                        verifyOptions.issuer = expectedIssuers.length > 1 ? expectedIssuers : expectedIssuers[0];
                    }
                    if (audiences.length > 0) {
                        verifyOptions.audience = audiences.length > 1 ? audiences : audiences[0];
                    }

                    const { payload } = await jose.jwtVerify(token, jwks, verifyOptions);

                    if (config.issuerMatch === 'host') {
                        const tokenIssuer = payload.iss as string | undefined;
                        if (!tokenIssuer) {
                            return {
                                authenticated: false,
                                error: 'Token is missing issuer claim',
                            };
                        }
                        const tokenHost = extractHost(tokenIssuer);
                        const expectedHosts = expectedIssuers
                            .map(issuer => extractHost(issuer) ?? issuer)
                            .filter(Boolean);
                        const matchesHost = expectedHosts.some(host => tokenHost ? tokenHost === host : tokenIssuer === host);
                        if (!matchesHost) {
                            return {
                                authenticated: false,
                                error: 'Token issuer does not match expected host',
                            };
                        }
                    }

                    const clientId =
                        (payload.sub as string | undefined) ||
                        (payload.client_id as string | undefined) ||
                        (payload.cid as string | undefined);

                    if (!clientId) {
                        logger.warn('JWT Auth: missing client identifier in token (sub/client_id/cid)', logOpts);
                        return {
                            authenticated: false,
                            error: 'Token is missing client identifier',
                        };
                    }
                    const scopes = (payload.scp as string[]) || (payload.scope as string)?.split(' ') || [];

                    if (requiredScopes.length > 0) {
                        const scopeSet = new Set(scopes.map(scope => String(scope).trim()).filter(Boolean));
                        const missing = requiredScopes.filter(scope => !scopeSet.has(scope));
                        if (missing.length > 0) {
                            return {
                                authenticated: false,
                                error: `Token missing required scopes: ${missing.join(', ')}`,
                            };
                        }
                    }

                    logger.info(`JWT Auth: validated token for client ${clientId}`, logOpts);

                    const { User } = context.models;
                    const username = `jwt-service:${clientId}`;

                    // Find or create service user (depending on autoProvisionUsers setting)
                    let serviceUser = await User.findOne({ username });

                    if (!serviceUser) {
                        if (config.autoProvisionUsers) {
                            // Auto-provision new service user
                            serviceUser = await User.create({
                                username,
                                firstName: 'JWT',
                                lastName: `Service (${clientId.substring(0, 8)}...)`,
                                role: config.serviceUserRole,
                                authSource: 'jwt',
                            });
                            logger.info(`Created service user: ${username}`, logOpts);
                        } else {
                            // Auto-provision disabled - reject authentication
                            logger.warn(`JWT Auth: User not found and auto-provision is disabled: ${username}`, logOpts);
                            return {
                                authenticated: false,
                                error: `Service user not found: ${clientId}. Auto-provisioning is disabled.`,
                            };
                        }
                    }

                    return {
                        authenticated: true,
                        user: serviceUser,
                        metadata: {
                            clientId,
                            scopes,
                            authMethod: 'jwt',
                        },
                    };

                } catch (error) {
                    if (error instanceof jose.errors.JWTExpired) {
                        logger.warn(`JWT Auth: token expired`, logOpts);
                        return {
                            authenticated: false,
                            error: 'Token expired',
                        };
                    }

                    if (error instanceof jose.errors.JWTClaimValidationFailed) {
                        logger.warn(`JWT Auth: claim validation failed: ${error.message}`, logOpts);
                        return {
                            authenticated: false,
                            error: `Token validation failed: ${error.message}`,
                        };
                    }

                    logger.error(`JWT Auth: validation error: ${error}`, logOpts);
                    return {
                        authenticated: false,
                        error: 'Token validation failed',
                    };
                }
            },
        },
    };
}

// Default export for plugin loader
export default createJwtAuthPlugin;
