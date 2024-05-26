/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';

interface LogDocument extends Document {
    timestamp?: Date;
    level?: string;
    message?: string;
    meta?: any;
    hostname?: any;
}

const LogSchema: Schema<LogDocument> = new Schema({
    timestamp: {
        type: Date,
    },
    level: {
        type: String,
    },
    message: {
        type: String,
    },
    meta: {
        type: Object,
    },
    hostname: {
        type: Object,
    },
});

LogSchema.plugin(toJSON);
LogSchema.plugin(paginate);

const Log: Model<LogDocument> = mongoose.model<LogDocument>('VRSLog', LogSchema);
export default Log;
