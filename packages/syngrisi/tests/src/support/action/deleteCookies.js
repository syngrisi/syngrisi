/**
 * Delete a cookie
 * @param  {String}   name The name of the cookie to delete
 */
export default async (name) => {
    await browser.deleteCookies(name);
};
