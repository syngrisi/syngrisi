import mongoose, { Schema, Document, Model } from 'mongoose';
import { toJSON, paginate } from './plugins';
import { PluginExtededModel } from './plugins/utils';

export interface AppDocument extends Document {
    name: string;
    description?: string;
    version?: string;
    updatedDate?: Date;
    createdDate?: Date;
    meta?: Record<string, unknown>;
    triageEnabled?: boolean; // per-project AI Triage switch; off by default
    triagePolicy?: {
        policy: 'suggest' | 'auto';
        autoAcceptThreshold: number; // 0..10
        autoAcceptVerdicts: string[];
    };
    triageVerdicts?: Array<{
        key: string;
        label: string;
        color: string;
        icon?: string;
        severity: number;
        autoAcceptable: boolean;
        neverAutoAccept?: boolean;
        isFallback?: boolean;
        description?: string;
    }>;
    triagePrompt?: string; // full system-prompt override (empty → default built from verdicts)
    triageExamples?: Array<{ verdict: string; image: string; note?: string }>; // few-shot examples (data-URL images)
    changeSimGate?: number; // cosine cutoff for "same change at other resolutions" (per-project)
    mainBranch?: string; // read-time baseline fallback: branch whose accepted baselines cover every other branch; empty = disabled
    branchFallbackEnabled?: boolean; // explicit opt-in for the mainBranch fallback; default false
    retentionDays?: number; // per-project auto-delete: remove checks older than this many days
    retentionEnabled?: boolean; // explicit opt-in for per-project retention; default false
}

const AppSchema: Schema<AppDocument> = new Schema({
    name: {
        type: String,
        default: 'Others',
        unique: true,
        required: [true, 'AppSchema: The "name" field must be required'],
    },
    description: {
        type: String,
    },
    version: {
        type: String,
    },
    updatedDate: {
        type: Date,
    },
    createdDate: {
        type: Date,
    },
    meta: {
        type: Object,
    },
    triageEnabled: {
        type: Boolean,
        default: false,
    },
    triagePolicy: {
        type: {
            policy: { type: String, enum: ['suggest', 'auto'], default: 'suggest' },
            autoAcceptThreshold: { type: Number, min: 0, max: 10, default: 9 },
            autoAcceptVerdicts: { type: [String], default: ['intended_change', 'noise'] },
        },
        _id: false,
        default: undefined,
    },
    triageVerdicts: {
        type: [{
            key: String,
            label: String,
            color: String,
            icon: String,
            severity: Number,
            autoAcceptable: Boolean,
            neverAutoAccept: Boolean,
            isFallback: Boolean,
            description: String,
            _id: false,
        }],
        default: undefined,
    },
    triagePrompt: {
        type: String,
    },
    // ponytail: few-shot example images stored as data URLs inline (fine for a handful;
    // move to file/GridFS storage if projects accumulate many large examples).
    triageExamples: {
        type: [{
            verdict: String,
            image: String,
            note: String,
            _id: false,
        }],
        default: undefined,
    },
    changeSimGate: {
        type: Number,
    },
    mainBranch: {
        type: String,
    },
    branchFallbackEnabled: {
        type: Boolean,
        default: false,
    },
    retentionDays: {
        type: Number,
    },
    retentionEnabled: {
        type: Boolean,
        default: false,
    },
});

AppSchema.plugin(paginate);
AppSchema.plugin(toJSON);

const App: Model<AppDocument> = mongoose.model<AppDocument>('VRSApp', AppSchema);
export default App as PluginExtededModel<AppDocument>;
