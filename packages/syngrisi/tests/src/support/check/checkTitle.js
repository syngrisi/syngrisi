/**
 * Check the title of the current browser window
 * @param  {Type}     falseCase     Whether to check if the title matches the
 *                                  expected value or not
 * @param  {Type}     expectedTitle The expected title
 */
export default async (falseCase, expectedTitle) => {
    const title = await browser.getTitle();

    if (falseCase) {
        expect(title).not.toEqual(
            expectedTitle,
            `Expected title not to be "${expectedTitle}"`
        );
    } else {
        expect(title).toEqual(
            expectedTitle,
            `Expected title to be "${expectedTitle}" but found "${title}"`
        );
    }
};
