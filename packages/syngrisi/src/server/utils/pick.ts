/**
 * Create an object composed of the picked object properties
 * @param {T} object input object
 * @param {Array<keyof T>} keys fields to pick
 * @returns {Partial<T>} new object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pick = <T extends Record<string, any>>(object: T, keys: Array<keyof T>): Partial<T> => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            if (object[key] !== undefined) obj[key] = object[key];
        }
        return obj;
    }, {} as Partial<T>);
};

export default pick;
