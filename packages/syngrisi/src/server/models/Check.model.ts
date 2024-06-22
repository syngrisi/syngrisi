import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface CheckDocument extends Document {
    name: { [key: string]: string };
    test: Schema.Types.ObjectId;
    suite: Schema.Types.ObjectId;
    app: Schema.Types.ObjectId;
    branch?: string;
    realBaselineId?: Schema.Types.ObjectId;
    baselineId?: Schema.Types.ObjectId;
    actualSnapshotId?: Schema.Types.ObjectId;
    diffId?: Schema.Types.ObjectId;
    createdDate: Date;
    updatedDate?: Date;
    // status: ['new', 'pending', 'approved', 'running', 'passed', 'failed', 'aborted'];
    status: ('new' | 'pending' | 'approved' | 'running' | 'passed' | 'failed' | 'aborted' | 'blinking')[];
    browserName?: string;
    browserVersion?: string;
    browserFullVersion?: string;
    viewport?: string;
    os?: string;
    domDump?: string;
    result?: string;
    run?: Schema.Types.ObjectId;
    markedAs?: 'bug' | 'accepted';
    markedDate?: Date;
    markedById?: Schema.Types.ObjectId;
    markedByUsername?: string;
    markedBugComment?: string;
    creatorId?: Schema.Types.ObjectId;
    creatorUsername?: string;
    failReasons?: string[];
    vOffset?: string;
    topStablePixels?: string;
    meta?: Record<string, unknown>;
}

// const CheckSchema: Schema<CheckDocument> = new Schema({
const CheckSchema = new Schema<CheckDocument>({
    name: {
        type: String,
        required: [true, 'CheckSchema: The "name" field must be required'],
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'VRSTest',
        required: [true, 'CheckSchema: The "test" field must be required'],
    },
    suite: {
        type: Schema.Types.ObjectId,
        ref: 'VRSSuite',
        required: [true, 'CheckSchema: The "suite" field must be required'],
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: [true, 'CheckSchema: The "app" field must be required'],
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
        default: ['new'],
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

CheckSchema.plugin(toJSON);
CheckSchema.plugin(paginate);

const Check: Model<CheckDocument> = mongoose.model<CheckDocument>('VRSCheck', CheckSchema);
export default Check as PluginExtededModel<CheckDocument>;

