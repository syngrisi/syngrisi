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
  type LogtoConfig,
  type LogtoAppConfig,
  LOGTO_DEFAULT_CONFIG,
} from '@sso';
import * as fs from 'fs';
import * as path from 'path';

const logger = createLogger('SSOServer');

/** Provisioned config structure (saved by provision-logto-api.sh) */
interface ProvisionedConfig {
  app: {
    clientId: string;
    clientSecret: string;
    appName: string;
  };
  user: {
    email: string;
    password: string;
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
  /** Get environment variables for Syngrisi SSO configuration */
  getSSOEnvVars: (appConfig: Partial<LogtoAppConfig>) => Record<string, string>;
  /** Get provisioned app credentials (auto-loads from provisioned-config.json) */
  getProvisionedCredentials: () => { clientId: string; clientSecret: string } | null;
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
            return {
              clientId: fixture.provisionedConfig.app.clientId,
              clientSecret: fixture.provisionedConfig.app.clientSecret,
            };
          }
          return null;
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
          logger.error('Test expects external Logto (@sso-external) but it is not running');
          throw new Error('External Logto not available');
        }
        fixture.isAvailable = true;
        fixture.logtoConfig = LOGTO_DEFAULT_CONFIG;
        logger.info('Using external Logto instance');
      }

      try {
        await use(fixture);
      } finally {
        // Clean up Logto if we started it
        if (startedByTest && needsLogto) {
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

export type { LogtoConfig, LogtoAppConfig };
