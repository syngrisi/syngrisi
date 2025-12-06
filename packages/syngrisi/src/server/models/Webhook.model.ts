import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface WebhookDocument extends Document {
    url: string;
    events: string[];
    secret?: string;
    createdDate?: Date;
    meta?: Record<string, unknown>;
}

const WebhookSchema: Schema<WebhookDocument> = new Schema({
    url: {
        type: String,
        required: [true, 'WebhookSchema: The "url" field must be required'],
    },
    events: {
        type: [String],
        default: ['check.updated', 'check.created'],
    },
    secret: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    meta: {
        type: Object,
    },
});

WebhookSchema.plugin(paginate);
WebhookSchema.plugin(toJSON);

const Webhook: Model<WebhookDocument> = mongoose.model<WebhookDocument>('VRSWebhook', WebhookSchema);

export default Webhook as PluginExtededModel<WebhookDocument>;
