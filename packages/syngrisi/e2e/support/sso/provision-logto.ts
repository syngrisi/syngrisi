/**
 * Logto Provisioning Utilities
 *
 * This module provides utilities for provisioning Logto applications and users
 * for E2E testing. It integrates with the provision-logto-api.sh script.
 */

export interface ProvisionedApp {
  clientId: string;
  clientSecret: string;
  appName: string;
}

export interface ProvisionedUser {
  email: string;
  password: string;
  username?: string;
}

export interface LogtoProvisionConfig {
  app: ProvisionedApp;
  user: ProvisionedUser;
  endpoints: {
    authorization: string;
    token: string;
    userinfo: string;
  };
  env: Record<string, string>;
}

/**
 * Provision Logto with a test application and user
 * This is typically done via the provision-logto-api.sh script before tests run
 */
export async function provisionLogto(): Promise<LogtoProvisionConfig> {
  throw new Error(
    'provisionLogto() is not implemented. ' +
    'Run ./support/sso/provision-logto-api.sh to provision Logto before tests.'
  );
}

/**
 * Save provisioned config to a JSON file for later use
 */
export function saveProvisionedConfig(config: LogtoProvisionConfig, filePath: string): void {
  const fs = require('fs');
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}
