/**
 * Check the selected state of the given element
 * @param  {String}   selector   Element selector
 * @param  {String}   falseCase Whether to check if the element is elected or
 *                              not
 */
export default async (selector, falseCase) => {
    const element = await $(selector);
    const isSelected = await element.isSelected();

    if (falseCase) {
        expect(isSelected)
            .not.toEqual(true, `"${selector}" should not be selected`);
    } else {
        expect(isSelected)
            .toEqual(true, `"${selector}" should be selected`);
    }
};
