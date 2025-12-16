import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

/**
 * DOM Snapshot document interface
 * Stores DOM tree data for RCA (Root Cause Analysis)
 */
export interface DomSnapshotDocument extends Document {
    checkId: Types.ObjectId;
    baselineId?: Types.ObjectId;
    type: 'actual' | 'baseline';
    filename: string;
    hash: string;
    compressed: boolean;
    originalSize: number;
    compressedSize?: number;
    createdDate: Date;
}

const DomSnapshotSchema: Schema<DomSnapshotDocument> = new Schema({
    checkId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSCheck',
        required: [true, 'DomSnapshotSchema: The "checkId" field is required'],
        index: true,
    },
    baselineId: {
        type: Schema.Types.ObjectId,
        ref: 'VRSBaseline',
        index: true,
    },
    type: {
        type: String,
        enum: ['actual', 'baseline'],
        required: [true, 'DomSnapshotSchema: The "type" field is required'],
    },
    filename: {
        type: String,
        required: [true, 'DomSnapshotSchema: The "filename" field is required'],
    },
    hash: {
        type: String,
        required: [true, 'DomSnapshotSchema: The "hash" field is required'],
        index: true,
    },
    compressed: {
        type: Boolean,
        default: false,
    },
    originalSize: {
        type: Number,
        required: [true, 'DomSnapshotSchema: The "originalSize" field is required'],
    },
    compressedSize: {
        type: Number,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Compound indexes for efficient queries
DomSnapshotSchema.index({ checkId: 1, type: 1 });
DomSnapshotSchema.index({ baselineId: 1, type: 1 });

DomSnapshotSchema.plugin(toJSON);
DomSnapshotSchema.plugin(paginate);

const DomSnapshot: Model<DomSnapshotDocument> = mongoose.model<DomSnapshotDocument>('VRSDomSnapshot', DomSnapshotSchema);

export default DomSnapshot as PluginExtededModel<DomSnapshotDocument>;
