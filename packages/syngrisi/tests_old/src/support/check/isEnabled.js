/**
 * Check if the given selector is enabled
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Whether to check if the given selector
 *                              is enabled or not
 */
export default async (selector, falseCase) => {
    const element = await $(selector);
    const isEnabled = await element.isEnabled();

    if (falseCase) {
        expect(isEnabled).not.toEqual(
            true,
            `Expected element "${selector}" not to be enabled`
        );
    } else {
        expect(isEnabled).toEqual(
            true,
            `Expected element "${selector}" to be enabled`
        );
    }
};
