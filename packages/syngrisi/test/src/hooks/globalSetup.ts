
import { FullConfig } from '@playwright/test';
import deleteTestDatabases from "./cleanupDatabases";


async function globalSetup(config: FullConfig) {
  await deleteTestDatabases();
}

export default globalSetup;
