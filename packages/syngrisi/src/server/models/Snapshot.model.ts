import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface SnapshotDocument extends Document {
    name: string;
    path?: string;
    filename?: string;
    imghash: string;
    createdDate?: Date;
    vOffset?: number;
    hOffset?: number;
}

const SnapshotSchema: Schema<SnapshotDocument> = new Schema({
    name: {
        type: String,
        required: [true, 'SnapshotSchema: The "name" field must be required'],
    },
    path: {
        type: String,
    },
    filename: {
        type: String,
    },
    imghash: {
        type: String,
        required: [true, 'SnapshotSchema: The "imghash" field must be required'],
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

// Retention cleanup: decide if a PNG file is still shared by other snapshots
SnapshotSchema.index({ filename: 1 }, { name: 'snapshot_filename_idx' });

SnapshotSchema.plugin(toJSON);
SnapshotSchema.plugin(paginate);

const Snapshot: Model<SnapshotDocument> = mongoose.model<SnapshotDocument>('VRSSnapshot', SnapshotSchema);

export default Snapshot as PluginExtededModel<SnapshotDocument>;
