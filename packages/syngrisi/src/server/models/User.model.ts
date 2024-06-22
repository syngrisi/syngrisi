import mongoose, { Schema, Document, Model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export type UserRole = 'admin' | 'reviewer' | 'user';

export interface UserDocument extends Document {
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    password?: string;
    token?: string;
    apiKey?: string;
    createdDate?: Date;
    updatedDate?: Date;
    expiration?: Date;
    meta?: Record<string, unknown>;
    isEmailTaken: (username: string) => Promise<boolean>;
    setPassword: (password: string) => Promise<UserDocument>;
}

const UserSchema = new Schema<UserDocument>({
    username: {
        type: String,
        unique: true,
        required: [true, 'UserSchema: The "username" field must be required'],
    },
    firstName: {
        type: String,
        required: [true, 'UserSchema: The "firstName" field must be required'],
    },
    lastName: {
        type: String,
        required: [true, 'UserSchema: The "lastName" field must be required'],
    },
    role: {
        type: String,
        enum: ['admin', 'reviewer', 'user'],
        required: [true, 'UserSchema: The "role" field must be required'],
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