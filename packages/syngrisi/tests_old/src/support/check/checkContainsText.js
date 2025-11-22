/**
 * Check if the given elements contains text
 * @param  {String}   elementType   Element type (element or button)
 * @param  {String}   selector       Element selector
 * @param  {String}   falseCase     Whether to check if the content contains
 *                                  the given text or not
 * @param  {String}   expectedText  The text to check against
 */
export default async (elementType, selector, falseCase, expectedText) => {
    let command = 'getValue';
    const elem = await $(selector);

    if (['button', 'container'].includes(elementType)) {
        command = 'getText';
    } else {
        const valueAttr = await elem.getAttribute('value');
        if (valueAttr === null) {
            command = 'getText';
        }
    }

    let boolFalseCase;
    let stringExpectedText = expectedText;

    const text = await elem[command]();

    if (typeof expectedText === 'undefined') {
        stringExpectedText = falseCase;
        boolFalseCase = false;
    } else {
        boolFalseCase = (falseCase === ' not');
    }

    if (boolFalseCase) {
        expect(text).not.toContain(stringExpectedText);
    } else {
        expect(text).toContain(stringExpectedText);
    }
};
