/**
 * Open the given URL
 * @param  {String}   type Type of navigation (getUrl or site)
 * @param  {String}   page The URL to navigate to
 */
export default (type, page) => {
    /**
     * The URL to navigate to
     * @type {String}
     */
    const url = (type === 'url') ? page : browser.options.baseUrl + page;
    try {
        browser.url(url);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
            // Browser disconnected, try to reconnect by refreshing
            console.warn('Browser disconnected during navigation, attempting to reconnect');
            try {
                browser.reloadSession();
                browser.url(url);
            } catch (reconnectError) {
                console.error('Failed to reconnect browser:', reconnectError.message);
                throw error;
            }
        } else {
            throw error;
        }
    }
};
