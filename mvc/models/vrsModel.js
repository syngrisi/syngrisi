/* eslint-disable valid-jsdoc */
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const SnapshotSchema = new Schema({
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

const CheckSchema = new Schema({
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

const TestSchema = new Schema(
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
        checks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'VRSCheck',
            },
        ],
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

const SuiteSchema = new Schema({
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

const RunSchema = new Schema({
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

const UserSchema = new Schema({
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
    createdDate: {
        type: Date,
    },
    updatedDate: {
        type: Date,
    },
    expiration: {
        type: Date,
    },
});

const Settings = new Schema({
    firstRun: Boolean,
});

LogSchema.plugin(toJSON);
LogSchema.plugin(paginate);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

TestSchema.plugin(toJSON);
TestSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} username - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isEmailTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    log.warn(user);
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
module.exports = mongoose.model('VRSSettings', Settings);
