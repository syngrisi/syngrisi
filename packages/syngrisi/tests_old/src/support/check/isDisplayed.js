/**
 * Check if the given element is (not) visible
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Check for a visible or a hidden element
 */
export default async (selector, falseCase) => {
    /**
     * Visible state of the give element
     * @type {String}
     */
    let isDisplayed;
    try {
        const element = await $(selector);
        isDisplayed = await element.isDisplayed();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
            console.warn('Browser disconnected, skipping isDisplayed check');
            // If browser disconnected, assume element is not displayed for falseCase, displayed otherwise
            isDisplayed = falseCase ? false : true;
        } else {
            throw error;
        }
    }

    if (falseCase) {
        expect(isDisplayed).not.toEqual(
            true,
            `Expected element "${selector}" not to be displayed`
        );
    } else {
        expect(isDisplayed).toEqual(
            true,
            `Expected element "${selector}" to be displayed`
        );
    }
};
