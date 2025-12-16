
import { FullConfig } from '@playwright/test';
import deleteTestDatabases from "./cleanupDatabases";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(config: FullConfig) {
  await deleteTestDatabases();
}

export default globalSetup;
