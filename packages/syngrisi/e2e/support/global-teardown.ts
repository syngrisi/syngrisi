import { createLogger } from '@lib/logger';
import { stopContainerSystemIfStarted } from '@sso';

const logger = createLogger('GlobalTeardown');

export default async function globalTeardown() {
  try {
    stopContainerSystemIfStarted();
  } catch (error) {
    logger.warn('Failed to stop container system service', { error });
  }
}
