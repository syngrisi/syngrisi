/**
 * Focus the last opened window
 * @param  {String}   obsolete Type of object to focus to (window or tab)
 */
/* eslint-disable no-unused-vars */
export default async (obsolete) => {
/* eslint-enable no-unused-vars */
    /**
     * The last opened window
     * @type {Object}
     */
    const windowHandles = await browser.getWindowHandles();
    const lastWindowHandle = windowHandles.slice(-1)[0];

    await browser.switchToWindow(lastWindowHandle);
};
