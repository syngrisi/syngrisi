/**
 * Check if the given element is visible inside the current viewport
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Whether to check if the element is visible
 *                              within the current viewport or not
 */
export default async (selector, falseCase) => {
    const element = await $(selector);
    const isDisplayed = await element.isDisplayedInViewport();

    if (falseCase) {
        expect(isDisplayed).not.toEqual(
            true,
            `Expected element "${selector}" to be outside the viewport`
        );
    } else {
        expect(isDisplayed).toEqual(
            true,
            `Expected element "${selector}" to be inside the viewport`
        );
    }
};
