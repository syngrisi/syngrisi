/**
 * Move to the given selector with an optional offset on a X and Y position
 * @param  {String}   selector  Element selector
 * @param  {String}   x        X coordinate to move to
 * @param  {String}   y        Y coordinate to move to
 */
export default async (selector, x, y) => {
    /**
     * X coordinate
     * @type {Int}
     */
    const intX = parseInt(x, 10) || undefined;

    /**
     * Y coordinate
     * @type {Int}
     */
    const intY = parseInt(y, 10) || undefined;

    const element = await $(selector);
    await element.moveTo(intX, intY);
};
