/**
 * Check if the given elements contains text
 * @param  {String}   elementType   Element type (element or button)
 * @param  {String}   selector       Element selector
 * @param  {String}   falseCase     Whether to check if the content contains
 *                                  text or not
 */
export default async (elementType, selector, falseCase) => {
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

    let boolFalseCase;
    const text = await element[command]();

    if (typeof falseCase === 'undefined') {
        boolFalseCase = false;
    } else {
        boolFalseCase = !!falseCase;
    }

    if (boolFalseCase) {
        expect(text).toBe('');
    } else {
        expect(text).not.toBe('');
    }
};
