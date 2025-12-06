/**
 * Scroll the page to the given element
 * @param  {String}   selector Element selector
 */
export default async (selector) => {
    const element = await $(selector);
    await element.scrollIntoView();
};
