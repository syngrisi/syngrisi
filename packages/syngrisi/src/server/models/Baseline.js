const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const BaselineSchema = new Schema({
    snapshootId: Schema.Types.ObjectId,
    name: {
        type: String,
        required: 'VRSBaselineSchema: the name of the snapshoot entity is empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'VRSBaselineSchema: the app field is empty',
    },
    branch: {
        type: String,
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
    markedAs: {
        type: String,
        enum: ['bug', 'accepted'],
    },
    lastMarkedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
    },
    markedById: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
    },
    markedByUsername: {
        type: String,
    },
    ignoreRegions: {
        type: String,
    },
    boundRegions: {
        type: String,
    },
    matchType: {
        type: String,
        enum: ['antialiasing', 'nothing', 'colors'],
    },
    meta: {
        type: Object,
    },
});

BaselineSchema.plugin(toJSON);
BaselineSchema.plugin(paginate);

const Baseline = mongoose.model('VRSBaseline', BaselineSchema);
module.exports = Baseline;
