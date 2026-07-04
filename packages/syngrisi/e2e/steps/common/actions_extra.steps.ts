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

/**
 * Step definition: `When I set the switch for element {string} to {string}`
 *
 * Sets a Mantine Switch (checkbox input) to an absolute "true"/"false" state,
 * clicking it only if its current checked state differs from the desired one.
 * Mirrors the old absolute-set semantics of "I select dropdown option" for
 * settings that used to be a `<select>` and are now a Switch.
 *
 * @param selector - Locator query for the switch/checkbox input.
 * @param desired - Desired state, "true" (checked) or "false" (unchecked).
 *
 * @example
 * ```gherkin
 * When I set the switch for element "[data-test='settings_value_share_enabled']" to "false"
 * ```
 */
When(
    'I set the switch for element {string} to {string}',
    async ({ page, testData }, selector: string, desired: string) => {
        const renderedSelector = renderTemplate(selector, testData);
        const wantChecked = desired === 'true';

        const locator = getLocatorQuery(page, renderedSelector).first();
        await locator.waitFor({ state: 'visible', timeout: 10000 });

        const isChecked = await locator.isChecked();
        if (isChecked !== wantChecked) {
            await locator.click();
        }
    }
);
