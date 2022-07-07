'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

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
    vOffset: {
        type: Number,
    },
    hOffset: {
        type: Number,
    },
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
    branch: {
        type: String,
    },
    baselineId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSnapshot',
    },
    realBaselineId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSBaseline',
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
});

const VRSBaselineSchema = new Schema({
    snapshootId: Schema.Types.ObjectId,
    name: {
        type: String,
        required: 'VRSBaselineSchema: the name of the snapshoot entity is empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
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
        // enum: ['antialiasing', 'nothing', 'less', 'colors', 'alpha'],
        enum: ['antialiasing', 'nothing', 'colors'],
    },
});

const VRSTestSchema = new Schema(
    {
        name: {
            type: String,
            required: 'the test name is empty',
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
        // after handle all checks inside the test
        calculatedViewport: {
            type: String,
        },
        os: {
            type: String,
        },
        app: {
            type: Schema.Types.ObjectId,
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
    },
    { strictQuery: true }
); // remove filters that not exist in schema

const VRSSuiteSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'the suite name is empty',
    },
    tags: {
        type: [String],
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
        required: 'the run name cannot be empty',
    },
    ident: {
        type: String,
        required: 'the run ident run cannot be empty',
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    parameters: {
        type: [String],
    },
});

const VRSLogSchema = new Schema({
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

// this is the Projects Schema `VRSAppSchema` name is for historical reason
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
    firstName: {
        type: String,
        required: 'the firstName name is empty',
    },
    lastName: {
        type: String,
        required: 'the lastName name is empty',
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'reviewer', 'user'],
            message: 'role is required',
            required: 'role is required',
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

const VRSSettings = new Schema({
    firstRun: Boolean,
});

const passportLocalMongoose = require('passport-local-mongoose');

VRSUserSchema.plugin(passportLocalMongoose, { hashField: 'password' });

module.exports = mongoose.model('VRSSnapshot', VRSSnapshotSchema);
module.exports = mongoose.model('VRSCheck', VRSCheckSchema);
module.exports = mongoose.model('VRSTest', VRSTestSchema);
module.exports = mongoose.model('VRSLog', VRSLogSchema);
module.exports = mongoose.model('VRSSuite', VRSSuiteSchema);
module.exports = mongoose.model('VRSApp', VRSAppSchema);
module.exports = mongoose.model('VRSRun', VRSRunSchema);
module.exports = mongoose.model('VRSUser', VRSUserSchema);
module.exports = mongoose.model('VRSBaseline', VRSBaselineSchema);
module.exports = mongoose.model('VRSSettings', VRSSettings);
