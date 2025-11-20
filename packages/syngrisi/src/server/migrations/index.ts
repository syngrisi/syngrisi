import { ensureBaselineUniqueness } from './2025-11-ensure-baseline-uniqueness';
import type { Migration } from '../lib/migrations/types';

export const migrations: Migration[] = [
    ensureBaselineUniqueness,
];

export default migrations;
