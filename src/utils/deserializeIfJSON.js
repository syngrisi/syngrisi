const { EJSON } = require('bson');
const isJSON = require('./isJSON');

const deserializeIfJSON = (text) => {
    if (isJSON(text)) return EJSON.parse(text || null) || undefined;
    return text;
};

module.exports = deserializeIfJSON;
