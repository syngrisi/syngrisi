import { test as base } from 'playwright-bdd';
import type { AppServerFixture } from './app-server.fixture';

type LogAttachmentFixture = {
  _logAttachment: void;
};

export const logAttachmentFixture = base.extend<
  LogAttachmentFixture & { appServer: AppServerFixture }
>({
  _logAttachment: [
    async ({ appServer, page, context }, use, testInfo) => {
      const consoleLogs: string[] = [];
      const pageErrors: string[] = [];
      const failedRequests: string[] = [];

      const onConsole = (msg: any) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
      const onPageError = (error: Error) => pageErrors.push(error.stack || error.message);
      const onRequestFailed = (request: any) => {
        failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText || 'unknown error'}`);
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);
      context.on('requestfailed', onRequestFailed);

      await use();
      
      if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
        const backendLogs = appServer.getBackendLogs();
        const frontendLogs = appServer.getFrontendLogs();
        if (consoleLogs.length > 0) {
          await testInfo.attach('browser-console.log', {
            body: consoleLogs.join('\n'),
            contentType: 'text/plain',
          });
        }

        if (pageErrors.length > 0) {
          await testInfo.attach('browser-errors.log', {
            body: pageErrors.join('\n\n'),
            contentType: 'text/plain',
          });
        }

        if (failedRequests.length > 0) {
          await testInfo.attach('failed-requests.log', {
            body: failedRequests.join('\n'),
            contentType: 'text/plain',
          });
        }
        
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

      page.off('console', onConsole);
      page.off('pageerror', onPageError);
      context.off('requestfailed', onRequestFailed);
    },
    { auto: true },
  ],
});
