/**
 * Check if the given element has the focus
 * @param  {String}   selector  Element selector
 * @param  {String}   falseCase Whether to check if the given element has focus
 *                              or not
 */
export default async (selector, falseCase) => {
    const element = await $(selector);
    const hasFocus = await element.isFocused();

    if (falseCase) {
        expect(hasFocus).not.toBe(
            true,
            'Expected element to not be focused, but it is'
        );
    } else {
        expect(hasFocus).toBe(
            true,
            'Expected element to be focused, but it is not'
        );
    }
};
