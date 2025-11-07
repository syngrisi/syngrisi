import { When } from '@fixtures';
import type { Page } from '@playwright/test';
import { createLogger } from '@lib/logger';
import type { AppServerFixture } from '@fixtures';

const logger = createLogger('NavigationSteps');

When('I go to {string} page', async ({ page, appServer }: { page: Page; appServer: AppServerFixture }, pageName: string) => {
  const pages: Record<string, string> = {
    main: `${appServer.baseURL}/`,
    first_run: `${appServer.baseURL}/auth/change?first_run=true`,
    runs: `${appServer.baseURL}/runs`,
    change_password: `${appServer.baseURL}/auth/change`,
    logout: `${appServer.baseURL}/auth/logout`,
    admin2: `${appServer.baseURL}/admin`,
    logs: `${appServer.baseURL}/admin/logs`,
    settings: `${appServer.baseURL}/admin/settings`,
  };

  const adminPages: Record<string, Record<string, string>> = {
    admin: {
      users: `${appServer.baseURL}/admin?task=users`,
      tasks: `${appServer.baseURL}/admin?task=tasks`,
    },
  };

  let url: string;
  if (pageName.includes('>')) {
    const [page, subPage] = pageName.split('>');
    url = adminPages[page]?.[subPage] || pages[pageName];
  } else {
    url = pages[pageName];
  }

  if (!url) {
    throw new Error(`Unknown page: ${pageName}`);
  }

  logger.info(`Navigating to ${url}`);
  await page.goto(url);
});

