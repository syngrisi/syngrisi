/* eslint-disable no-extend-native */

String.prototype.formatPlaceholders = function (hash) {
    let string = this;
    for (const key in hash) {
        if (Object.prototype.hasOwnProperty.call(hash, key)) {
            string = string.replace(new RegExp(`\\<${key}\\>`, 'gm'), hash[key]);
        }
    }
    return string;
};
