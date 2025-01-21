/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface CleanupOptions {
    days: number;
    remove: boolean;
    batchSize?: number;
}

export interface CleanupStats {
    checksRemoved: number;
    snapshotsRemoved: number;
    filesRemoved: number;
    errors: string[];
}

export interface SnapshotIds {
    baselineIds: Types.ObjectId[];
    actualSnapshotIds: Types.ObjectId[];
    diffIds: Types.ObjectId[];
}

export interface CleanupProgress {
    stage: string;
    message: string;
    progress?: number;
    error?: string;
}
