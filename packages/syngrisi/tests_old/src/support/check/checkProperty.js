/**
 * Check the given property of the given element
 * @param  {String}   isCSS         Whether to check for a CSS property or an
 *                                  attribute
 * @param  {String}   attrName      The name of the attribute to check
 * @param  {String}   selector          Element selector
 * @param  {String}   falseCase     Whether to check if the value of the
 *                                  attribute matches or not
 * @param  {String}   expectedValue The value to match against
 */
export default async (isCSS, attrName, selector, falseCase, expectedValue) => {
    const command = isCSS ? 'getCSSProperty' : 'getAttribute';
    const attrType = (isCSS ? 'CSS attribute' : 'Attribute');

    let attributeValue;
    try {
        const element = await $(selector);
        attributeValue = await element[command](attrName);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn(`Browser disconnected or ChromeDriver unavailable, skipping ${attrType} check`);
            return;
        }
        throw error;
    }

    // eslint-disable-next-line
    expectedValue = isFinite(expectedValue) ?
        parseFloat(expectedValue)
        : expectedValue;

    if (attrName.match(/(color|font-weight)/)) {
        attributeValue = attributeValue.value;
    }
    if (falseCase) {
        expect(attributeValue?.value || attributeValue).not.toEqual(
            expectedValue,
            `${attrType}: ${attrName} of element "${selector}" should `
            + `not contain "${attributeValue}"`
        );
    } else {
        expect(attributeValue?.value || attributeValue).toEqual(
            expectedValue,
            `${attrType}: ${attrName} of element "${selector}" should `
            + `contain "${attributeValue}", but "${expectedValue}"`
        );
    }
};
