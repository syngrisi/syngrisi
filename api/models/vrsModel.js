'use strict';
const mongoose = require('mongoose');
const {Schema} = mongoose;

const VRSSnapshotSchema = new Schema({
    name: {
        type: String,
        required: 'the name of the snapshot entity is empty',
    },
    path: {
        type: String,
    },
    filename: {
        type: String,
    },
    imghash: {
        type: String,
        required: 'the image hash of the snapshot entity is empty',
    },
    Created_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: [{
            type: String,
            enum: ['new', 'approved'],
        }],
        default: 'new',
    },
    ignoreRegions: {
        type: String,
        default: 'undefined',
    },
    boundRegions: {
        type: String,
        default: 'undefined',
    },
    vOffset: {
        type: Number,
    },
    hOffset: {
        type: Number,
    }
});

const VRSCheckSchema = new Schema({
    name: {
        type: String,
        required: 'the name of the check entity is empty',
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'VRSTest',
        required: 'the test name of the check entity is empty',
    },
    suite: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSuite',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
    },
    baselineId: {
        type: String,
        required: 'the baselineId of the check entity is empty',
    },
    actualSnapshotId: {
        type: String,
    },
    diffId: {
        type: String,
    },
    Created_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    Updated_date: {
        type: Date,
        // default: Date.now,
    },
    status: {
        type: [{
            type: String,
            enum: {
                values: ['new', 'pending', 'approved', 'running', 'passed', 'failed', 'aborted'],
                message: 'Status is required!',
            },
        }],
        default: 'new',
    },
    browserName: {
        type: String,
        default: 'undefined',
    },
    viewport: {
        type: String,
        default: 'undefined',
    },
    os: {
        type: String,
        default: 'undefined',
    },
    domDump: {
        type: String,
    }
    // matchtype: {
    //     type: [{
    //         type: String,
    //         enum: ['new', 'brocken', 'strict', 'ignorecolor',],
    //     }],
    //     default: ['new'],
    // },
});

const VRSTestSchema = new Schema({
    name: {
        type: String,
        // unique: true,
        required: 'the test name is empty',
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'undefined',
    },
    browserName: {
        type: String,
        default: 'undefined',
    },
    viewport: {
        type: String,
        default: 'undefined',
    },
    os: {
        type: String,
        default: 'undefined',
    },
    blinking: {
        type: Number,
        default: 0,
    },
    Updated_date: {
        type: Date,
        // default: Date.now,
    },
    Start_date: {
        type: Date,
        // default: Date.now,
    },
    suite: {
        type: Schema.Types.ObjectId,
    },
});

const VRSSuiteSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the suite name is empty',
    },
    description: {
        type: String,
    },
    Updated_date: {
        type: Date,
        default: Date.now,
    },
});

const VRSAppSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the Application name is empty',
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    Updated_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('VRSSnapshot', VRSSnapshotSchema);
module.exports = mongoose.model('VRSCheck', VRSCheckSchema);
module.exports = mongoose.model('VRSTest', VRSTestSchema);
module.exports = mongoose.model('VRSSuite', VRSSuiteSchema);
module.exports = mongoose.model('VRSApp', VRSAppSchema);
