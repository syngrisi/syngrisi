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
    createdDate: {
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
    markedAs: {
        type: String,
        enum: ['bug', 'accepted'],
        default: undefined,
    },
    markedDate: {
        type: Date,
    },
    markedBy: {
        type: String,
        default: undefined
    },
    lastMarkedCheck: {
        type: Schema.Types.ObjectId,
        ref: 'VRSCheck',
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
    },
    matchType: {
        type: String,
        enum: ['antialiasing', 'nothing', 'less', 'colors', 'alpha'],
        default: 'antialiasing',
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
        default: 'undefined',
    },
    browserVersion: {
        type: String,
        default: 'undefined',
    },
    browserFullVersion: {
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
    },
    result: {
        type: String,
        default: '{}'
    },
    run: {
        type: Schema.Types.ObjectId,
    },
    markedAs: {
        type: String,
        enum: ['bug', 'accepted'],
        default: undefined,
    },
    markedDate: {
        type: Date,
    },
    markedBy: {
        type: String,
        default: undefined
    },
});

const VRSTestSchema = new Schema({
        name: {
            type: String,
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
        browserVersion: {
            type: String,
            default: 'undefined',
        },
        // on the start of test
        viewport: {
            type: String,
            default: 'undefined',
        },
        // after handle all checks inside the test
        calculatedViewport: {
            type: String,
            default: '???',
        },
        os: {
            type: String,
            default: 'undefined',
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
        suite: {
            type: Schema.Types.ObjectId,
        },
        run: {
            type: Schema.Types.ObjectId,
        },
        accepted: {
            type: Boolean,
            default: false
        },
    },
    {strictQuery: true}); // remove filters that not exist in schema

const VRSSuiteSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the suite name is empty',
    },
    tags: {
        type: [String],
        default: undefined
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

const VRSRunSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the suite name is empty',
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

const VRSLogSchema = new Schema({
    msgType: {
        type: String,
        default: 'other',
        unique: true,
        required: 'the suite name is empty',
    },
    severity: {
        type: String,
        enum: ['debug', 'info', 'warning', 'error'],
        default: 'info',
    },
    message: {
        type: String,
    },
    date: {
        type: Date,
        default: undefined,
    },
});

const VRSAppSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the application name is empty',
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

const VRSUserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'the username name is empty',
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: 'role is required',
        },
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    apiKey: {
        type: String,
    },
    updatedDate: {
        type: Date,
    },
    expiration: {
        type: Date,
    },
});

module.exports = mongoose.model('VRSSnapshot', VRSSnapshotSchema);
module.exports = mongoose.model('VRSCheck', VRSCheckSchema);
module.exports = mongoose.model('VRSTest', VRSTestSchema);
module.exports = mongoose.model('VRSSuite', VRSSuiteSchema);
module.exports = mongoose.model('VRSApp', VRSAppSchema);
module.exports = mongoose.model('VRSRun', VRSRunSchema);
module.exports = mongoose.model('VRSLog', VRSLogSchema);
module.exports = mongoose.model('VRSUser', VRSUserSchema);
