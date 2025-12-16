/**
 * Check the given property of the given element
 * @param  {String}   isCSS         Whether to check for a CSS property or an
 *                                  attribute
 * @param  {String}   attrName      The name of the attribute to check
 * @param  {String}   elem          Element selector
 * @param  {String}   falseCase     Whether to check if the value of the
 *                                  attribute matches or not
 * @param  {String}   expectedValue The value to match against
 */
export default async (isCSS, attrName, elem, falseCase, expectedValue) => {
    const command = isCSS ? 'getCSSProperty' : 'getAttribute';
    const attrType = (isCSS ? 'CSS attribute' : 'Attribute');
    const element = await $(elem);
    let attributeValue = await element[command](attrName);

    if (attrName.match(/(font-size|line-height|display|font-weight)/)) {
        attributeValue = attributeValue.value;
    }

    if (falseCase) {
        expect(attributeValue).not.toBe(
            expectedValue,
            `${attrType}: ${attrName} of element "${elem}" should not `
            + `contain "${attributeValue}"`
        );
    } else {
        expect(attributeValue).toBe(
            expectedValue,
            `${attrType}: ${attrName} of element "${elem}" should contain `
            + `"${attributeValue}", but "${expectedValue}"`
        );
    }
};
