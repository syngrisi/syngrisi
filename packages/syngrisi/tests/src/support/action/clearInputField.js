/**
 * Clear a given input field (placeholder for WDIO's clearElement)
 * @param  {String}   selector Element selector
 */
export default async (selector) => {
    const element = await $(selector);
    await element.clearValue();
};
