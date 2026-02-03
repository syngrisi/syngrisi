import { createLogger } from '@lib/logger';
import { stopContainerSystemIfStarted } from '@sso';
import { closeAllPooledConnections } from '@utils/db-cleanup';
import { stopAllServers } from '@utils/app-server';

const logger = createLogger('GlobalTeardown');

export default async function globalTeardown() {
  try {
    stopContainerSystemIfStarted();
  } catch (error) {
    logger.warn('Failed to stop container system service', { error });
  }

  try {
    stopAllServers();
  } catch (error) {
    logger.warn('Failed to stop running syngrisi servers', { error });
  }

  try {
    await closeAllPooledConnections();
  } catch (error) {
    logger.warn('Failed to close pooled Mongo connections', { error });
  }
}
