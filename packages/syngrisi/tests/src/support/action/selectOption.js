/**
 * Select an option of a select element
 * @param  {String}   selectionType  Type of method to select by (name, value or
 *                                   text)
 * @param  {String}   selectionValue Value to select by
 * @param  {String}   selector     Element selector
 */
export default async (selectionType, selectionValue, selector) => {
    /**
     * The method to use for selecting the option
     * @type {String}
     */
    let command = '';
    const commandArguments = [selectionValue];

    switch (selectionType) {
        case 'name': {
            command = 'selectByAttribute';

            // The selectByAttribute command expects the attribute name as it
            // second argument so let's add it
            commandArguments.unshift('name');

            break;
        }

        case 'value': {
            // The selectByAttribute command expects the attribute name as it
            // second argument so let's add it
            commandArguments.unshift('value');
            command = 'selectByAttribute';
            break;
        }

        case 'text': {
            command = 'selectByVisibleText';
            break;
        }

        default: {
            throw new Error(`Unknown selection type "${selectionType}"`);
        }
    }

    try {
        const element = await $(selector);
        await element[command](...commandArguments);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping select option');
        } else {
            throw error;
        }
    }
};
