/* eslint-disable valid-jsdoc,func-names */
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const { toJSON, paginate, paginateDistinct } = require('./plugins');

const { Schema } = mongoose;

const SnapshotSchema = new Schema({
    name: {
        type: String,
        required: 'SnapshotSchema: the name of the snapshot entity is empty',
    },
    path: {
        type: String,
    },
    filename: {
        type: String,
    },
    imghash: {
        type: String,
        required: 'SnapshotSchema: the image hash of the snapshot entity is empty',
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
        // enum: ['antialiasing', 'nothing', 'less', 'colors', 'alpha'],
        enum: ['antialiasing', 'nothing', 'colors'],
    },
    meta: {
        type: Object,
    },
});

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
        // after handle all checks inside the test
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
); // remove filters that not exist in schema

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

const RunSchema = new Schema({
    name: {
        type: String,
        required: 'RunSchema: the run name cannot be empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'RunSchema: the app field is empty',
    },
    ident: {
        type: String,
        unique: true,
        required: 'RunSchema: the run ident run cannot be empty',
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
    parameters: {
        type: [String],
    },
    meta: {
        type: Object,
    },
});

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

// this is the Projects Schema `VRSAppSchema` name is for historical reason
const AppSchema = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: 'AppSchema: the Application name is empty',
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    updatedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'UserSchema: the username name is empty',
    },
    firstName: {
        type: String,
        required: 'UserSchema: the firstName name is empty',
    },
    lastName: {
        type: String,
        required: 'UserSchema: the lastName name is empty',
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'reviewer', 'user'],
            message: 'UserSchema: role is required',
            required: 'UserSchema: role is required',
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
    createdDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
    },
    expiration: {
        type: Date,
    },
    meta: {
        type: Object,
    },
});

const AppSettingsSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'AppSettingsSchema: the name is empty',
    },
    label: {
        type: String,
        required: 'AppSettingsSchema: the label is empty',
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        required: 'AppSettingsSchema: the type is empty',
    },
    value: {
        type: Schema.Types.Mixed,
        required: 'AppSettingsSchema: the value is empty',
    },
    env_variable: {
        type: String,
    },
    enabled: {
        type: Boolean,
    },
});

AppSettingsSchema.plugin(toJSON);

LogSchema.plugin(toJSON);
LogSchema.plugin(paginate);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

RunSchema.plugin(paginate);
RunSchema.plugin(toJSON);

SuiteSchema.plugin(paginate);
SuiteSchema.plugin(toJSON);

AppSchema.plugin(paginate);
AppSchema.plugin(toJSON);

BaselineSchema.plugin(toJSON);
BaselineSchema.plugin(paginate);

SnapshotSchema.plugin(toJSON);
SnapshotSchema.plugin(paginate);

CheckSchema.plugin(toJSON);
CheckSchema.plugin(paginate);

TestSchema.plugin(toJSON);
TestSchema.plugin(paginate);
TestSchema.plugin(paginateDistinct);

/**
 * Check if email is taken
 * @param {string} username - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isEmailTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

UserSchema.plugin(passportLocalMongoose, { hashField: 'password' });

module.exports = mongoose.model('VRSSnapshot', SnapshotSchema);
module.exports = mongoose.model('VRSCheck', CheckSchema);
module.exports = mongoose.model('VRSTest', TestSchema);
module.exports = mongoose.model('VRSLog', LogSchema);
module.exports = mongoose.model('VRSSuite', SuiteSchema);
module.exports = mongoose.model('VRSApp', AppSchema);
module.exports = mongoose.model('VRSRun', RunSchema);
module.exports = mongoose.model('VRSUser', UserSchema);
module.exports = mongoose.model('VRSBaseline', BaselineSchema);
module.exports = mongoose.model('VRSAppSettings', AppSettingsSchema);
