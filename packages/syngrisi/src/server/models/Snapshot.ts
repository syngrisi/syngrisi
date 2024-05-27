/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

export interface SnapshotDocument extends Document {
    name: { [key: string]: string | boolean | number};
    path?: string;
    filename?: string;
    imghash: { [key: string]: string | boolean | number};
    createdDate?: Date;
    vOffset?: number;
    hOffset?: number;
}

const SnapshotSchema: Schema<SnapshotDocument> = new Schema({
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

SnapshotSchema.plugin(toJSON);
SnapshotSchema.plugin(paginate);

const Snapshot: Model<SnapshotDocument> = mongoose.model<SnapshotDocument>('VRSSnapshot', SnapshotSchema);
export default Snapshot;
