/**
 * Check if the given elements text is the same as the given text
 * @param  {String}   elementType   Element type (element or button)
 * @param  {String}   selector       Element selector
 * @param  {String}   falseCase     Whether to check if the content equals the
 *                                  given text or not
 * @param  {String}   expectedText  The text to validate against
 */
export default async (elementType, selector, falseCase, expectedText) => {
    let command = 'getValue';
    const element = await $(selector);

    if (elementType === 'button') {
        command = 'getText';
    } else {
        const valueAttr = await element.getAttribute('value');
        if (valueAttr === null) {
            command = 'getText';
        }
    }

    let parsedExpectedText = expectedText;
    let boolFalseCase = !!falseCase;

    if (typeof parsedExpectedText === 'function') {
        parsedExpectedText = '';
        boolFalseCase = !boolFalseCase;
    }

    if (parsedExpectedText === undefined && falseCase === undefined) {
        parsedExpectedText = '';
        boolFalseCase = true;
    }

    const text = await element[command]();

    if (boolFalseCase) {
        expect(parsedExpectedText).not.toBe(text);
    } else {
        expect(parsedExpectedText).toBe(text);
    }
};
