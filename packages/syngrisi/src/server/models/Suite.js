const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const SuiteSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'SuiteSchema: the suite name is empty',
    },
    tags: {
        type: [String],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'SuiteSchema: the app field is empty',
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

SuiteSchema.plugin(paginate);
SuiteSchema.plugin(toJSON);

const Suite = mongoose.model('VRSSuite', SuiteSchema);
module.exports = Suite;
