export default async (selector, sec, falseState, state) => {
    /**
     * Maximum number of milliseconds to wait, default 3000
     * @type {Int}
     */
    const ms = (parseInt(sec, 10) || 5000) * 1000;

    /**
     * Boolean interpretation of the false state
     * @type {Boolean}
     */
    let boolFalseState = !!falseState;

    await browser.waitUntil(async function () {
        await browser.refresh();
        await browser.pause(1000);
        const elements = await $$(selector);
        return !boolFalseState ? (elements.length > 0) : (elements.length === 0);
    }, {
        timeout: ms,
        timeoutMsg: `Cannot wait and refresh for element: '${selector}', timeout: '${ms}'ms`
    })
};
