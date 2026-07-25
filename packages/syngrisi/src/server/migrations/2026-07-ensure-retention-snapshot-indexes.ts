import Baseline from '../models/Baseline.model';
import Check from '../models/Check.model';
import Snapshot from '../models/Snapshot.model';
import type { Migration } from '../lib/migrations/types';

/**
 * Indexes required for old-baselines / old-checks retention cleanup.
 * Without these, per-snapshot reference checks degrade to full collection scans.
 */
export const ensureRetentionSnapshotIndexes: Migration = {
    name: '2026-07-ensure-retention-snapshot-indexes',
    up: async () => {
        // Baseline has autoIndex:false — must create explicitly
        await Baseline.collection.createIndex(
            { snapshootId: 1 },
            { name: 'baseline_snapshootId_idx' },
        );

        await Check.collection.createIndex(
            { baselineId: 1 },
            { name: 'check_baselineId_idx' },
        );
        await Check.collection.createIndex(
            { actualSnapshotId: 1 },
            { name: 'check_actualSnapshotId_idx' },
        );
        await Check.collection.createIndex(
            { diffId: 1 },
            { name: 'check_diffId_idx' },
        );

        await Snapshot.collection.createIndex(
            { filename: 1 },
            { name: 'snapshot_filename_idx' },
        );
    },
};
