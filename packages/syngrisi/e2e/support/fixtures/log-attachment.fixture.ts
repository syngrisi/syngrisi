import { test as base } from 'playwright-bdd';
import type { AppServerFixture } from './app-server.fixture';

type LogAttachmentFixture = {
  _logAttachment: void;
};

export const logAttachmentFixture = base.extend<
  LogAttachmentFixture & { appServer: AppServerFixture }
>({
  _logAttachment: [
    async ({ appServer }, use, testInfo) => {
      await use();
      
      if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
        const backendLogs = appServer.getBackendLogs();
        const frontendLogs = appServer.getFrontendLogs();
        
        if (backendLogs) {
          await testInfo.attach('backend-logs.txt', {
            body: backendLogs,
            contentType: 'text/plain',
          });
        }
        
        if (frontendLogs) {
          await testInfo.attach('frontend-logs.txt', {
            body: frontendLogs,
            contentType: 'text/plain',
          });
        }
      }
    },
    { auto: true },
  ],
});
