const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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

SnapshotSchema.plugin(toJSON);
SnapshotSchema.plugin(paginate);

const Snapshot = mongoose.model('VRSSnapshot', SnapshotSchema);
module.exports = Snapshot;
