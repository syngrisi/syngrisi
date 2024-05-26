const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

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

UserSchema.statics.isEmailTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);
UserSchema.plugin(passportLocalMongoose, { hashField: 'password' });

const User = mongoose.model('VRSUser', UserSchema);
module.exports = User;
