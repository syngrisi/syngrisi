const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const RunSchema = new Schema({
    name: {
        type: String,
        required: 'RunSchema: the run name cannot be empty',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'VRSApp',
        required: 'RunSchema: the app field is empty',
    },
    ident: {
        type: String,
        unique: true,
        required: 'RunSchema: the run ident run cannot be empty',
    },
    description: {
        type: String,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    createdDate: {
        type: Date,
    },
    parameters: {
        type: [String],
    },
    meta: {
        type: Object,
    },
});

RunSchema.plugin(paginate);
RunSchema.plugin(toJSON);

const Run = mongoose.model('VRSRun', RunSchema);
module.exports = Run;
