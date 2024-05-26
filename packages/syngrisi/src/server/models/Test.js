const mongoose = require('mongoose');
const { toJSON, paginate, paginateDistinct } = require('./plugins');

const { Schema } = mongoose;

const TestSchema = new Schema(
    {
        name: {
            type: String,
            required: 'TestSchema: the test name is empty',
        },
        description: {
            type: String,
        },
        status: {
            type: String,
        },
        browserName: {
            type: String,
        },
        browserVersion: {
            type: String,
        },
        branch: {
            type: String,
        },
        tags: {
            type: [String],
        },
        viewport: {
            type: String,
        },
        calculatedViewport: {
            type: String,
        },
        os: {
            type: String,
        },
        app: {
            type: Schema.Types.ObjectId,
            ref: 'VRSApp',
            required: 'TestSchema: the app field is empty',
        },
        blinking: {
            type: Number,
            default: 0,
        },
        updatedDate: {
            type: Date,
        },
        startDate: {
            type: Date,
        },
        checks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'VRSCheck',
            },
        ],
        suite: {
            type: Schema.Types.ObjectId,
            ref: 'VRSSuite',
        },
        run: {
            type: Schema.Types.ObjectId,
            ref: 'VRSRun',
        },
        markedAs: {
            type: String,
            enum: ['Bug', 'Accepted', 'Unaccepted', 'Partially'],
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'VRSUser',
        },
        creatorUsername: {
            type: String,
        },
        meta: {
            type: Object,
        },
    },
    { strictQuery: true }
);

TestSchema.plugin(toJSON);
TestSchema.plugin(paginate);
TestSchema.plugin(paginateDistinct);

const Test = mongoose.model('VRSTest', TestSchema);
module.exports = Test;
