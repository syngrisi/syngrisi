import { Given } from '@fixtures';
import { clearDatabase } from '@utils/db-cleanup';

Given('the Syngrisi application is running', async ({ appServer }) => {
  // Database is already cleared in global-setup or beforeScenario hook
  // Server is started via appServer fixture
  if (!appServer.baseURL) {
    throw new Error('Syngrisi application server is not running');
  }
});

Given('the database is cleared', async () => {
  clearDatabase();
});

Given('the database is cleared for worker {int}', async ({ }, workerId: number) => {
  clearDatabase(workerId);
});

