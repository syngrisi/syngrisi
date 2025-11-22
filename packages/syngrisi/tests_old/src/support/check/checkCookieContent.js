/**
 * Check the content of a cookie against a given value
 * @param  {String}   name          The name of the cookie
 * @param  {String}   falseCase     Whether or not to check if the value matches
 *                                  or not
 * @param  {String}   expectedValue The value to check against
 */
export default async (name, falseCase, expectedValue) => {
    const cookies = await browser.getCookies([name]);
    const cookie = cookies[0];
    expect(cookie?.name).toBe(
        name,
        `no cookie found with the name "${name}"`
    );

    if (falseCase) {
        expect(cookie.value).not.toBe(
            expectedValue,
            `expected cookie "${name}" not to have value "${expectedValue}"`
        );
    } else {
        expect(cookie.value).toBe(
            expectedValue,
            `expected cookie "${name}" to have value "${expectedValue}"`
            + ` but got "${cookie.value}"`
        );
    }
};
