process.env.SYNGRISI_TEST_MODE = 'true';

import { test, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import mongoose, { Types } from 'mongoose';
import { runMigrations } from '../../lib/migrations';
import type { Migration } from '../../lib/migrations/types';
import { ensureBaselineUniqueness } from '../2025-11-ensure-baseline-uniqueness';
import Baseline from '../../models/Baseline.model';

const dbUri = process.env.SYNGRISI_DB_URI || 'mongodb://127.0.0.1:27017/SyngrisiMigrationTest';

before(async () => {
    await mongoose.connect(dbUri);
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.collection('migrations').deleteMany({});
});

after(async () => {
    await mongoose.connection.close(true);
    await mongoose.disconnect();
    setImmediate(() => process.exit(0));
});

test('runs pending migrations once and records progress', async () => {
    let counter = 0;
    const fakeMigrations: Migration[] = [
        { name: '0001-test-migration', up: async () => { counter += 1; } },
        { name: '0002-test-migration', up: async () => { counter += 1; } },
    ];

    await runMigrations(fakeMigrations);
    assert.equal(counter, 2);

    // second run should be a no-op because of the recorded migrations
    await runMigrations(fakeMigrations);
    assert.equal(counter, 2);

    const applied = await mongoose.connection.collection('migrations').find({}, { projection: { name: 1 } }).toArray();
    assert.deepEqual(applied.map((m) => m.name).sort(), ['0001-test-migration', '0002-test-migration']);
});

test('baseline migration removes duplicates and keeps the newest record', async () => {
    const sharedFields = {
        name: 'dup-baseline',
        app: new Types.ObjectId(),
        branch: 'main',
        browserName: 'chromium',
        viewport: '1280x720',
        os: 'darwin',
        snapshootId: new Types.ObjectId(),
        markedAs: 'accepted',
        markedById: new Types.ObjectId(),
        markedByUsername: 'tester',
        lastMarkedDate: new Date('2023-01-01'),
        createdDate: new Date('2023-01-01'),
    };

    const older = await Baseline.create({
        ...sharedFields,
        lastMarkedDate: new Date('2023-01-01'),
        createdDate: new Date('2023-01-01'),
    });

    const newest = await Baseline.create({
        ...sharedFields,
        lastMarkedDate: new Date('2024-05-01'),
        createdDate: new Date('2024-05-01'),
    });

    await runMigrations([ensureBaselineUniqueness]);

    const baselines = await Baseline.find({
        name: sharedFields.name,
        app: sharedFields.app,
        snapshootId: sharedFields.snapshootId,
    });

    assert.equal(baselines.length, 1);
    assert.equal(baselines[0]._id.toString(), newest._id.toString());
});
