import { ensureBaselineUniqueness } from './2025-11-ensure-baseline-uniqueness';
import { ensureRetentionSnapshotIndexes } from './2026-07-ensure-retention-snapshot-indexes';
import type { Migration } from '../lib/migrations/types';

export const migrations: Migration[] = [
    ensureBaselineUniqueness,
    ensureRetentionSnapshotIndexes,
];

export default migrations;
