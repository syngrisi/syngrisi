import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface ShareTokenDocument extends Document {
    checkId: Schema.Types.ObjectId;
    token: string;
    createdById: Schema.Types.ObjectId;
    createdByUsername: string;
    createdDate: Date;
    isRevoked: boolean;
    revokedDate?: Date;
    revokedById?: Schema.Types.ObjectId;
    revokedByUsername?: string;
}

const ShareTokenSchema = new Schema<ShareTokenDocument>({
    checkId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSCheck',
        required: [true, 'ShareTokenSchema: The "checkId" field is required'],
        index: true,
    },
    token: {
        type: String,
        required: [true, 'ShareTokenSchema: The "token" field is required'],
        unique: true,
        index: true,
    },
    createdById: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
        required: [true, 'ShareTokenSchema: The "createdById" field is required'],
    },
    createdByUsername: {
        type: String,
        required: [true, 'ShareTokenSchema: The "createdByUsername" field is required'],
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
    revokedDate: {
        type: Date,
    },
    revokedById: {
        type: Schema.Types.ObjectId,
        ref: 'VRSUser',
    },
    revokedByUsername: {
        type: String,
    },
});

ShareTokenSchema.plugin(toJSON);
ShareTokenSchema.plugin(paginate);

const ShareToken: Model<ShareTokenDocument> = mongoose.model<ShareTokenDocument>('VRSShareToken', ShareTokenSchema);
export default ShareToken as PluginExtededModel<ShareTokenDocument>;
