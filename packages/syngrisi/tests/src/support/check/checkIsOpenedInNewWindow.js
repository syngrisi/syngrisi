/**
 * Check if the given URL was opened in a new window
 * @param  {String}   expectedUrl The URL to check for
 */
/* eslint-disable no-unused-vars */
export default async (expectedUrl, type) => {
/* eslint-enable no-unused-vars */
    const windowHandles = await browser.getWindowHandles();

    expect(windowHandles).not.toHaveLength(1, 'A popup was not opened');

    const lastWindowHandle = windowHandles.slice(-1);

    await browser.switchToWindow(lastWindowHandle[0]);

    const windowUrl = await browser.getUrl();

    expect(windowUrl).toContain(
        expectedUrl,
        'The popup has a incorrect getUrl'
    );

    await browser.closeWindow();
};
