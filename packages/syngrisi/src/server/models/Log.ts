import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

interface LogDocument extends Document {
    timestamp?: Date;
    level?: string;
    message?: string;
    meta?: Record<string, unknown>;
    hostname?: string;
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
export default Log as PluginExtededModel<LogDocument>;

