import mongoose, { Schema, Document, Model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface UserDocument extends Document {
    username: { [key: string]: string | boolean | number };
    firstName: { [key: string]: string | boolean | number };
    lastName: { [key: string]: string | boolean | number };
    role: {
        type: string,
        enum: ['admin', 'reviewer', 'user'],
        required: string,
    };
    password?: string;
    token?: string;
    apiKey?: string;
    createdDate?: Date;
    updatedDate?: Date;
    expiration?: Date;
    meta?: Record<string, unknown>;

    isEmailTaken: (username: string) => Promise<boolean>;
    // paginate: any;
    setPassword: (password: string) => Promise<UserDocument>;
}

const UserSchema: Schema<UserDocument> = new Schema({
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
        enum: ['admin', 'reviewer', 'user'],
        required: 'UserSchema: role is required',
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

const User: Model<UserDocument> = mongoose.model<UserDocument>('VRSUser', UserSchema);

export default User as PluginExtededModel<UserDocument>;