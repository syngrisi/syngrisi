import mongoose from 'mongoose';
import log from '../logger';
import { migrations as bundledMigrations } from '../../migrations';
import type { Migration } from './types';

const MIGRATIONS_COLLECTION = 'migrations';

const getCollection = () => mongoose.connection.collection(MIGRATIONS_COLLECTION);

const readAppliedMigrationNames = async (): Promise<Set<string>> => {
    const collection = getCollection();
    await collection.createIndex({ name: 1 }, { unique: true });
    const items = await collection.find({}, { projection: { name: 1, _id: 0 } }).toArray();
    return new Set(items.map((item) => item.name));
};

const markMigrationApplied = async (name: string) => {
    const collection = getCollection();
    await collection.insertOne({ name, appliedAt: new Date() });
};

export const runMigrations = async (
    customMigrations?: Migration[],
): Promise<void> => {
    const migrations = customMigrations || bundledMigrations;
    if (!mongoose.connection.readyState) {
        throw new Error('Cannot run migrations, mongoose connection is not ready');
    }

    // Skip migrations for fresh test databases (optimization for E2E tests)
    // Fresh DBs don't need migrations and checking them adds overhead
    const isTestDb = mongoose.connection.name?.includes('Test');
    if (isTestDb && process.env.SYNGRISI_TEST_MODE === 'true') {
        // Quick check: if no collections exist, skip migrations entirely
        const collections = await mongoose.connection.db?.listCollections().toArray();
        if (!collections || collections.length === 0) {
            log.debug('Skipping migrations for fresh test database', { scope: 'migration' });
            return;
        }
    }

    const applied = await readAppliedMigrationNames();

    for (const migration of migrations) {
        if (applied.has(migration.name)) {
            log.debug(`migration '${migration.name}' already applied, skipping`, { scope: 'migration' });
            continue;
        }

        log.info(`running migration '${migration.name}'`, { scope: 'migration' });
        await migration.up({ connection: mongoose.connection });
        await markMigrationApplied(migration.name);
        log.info(`migration '${migration.name}' completed`, { scope: 'migration' });
    }
};
