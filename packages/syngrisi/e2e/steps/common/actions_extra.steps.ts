import { When } from '@fixtures';
import { getLocatorQuery } from '@helpers/locators';
import { renderTemplate } from '@helpers/template';

When(
    'I select the option with the value {string} for element {string}',
    async ({ page, testData }, optionValue: string, selector: string) => {
        const renderedSelector = renderTemplate(selector, testData);
        const renderedOptionValue = renderTemplate(optionValue, testData);

        const locator = getLocatorQuery(page, renderedSelector);
        const targetLocator = locator.first();

        // Wait for element to be visible and attached
        await targetLocator.waitFor({ state: 'attached', timeout: 5000 });

        // Use selectOption with value
        await targetLocator.selectOption({ value: renderedOptionValue });
    }
);
