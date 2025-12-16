/**
 * SSO Test Infrastructure
 *
 * This module provides utilities for managing Logto SSO infrastructure
 * during E2E testing.
 */

export {
  logtoTestManager,
  startLogtoInfrastructure,
  stopLogtoInfrastructure,
  waitForLogto,
  isLogtoAvailable,
  getOIDCConfiguration,
  buildSyngrisiSSOEnv,
  isContainerCLIAvailable,
  isContainerSystemRunning,
  ensureContainerSystemRunning,
  stopContainerSystemIfStarted,
  LOGTO_DEFAULT_CONFIG,
  type LogtoConfig,
  type LogtoAppConfig,
} from './logto-manager';

export {
  provisionLogto,
  saveProvisionedConfig,
  type LogtoProvisionConfig,
  type ProvisionedApp,
  type ProvisionedUser,
} from './provision-logto';
