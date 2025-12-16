import { When, Then } from '@fixtures';
import { expect } from '@playwright/test';
import { createLogger } from '@lib/logger';

const logger = createLogger('DialogSteps');

When('I prepare to accept confirmation dialog with text {string}', async ({ page }, text: string) => {
    logger.info(`Preparing to accept dialog with text: "${text}"`);
    page.once('dialog', async dialog => {
        logger.info(`Dialog appeared with message: "${dialog.message()}"`);
        expect(dialog.message()).toContain(text);
        await dialog.accept();
        logger.info('Dialog accepted');
    });
});

When('I prepare to dismiss confirmation dialog with text {string}', async ({ page }, text: string) => {
    logger.info(`Preparing to dismiss dialog with text: "${text}"`);
    page.once('dialog', async dialog => {
        logger.info(`Dialog appeared with message: "${dialog.message()}"`);
        expect(dialog.message()).toContain(text);
        await dialog.dismiss();
        logger.info('Dialog dismissed');
    });
});
