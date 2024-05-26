const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const LogSchema = new Schema({
    timestamp: {
        type: Date,
    },
    level: {
        type: String,
    },
    message: {
        type: String,
    },
    meta: {
        type: Object,
    },
    hostname: {
        type: Object,
    },
});

LogSchema.plugin(toJSON);
LogSchema.plugin(paginate);

const Log = mongoose.model('VRSLog', LogSchema);
module.exports = Log;
