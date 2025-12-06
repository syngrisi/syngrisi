import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { handleOrphanBaselinesTask } from '../handle-orphan-baselines.task';
import { MockOutputWriter } from '@/tasks/lib/output-writer';

const makeBaseline = (id: string, snap: Types.ObjectId, name?: string) => ({
    _id: new Types.ObjectId(id),
    snapshootId: snap,
    name,
});

test('handleOrphanBaselinesTask reports orphans in dry run', async () => {
    const usedSnap = new Types.ObjectId();
    const orphanSnap = new Types.ObjectId();
    const orphanSnap2 = new Types.ObjectId();

    const baselines = [
        makeBaseline('656dd9e1a9f9dcd4a0c1beef', usedSnap, 'kept'),
        makeBaseline('656dd9e1a9f9dcd4a0c1be00', orphanSnap, 'orphan-1'),
        makeBaseline('656dd9e1a9f9dcd4a0c1be01', orphanSnap2, 'orphan-2'),
    ];

    const output = new MockOutputWriter();
    await handleOrphanBaselinesTask(
        { dryRun: true },
        output,
        {
            BaselineModel: {
                countDocuments: async () => baselines.length,
                find: () => ({
                    lean: () => ({
                        exec: async () => baselines,
                    }),
                }),
            } as any,
            CheckModel: {
                distinct: async () => [usedSnap],
            } as any,
        },
    );

    const out = output.getOutput();
    assert.match(out, /orphan baselines found: 2/);
    assert.match(out, /dry run mode/);
});

test('handleOrphanBaselinesTask removes orphans when execute', async () => {
    const usedSnap = new Types.ObjectId();
    const orphanSnap = new Types.ObjectId();
    let baselines = [
        makeBaseline('656dd9e1a9f9dcd4a0c1beef', usedSnap, 'kept'),
        makeBaseline('656dd9e1a9f9dcd4a0c1be00', orphanSnap, 'orphan-1'),
    ];

    const output = new MockOutputWriter();
    await handleOrphanBaselinesTask(
        { dryRun: false, batchSize: 1 },
        output,
        {
            BaselineModel: {
                countDocuments: async () => baselines.length,
                find: () => ({
                    lean: () => ({
                        exec: async () => baselines,
                    }),
                }),
                deleteMany: async ({ _id }: any) => {
                    const idsToDelete: string[] = _id.$in.map((id: Types.ObjectId) => id.toString());
                    baselines = baselines.filter((b) => !idsToDelete.includes(b._id.toString()));
                },
            } as any,
            CheckModel: {
                distinct: async () => [usedSnap],
            } as any,
        },
    );

    const out = output.getOutput();
    assert.match(out, /removing orphan baselines/);
    assert.equal(baselines.length, 1);
    assert.equal(baselines[0].name, 'kept');
    assert.match(out, /remaining baselines: 1/);
});
