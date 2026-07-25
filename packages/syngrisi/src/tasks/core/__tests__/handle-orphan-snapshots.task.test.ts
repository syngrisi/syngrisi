import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { handleOrphanSnapshotsTask } from '../handle-orphan-snapshots.task';
import { MockOutputWriter } from '@/tasks/lib/output-writer';

test('handleOrphanSnapshotsTask dry-run reports orphans without deleting', async () => {
    const kept = new Types.ObjectId();
    const orphan = new Types.ObjectId();
    const removed: string[] = [];

    const output = new MockOutputWriter();
    const result = await handleOrphanSnapshotsTask(
        { dryRun: true },
        output,
        {
            BaselineModel: {
                aggregate: () => ({
                    exec: async () => [{ _id: kept }],
                }),
            } as any,
            CheckModel: {
                aggregate: () => ({
                    exec: async () => [],
                }),
            } as any,
            SnapshotModel: {
                countDocuments: async () => 2,
                find: () => ({
                    lean: () => ({
                        cursor: () => (async function* () {
                            yield { _id: kept };
                            yield { _id: orphan };
                        }()),
                    }),
                }),
            } as any,
            removeSnapshotFn: async (id: string) => {
                removed.push(id);
            },
        },
    );

    assert.equal(result.orphanCount, 1);
    assert.equal(result.removed, 0);
    assert.deepEqual(removed, []);
    assert.match(output.getOutput(), /orphan snapshots: 1/);
    assert.match(output.getOutput(), /dry run mode/);
});

test('handleOrphanSnapshotsTask execute removes only unreferenced snapshots', async () => {
    const keptByBaseline = new Types.ObjectId();
    const keptByCheck = new Types.ObjectId();
    const orphan = new Types.ObjectId();
    const removed: string[] = [];
    let remaining = 3;

    const output = new MockOutputWriter();
    const result = await handleOrphanSnapshotsTask(
        { dryRun: false, batchSize: 1 },
        output,
        {
            BaselineModel: {
                aggregate: () => ({
                    exec: async () => [{ _id: keptByBaseline }],
                }),
            } as any,
            CheckModel: {
                aggregate: (pipeline: any[]) => ({
                    exec: async () => {
                        const field = Object.keys(pipeline[0].$match)[0];
                        if (field === 'actualSnapshotId') {
                            return [{ _id: keptByCheck }];
                        }
                        return [];
                    },
                }),
            } as any,
            SnapshotModel: {
                countDocuments: async () => remaining,
                find: () => ({
                    lean: () => ({
                        cursor: () => (async function* () {
                            yield { _id: keptByBaseline };
                            yield { _id: keptByCheck };
                            yield { _id: orphan };
                        }()),
                    }),
                }),
            } as any,
            removeSnapshotFn: async (id: string) => {
                removed.push(id);
                remaining -= 1;
            },
        },
    );

    assert.equal(result.orphanCount, 1);
    assert.equal(result.removed, 1);
    assert.deepEqual(removed, [orphan.toString()]);
    assert.match(output.getOutput(), /snapshots removed: 1/);
});
