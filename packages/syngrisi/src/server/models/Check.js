const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const CheckSchema = new Schema({
    name: {
        type: String,
        required: 'CheckSchema: the name of the check entity is empty',
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'VRSTest',
        required: 'CheckSchema: the test name of the check entity is empty',
    },
    suite: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSuite',
        required: 'CheckSchema: the app field is empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'CheckSchema: the app field is empty',
    },
    branch: {
        type: String,
    },
    realBaselineId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSBaseline',
    },
    baselineId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSnapshot',
    },
    actualSnapshotId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSnapshot',
    },
    diffId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSnapshot',
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
    },
    status: {
        type: [{
            type: String,
            enum: {
                values: ['new', 'pending', 'approved', 'running', 'passed', 'failed', 'aborted'],
                message: 'status is required',
            },
        }],
        default: 'new',
    },
    browserName: {
        type: String,
    },
    browserVersion: {
        type: String,
    },
    browserFullVersion: {
        type: String,
    },
    viewport: {
        type: String,
    },
    os: {
        type: String,
    },
    domDump: {
        type: String,
    },
    result: {
        type: String,
        default: '{}',
    },
    run: {
        type: Schema.Types.ObjectId,
    },
    markedAs: {
        type: String,
        enum: ['bug', 'accepted'],
    },
    markedDate: {
        type: Date,
    },
    markedById: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
    },
    markedByUsername: {
        type: String,
    },
    markedBugComment: {
        type: String,
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
    },
    creatorUsername: {
        type: String,
    },
    failReasons: {
        type: [String],
    },
    vOffset: {
        type: String,
    },
    topStablePixels: {
        type: String,
    },
    meta: {
        type: Object,
    },
});

CheckSchema.plugin(toJSON);
CheckSchema.plugin(paginate);

const Check = mongoose.model('VRSCheck', CheckSchema);
module.exports = Check;
