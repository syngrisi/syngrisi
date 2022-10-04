/**
 * Create an object composed of the picked object properties
 * @param {Object} object input object
 * @param {string[]} keys fields to pick
 * @returns {Object} new object
 */
const pick = (object, keys) => keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        // eslint-disable-next-line no-param-reassign
        if (object[key] !== undefined) obj[key] = object[key];
    }
    return obj;
}, {});

module.exports = pick;
