/**
 * Check if a cookie with the given name exists
 * @param  {[type]}   name      The name of the cookie
 * @param  {[type]}   falseCase Whether or not to check if the cookie exists or
 *                              not
 */
export default async (name, falseCase) => {
    const cookies = await browser.getCookies([name]);

    if (falseCase) {
        expect(cookies).toHaveLength(
            0,
            `Expected cookie "${name}" not to exists but it does`
        );
    } else {
        expect(cookies).not.toHaveLength(
            0,
            `Expected cookie "${name}" to exists but it does not`
        );
    }
};
