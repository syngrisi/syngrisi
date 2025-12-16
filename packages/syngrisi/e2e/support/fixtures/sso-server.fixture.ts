/**
 * SSO Server Fixture
 *
 * Manages Logto SSO infrastructure for E2E tests.
 * Use with @sso-logto tag to enable Logto-based SSO testing.
 */

import { test as base } from 'playwright-bdd';
import { createLogger } from '@lib/logger';
import { hasTag } from '@utils/common';
import {
  logtoTestManager,
  isLogtoAvailable,
  isContainerCLIAvailable,
  ensureContainerSystemRunning,
  type LogtoConfig,
  type LogtoAppConfig,
  LOGTO_DEFAULT_CONFIG,
} from '@sso';
import * as fs from 'fs';
import * as path from 'path';

const logger = createLogger('SSOServer');

/** OAuth2 config structure */
interface OAuth2Config {
  app: {
    clientId: string;
    clientSecret: string;
    appName: string;
  };
  endpoints: {
    authorization: string;
    token: string;
    userinfo: string;
  };
  env: Record<string, string>;
}

/** SAML config structure (matches provisioned-config.json) */
interface SAMLConfig {
  appId?: string;
  spEntityId?: string;   // Service Provider Entity ID (Syngrisi)
  idpEntityId?: string;  // Identity Provider Entity ID (Logto)
  acsUrl?: string;       // Assertion Consumer Service URL
  idpEndpoint?: string;  // Logto endpoint
  metadataUrl?: string;  // SAML metadata URL
  certificate?: string;  // IdP signing certificate (base64, no PEM headers)
  endpoints?: {
    entryPoint: string;  // SSO login URL
    issuer: string;      // IdP issuer
  };
  env?: Record<string, string>;
}

/** Provisioned config structure (saved by provision-logto-api.sh) */
interface ProvisionedConfig {
  // New structured format
  oauth2?: OAuth2Config;
  saml?: SAMLConfig;
  user: {
    email: string;
    password: string;
    username?: string;
  };
  // Admin user for Logto Admin Console access
  admin?: {
    email: string;
    password: string;
    username: string;
    consoleUrl: string;
  };
  // Legacy format (backwards compatible)
  app: {
    clientId: string;
    clientSecret: string;
    appName: string;
  };
  endpoints: {
    authorization: string;
    token: string;
    userinfo: string;
  };
  env: Record<string, string>;
}

/** Path to provisioned config file */
const PROVISIONED_CONFIG_PATH = path.join(__dirname, '../sso/provisioned-config.json');

/** Cached provisioned config */
let cachedProvisionedConfig: ProvisionedConfig | null = null;

/**
 * Load provisioned config from file if available
 */
function loadProvisionedConfig(): ProvisionedConfig | null {
  if (cachedProvisionedConfig) {
    return cachedProvisionedConfig;
  }

  try {
    if (fs.existsSync(PROVISIONED_CONFIG_PATH)) {
      const content = fs.readFileSync(PROVISIONED_CONFIG_PATH, 'utf-8');
      cachedProvisionedConfig = JSON.parse(content);
      logger.info('Loaded provisioned config from provisioned-config.json');
      return cachedProvisionedConfig;
    }
  } catch (error) {
    logger.warn('Failed to load provisioned config', { error });
  }

  return null;
}

export interface SSOServerFixture {
  /** Whether Logto SSO is available */
  isAvailable: boolean;
  /** Logto configuration */
  logtoConfig: LogtoConfig | null;
  /** Provisioned app/user config (from provisioned-config.json) */
  provisionedConfig: ProvisionedConfig | null;
  /** Start Logto infrastructure (if not already running) */
  startLogto: () => Promise<LogtoConfig>;
  /** Stop Logto infrastructure */
  stopLogto: () => Promise<void>;
  /** Check if Logto is running */
  isLogtoRunning: () => Promise<boolean>;
  /** Get environment variables for Syngrisi SSO configuration (OAuth2) */
  getSSOEnvVars: (appConfig: Partial<LogtoAppConfig>) => Record<string, string>;
  /** Get environment variables for SAML SSO configuration */
  getSAMLSSOEnvVars: (samlConfig?: Partial<SAMLConfig>) => Record<string, string>;
  /** Get provisioned app credentials (auto-loads from provisioned-config.json) */
  getProvisionedCredentials: () => { clientId: string; clientSecret: string } | null;
  /** Get provisioned SAML config */
  getProvisionedSAMLConfig: () => SAMLConfig | null;
  /** Get provisioned OAuth2 config */
  getProvisionedOAuth2Config: () => OAuth2Config | null;
  /** Get provisioned user credentials */
  getProvisionedUser: () => { email: string; password: string; username?: string } | null;
  /** Get provisioned admin credentials for Logto Admin Console */
  getProvisionedAdmin: () => { email: string; password: string; username: string; consoleUrl: string } | null;
}

/**
 * Playwright fixture that provides SSO server management
 *
 * Use with tags:
 * - @sso-logto: Automatically start Logto before test
 * - @sso-external: Expect Logto to be running externally
 */
export const ssoServerFixture = base.extend<{ ssoServer: SSOServerFixture }>({
  ssoServer: [
    async ({}, use, testInfo) => {
      const needsLogto = hasTag(testInfo, '@sso-logto');
      const expectExternal = hasTag(testInfo, '@sso-external');
      let startedByTest = false;

      // Load provisioned config if available
      const provisionedConfig = loadProvisionedConfig();

      const fixture: SSOServerFixture = {
        isAvailable: false,
        logtoConfig: null,
        provisionedConfig,

        startLogto: async () => {
          if (!isContainerCLIAvailable()) {
            logger.warn('Apple container CLI not available, cannot start Logto');
            throw new Error('Apple container CLI not available');
          }

          ensureContainerSystemRunning();
          logger.info('Starting Logto SSO infrastructure...');
          const config = await logtoTestManager.ensureStarted();
          fixture.logtoConfig = config;
          fixture.isAvailable = true;
          startedByTest = true;
          return config;
        },

        stopLogto: async () => {
          if (startedByTest) {
            logger.info('Stopping Logto SSO infrastructure...');
            await logtoTestManager.stop();
            fixture.isAvailable = false;
            fixture.logtoConfig = null;
            startedByTest = false;
          } else {
            logger.debug('Logto was not started by this test, skipping stop');
          }
        },

        isLogtoRunning: async () => {
          const endpoint = fixture.logtoConfig?.endpoint || LOGTO_DEFAULT_CONFIG.endpoint;
          return isLogtoAvailable(endpoint);
        },

        getProvisionedCredentials: () => {
          if (fixture.provisionedConfig) {
            // Try new format first, then legacy
            const oauth2 = fixture.provisionedConfig.oauth2;
            if (oauth2) {
              return {
                clientId: oauth2.app.clientId,
                clientSecret: oauth2.app.clientSecret,
              };
            }
            return {
              clientId: fixture.provisionedConfig.app.clientId,
              clientSecret: fixture.provisionedConfig.app.clientSecret,
            };
          }
          return null;
        },

        getProvisionedSAMLConfig: () => {
          return fixture.provisionedConfig?.saml || null;
        },

        getProvisionedOAuth2Config: () => {
          return fixture.provisionedConfig?.oauth2 || null;
        },

        getProvisionedUser: () => {
          if (fixture.provisionedConfig?.user) {
            return {
              email: fixture.provisionedConfig.user.email,
              password: fixture.provisionedConfig.user.password,
              username: fixture.provisionedConfig.user.username,
            };
          }
          return null;
        },

        getProvisionedAdmin: () => {
          if (fixture.provisionedConfig?.admin) {
            return {
              email: fixture.provisionedConfig.admin.email,
              password: fixture.provisionedConfig.admin.password,
              username: fixture.provisionedConfig.admin.username,
              consoleUrl: fixture.provisionedConfig.admin.consoleUrl,
            };
          }
          return null;
        },

        getSAMLSSOEnvVars: (samlConfig?: Partial<SAMLConfig>) => {
          // Use provisioned SAML config as defaults
          const provSaml = fixture.provisionedConfig?.saml;

          const envVars: Record<string, string> = {
            SSO_ENABLED: 'true',
            SSO_PROTOCOL: 'saml',
            SSO_ENTRY_POINT: samlConfig?.endpoints?.entryPoint || provSaml?.endpoints?.entryPoint || 'http://localhost:3001/api/saml/unknown/authn',
            SSO_ISSUER: samlConfig?.spEntityId || provSaml?.spEntityId || 'syngrisi-e2e-sp',
          };

          // Add IdP issuer if available
          if (samlConfig?.idpEntityId || provSaml?.idpEntityId) {
            envVars.SSO_IDP_ISSUER = samlConfig?.idpEntityId || provSaml?.idpEntityId || '';
          }

          // Add certificate from provisioned config (priority: certificate field > env.SSO_CERT)
          const cert = samlConfig?.certificate || provSaml?.certificate || provSaml?.env?.SSO_CERT;
          if (cert && cert !== 'FETCH_FROM_METADATA' && cert.length > 0) {
            envVars.SSO_CERT = cert;
          }

          return envVars;
        },

        getSSOEnvVars: (appConfig: Partial<LogtoAppConfig>) => {
          const logtoEndpoint = fixture.logtoConfig?.endpoint || LOGTO_DEFAULT_CONFIG.endpoint;

          // Use provisioned config as defaults if available
          const provCreds = fixture.getProvisionedCredentials();
          const provEndpoints = fixture.provisionedConfig?.endpoints;

          return {
            SSO_ENABLED: 'true',
            SSO_PROTOCOL: 'oauth2',
            SSO_CLIENT_ID: appConfig.clientId || provCreds?.clientId || 'test-client-id',
            SSO_CLIENT_SECRET: appConfig.clientSecret || provCreds?.clientSecret || 'test-client-secret',
            // OAuth2 endpoints (Logto uses OIDC paths)
            SSO_AUTHORIZATION_URL: appConfig.authorizationEndpoint || provEndpoints?.authorization || `${logtoEndpoint}/oidc/auth`,
            SSO_TOKEN_URL: appConfig.tokenEndpoint || provEndpoints?.token || `${logtoEndpoint}/oidc/token`,
            SSO_USERINFO_URL: appConfig.userinfoEndpoint || provEndpoints?.userinfo || `${logtoEndpoint}/oidc/me`,
            SSO_CALLBACK_URL: '/v1/auth/sso/oauth/callback',
            LOGTO_ENDPOINT: logtoEndpoint,
            LOGTO_ADMIN_ENDPOINT: fixture.logtoConfig?.adminEndpoint || LOGTO_DEFAULT_CONFIG.adminEndpoint,
          };
        },
      };

      // Auto-start Logto if @sso-logto tag is present
      if (needsLogto) {
        if (!isContainerCLIAvailable()) {
          logger.error('Test requires @sso-logto but container CLI is not available');
          logger.info('Install Apple container CLI or run Logto manually and use @sso-external tag');
          throw new Error('Container CLI required for @sso-logto tag');
        }

        try {
          await fixture.startLogto();
          logger.success('Logto started successfully for @sso-logto test');
        } catch (error) {
          logger.error('Failed to start Logto for @sso-logto test', { error });
          throw error;
        }
      }

      // Check for external Logto if @sso-external tag is present
      if (expectExternal) {
        const running = await isLogtoAvailable();
        if (!running) {
          // Try to auto-start Logto if container CLI is available
          if (isContainerCLIAvailable()) {
            logger.info('Logto not running, but container CLI available - auto-starting...');
            try {
              await fixture.startLogto();
              logger.success('Logto auto-started for @sso-external test');
            } catch (error) {
              logger.error('Failed to auto-start Logto', { error });
              throw new Error('External Logto not available and auto-start failed');
            }
          } else {
            logger.error('Test expects external Logto (@sso-external) but it is not running');
            logger.info('Either start Logto manually or install Apple container CLI for auto-start');
            throw new Error('External Logto not available');
          }
        } else {
          fixture.isAvailable = true;
          fixture.logtoConfig = LOGTO_DEFAULT_CONFIG;
          logger.info('Using external Logto instance');
        }
      }

      try {
        await use(fixture);
      } finally {
        // Clean up Logto if we started it (either via @sso-logto or auto-start for @sso-external)
        if (startedByTest) {
          // Keep running by default (faster), stop only if explicitly disabled
          const reuseLogto = process.env.E2E_REUSE_LOGTO !== 'false';
          if (!reuseLogto) {
            logger.info('E2E_REUSE_LOGTO=false, stopping Logto after test...');
            await fixture.stopLogto();
          } else {
            logger.debug('Keeping Logto running (E2E_REUSE_LOGTO=true by default)');
          }
        }
      }
    },
    { scope: 'test' },
  ],
});

export type { LogtoConfig, LogtoAppConfig, SAMLConfig, OAuth2Config };
