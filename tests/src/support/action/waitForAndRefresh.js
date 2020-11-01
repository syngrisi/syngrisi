export default (selector, sec, falseState, state) => {
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

    browser.waitUntil(function () {
        browser.refresh();
        return !boolFalseState ? ($$(selector).length > 0) : ($$(selector).length === 0);
    }, {
        timeout: ms,
        timeoutMsg: `Cannot wait and refresh for element: '${selector}', timeout: '${ms}'ms`
    })
};
