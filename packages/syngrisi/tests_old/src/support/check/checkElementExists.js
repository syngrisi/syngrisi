import checkIfElementExists from '../lib/checkIfElementExists';

/**
 * Check if the given element exists
 * @param  {String}   isExisting Whether the element should be existing or not
 *                               (an or no)
 * @param  {String}   selector       Element selector
 */
export default async (isExisting, selector) => {
    let falseCase = true;

    if (isExisting === 'an') {
        falseCase = false;
    }

    await checkIfElementExists(selector, falseCase);
};
