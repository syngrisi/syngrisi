/**
 * Check the URL of the given browser window
 * @param  {String}   falseCase   Whether to check if the URL matches the
 *                                expected value or not
 * @param  {String}   expectedUrl The expected URL to check against
 */
export default async (falseCase, expectedUrl) => {
    const currentUrl = await browser.getUrl();

    if (falseCase) {
        expect(currentUrl)
            .not.toEqual(expectedUrl, `expected url not to be "${currentUrl}"`);
    } else {
        expect(currentUrl).toEqual(
            expectedUrl,
            `expected url to be "${expectedUrl}" but found `
            + `"${currentUrl}"`
        );
    }
};
