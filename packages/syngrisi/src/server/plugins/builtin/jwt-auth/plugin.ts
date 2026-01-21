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
}

const DEFAULT_CONFIG: JwtAuthConfig = {
    jwksUrl: '',
    issuer: '',
    headerName: 'Authorization',
    headerPrefix: 'Bearer ',
    serviceUserRole: 'user',
    autoProvisionUsers: true,
    jwksCacheTtl: 3600000, // 1 hour
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
];

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
                if (config.headerPrefix && token.startsWith(config.headerPrefix)) {
                    token = token.slice(config.headerPrefix.length);
                }
                token = token.trim();

                if (!token) {
                    return {
                        authenticated: false,
                        error: 'Missing token in authorization header',
                    };
                }

                try {
                    // Validate JWT
                    const { payload } = await jose.jwtVerify(token, jwks, {
                        issuer: config.issuer,
                        // Not enforcing audience by default as per common M2M patterns
                    });

                    const clientId = payload.sub as string;
                    const scopes = (payload.scp as string[]) || (payload.scope as string)?.split(' ') || [];

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

