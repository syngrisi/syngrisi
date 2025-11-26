/**
 * Logto SSO Infrastructure Manager
 *
 * Manages Logto and Postgres containers for E2E SSO testing.
 * Uses apple/container CLI for container operations.
 */

import { execSync, spawn, type ChildProcess } from 'child_process';
import path from 'path';
import http from 'http';
import { createLogger, waitFor, sleep } from './sso-logger';

const logger = createLogger('LogtoManager');

export interface LogtoConfig {
  /** Logto main endpoint */
  endpoint: string;
  /** Logto admin endpoint */
  adminEndpoint: string;
  /** Postgres port */
  postgresPort: number;
  /** Logto port */
  logtoPort: number;
  /** Logto admin port */
  logtoAdminPort: number;
}

export interface LogtoAppConfig {
  /** OIDC Client ID */
  clientId: string;
  /** OIDC Client Secret */
  clientSecret: string;
  /** OIDC Issuer URL */
  issuer: string;
  /** Authorization endpoint */
  authorizationEndpoint: string;
  /** Token endpoint */
  tokenEndpoint: string;
  /** Userinfo endpoint */
  userinfoEndpoint: string;
}

const DEFAULT_CONFIG: LogtoConfig = {
  endpoint: 'http://localhost:3001',
  adminEndpoint: 'http://localhost:3050',
  postgresPort: 5433,
  logtoPort: 3001,
  logtoAdminPort: 3050,
};

const SCRIPT_DIR = path.resolve(__dirname);

/**
 * Check if Logto is available by hitting the OIDC discovery endpoint
 */
export async function isLogtoAvailable(endpoint: string = DEFAULT_CONFIG.endpoint): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `${endpoint}/oidc/.well-known/openid-configuration`;
    const req = http
      .get(url, (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      })
      .on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for Logto to become available
 */
export async function waitForLogto(
  endpoint: string = DEFAULT_CONFIG.endpoint,
  timeoutMs: number = 120_000
): Promise<void> {
  logger.info(`Waiting for Logto at ${endpoint}...`);

  await waitFor(
    () => isLogtoAvailable(endpoint),
    {
      timeoutMs,
      intervalMs: 2000,
      description: `Logto OIDC endpoint at ${endpoint}`,
    }
  );

  logger.success(`Logto is ready at ${endpoint}`);
}

/**
 * Start SSO infrastructure (Postgres + Logto containers)
 */
export async function startLogtoInfrastructure(
  config: Partial<LogtoConfig> = {}
): Promise<LogtoConfig> {
  const finalConfig: LogtoConfig = { ...DEFAULT_CONFIG, ...config };

  logger.info('Starting SSO infrastructure...');

  const scriptPath = path.join(SCRIPT_DIR, 'start-containers.sh');

  try {
    // Set environment variables for the script
    const env = {
      ...process.env,
      LOGTO_POSTGRES_PORT: String(finalConfig.postgresPort),
      LOGTO_PORT: String(finalConfig.logtoPort),
      LOGTO_ADMIN_PORT: String(finalConfig.logtoAdminPort),
    };

    execSync(`bash "${scriptPath}"`, {
      env,
      stdio: 'inherit',
      timeout: 180_000, // 3 minutes max for container startup
    });

    // Double-check that Logto is available
    await waitForLogto(finalConfig.endpoint, 30_000);

    logger.success('SSO infrastructure started successfully');
    return finalConfig;
  } catch (error) {
    logger.error('Failed to start SSO infrastructure', { error });
    throw error;
  }
}

/**
 * Run Logto provisioning script to configure:
 * - Sign-in experience (username + password)
 * - Test user (testuser / Test123!)
 * - OIDC application with redirect URIs for all E2E worker ports
 *
 * Creates provisioned-config.json with credentials.
 */
export async function provisionLogto(): Promise<void> {
  logger.info('Running Logto provisioning...');

  const scriptPath = path.join(SCRIPT_DIR, 'provision-logto-api.sh');

  try {
    execSync(`bash "${scriptPath}"`, {
      cwd: SCRIPT_DIR,
      stdio: 'inherit',
      timeout: 60_000, // 1 minute max for provisioning
    });

    logger.success('Logto provisioning completed');
  } catch (error) {
    logger.error('Failed to provision Logto', { error });
    throw error;
  }
}

/**
 * Stop SSO infrastructure
 */
export async function stopLogtoInfrastructure(): Promise<void> {
  logger.info('Stopping SSO infrastructure...');

  const scriptPath = path.join(SCRIPT_DIR, 'stop-containers.sh');

  try {
    execSync(`bash "${scriptPath}"`, {
      stdio: 'inherit',
      timeout: 30_000,
    });

    logger.success('SSO infrastructure stopped');
  } catch (error) {
    logger.warn('Error stopping SSO infrastructure (may already be stopped)', { error });
  }
}

/**
 * Get OIDC configuration from Logto discovery endpoint
 */
export async function getOIDCConfiguration(
  endpoint: string = DEFAULT_CONFIG.endpoint
): Promise<{
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
}> {
  const url = `${endpoint}/oidc/.well-known/openid-configuration`;

  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse OIDC configuration: ${e}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Create a Logto application via Admin API
 *
 * Note: This requires either:
 * 1. Pre-seeded database with M2M app credentials
 * 2. Using the admin console UI (via Playwright)
 * 3. SQL dump with pre-configured app
 *
 * For E2E tests, we'll use approach #3 (SQL dump) as it's most reliable.
 */
export async function createLogtoApplication(
  adminEndpoint: string = DEFAULT_CONFIG.adminEndpoint,
  appConfig: {
    name: string;
    description?: string;
    redirectUris: string[];
  }
): Promise<LogtoAppConfig | null> {
  logger.warn('createLogtoApplication: Manual app creation via Admin API not yet implemented');
  logger.info('For E2E tests, use a pre-seeded database dump instead');

  // TODO: Implement when we have M2M credentials or use Playwright to create via UI
  return null;
}

/**
 * Build Syngrisi SSO environment variables for Logto (OAuth2 mode)
 */
export function buildSyngrisiSSOEnv(
  logtoConfig: LogtoConfig,
  appConfig: LogtoAppConfig
): Record<string, string> {
  return {
    SSO_ENABLED: 'true',
    SSO_PROTOCOL: 'oauth2',
    SSO_CLIENT_ID: appConfig.clientId,
    SSO_CLIENT_SECRET: appConfig.clientSecret,
    // OAuth2 endpoints (Logto exposes these via OIDC discovery)
    SSO_AUTHORIZATION_URL: appConfig.authorizationEndpoint,
    SSO_TOKEN_URL: appConfig.tokenEndpoint,
    SSO_USERINFO_URL: appConfig.userinfoEndpoint,
    SSO_CALLBACK_URL: '/v1/auth/sso/oauth/callback',
    // Logto-specific
    LOGTO_ENDPOINT: logtoConfig.endpoint,
    LOGTO_ADMIN_ENDPOINT: logtoConfig.adminEndpoint,
  };
}

/**
 * Check if container CLI is available
 */
export function isContainerCLIAvailable(): boolean {
  try {
    execSync('which container', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Singleton manager for tests that need SSO
 *
 * Provides automatic Logto infrastructure management:
 * - Starts Postgres + Logto containers
 * - Runs provisioning (creates user, app, configures sign-in)
 * - Reuses running instance across tests
 *
 * Usage:
 * - @sso-logto tag: Auto-starts and provisions Logto
 * - @sso-external tag: Expects Logto to be running externally
 */
class LogtoTestManager {
  private static instance: LogtoTestManager;
  private config: LogtoConfig | null = null;
  private isStarted = false;
  private isProvisioned = false;
  private startPromise: Promise<LogtoConfig> | null = null;

  private constructor() {}

  static getInstance(): LogtoTestManager {
    if (!LogtoTestManager.instance) {
      LogtoTestManager.instance = new LogtoTestManager();
    }
    return LogtoTestManager.instance;
  }

  /**
   * Ensure Logto is started and provisioned.
   *
   * If Logto is already running externally, assumes it's provisioned.
   * If starting fresh, runs provisioning after containers are up.
   *
   * @param config - Optional Logto configuration overrides
   * @param skipProvisioning - Skip provisioning (use if already provisioned)
   */
  async ensureStarted(
    config?: Partial<LogtoConfig>,
    skipProvisioning = false
  ): Promise<LogtoConfig> {
    // If already started, return existing config
    if (this.isStarted && this.config) {
      logger.debug('Logto already started, reusing existing instance');
      return this.config;
    }

    // If startup in progress, wait for it
    if (this.startPromise) {
      logger.debug('Logto startup in progress, waiting...');
      return this.startPromise;
    }

    // Check if Logto is already running externally
    const defaultEndpoint = config?.endpoint || DEFAULT_CONFIG.endpoint;
    if (await isLogtoAvailable(defaultEndpoint)) {
      logger.info('Logto is already running externally');
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.isStarted = true;
      this.isProvisioned = true; // Assume external instance is provisioned
      return this.config;
    }

    // Start Logto and run provisioning
    this.startPromise = this.startAndProvision(config, skipProvisioning);

    return this.startPromise;
  }

  /**
   * Internal: Start containers and run provisioning
   */
  private async startAndProvision(
    config?: Partial<LogtoConfig>,
    skipProvisioning = false
  ): Promise<LogtoConfig> {
    try {
      // Start containers
      const cfg = await startLogtoInfrastructure(config);
      this.config = cfg;
      this.isStarted = true;

      // Run provisioning unless skipped
      if (!skipProvisioning && !this.isProvisioned) {
        await provisionLogto();
        this.isProvisioned = true;
      }

      this.startPromise = null;
      return cfg;
    } catch (error) {
      this.startPromise = null;
      throw error;
    }
  }

  /**
   * Stop Logto infrastructure and reset state
   */
  async stop(): Promise<void> {
    if (!this.isStarted) {
      return;
    }

    await stopLogtoInfrastructure();
    this.isStarted = false;
    this.isProvisioned = false;
    this.config = null;
  }

  getConfig(): LogtoConfig | null {
    return this.config;
  }

  isRunning(): boolean {
    return this.isStarted;
  }

  /**
   * Check if Logto has been provisioned
   */
  isLogtoProvisioned(): boolean {
    return this.isProvisioned;
  }
}

export const logtoTestManager = LogtoTestManager.getInstance();

export { DEFAULT_CONFIG as LOGTO_DEFAULT_CONFIG, provisionLogto };
