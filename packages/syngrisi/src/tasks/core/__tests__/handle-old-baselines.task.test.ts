import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import {
    collectReferencedSnapshotIds,
    handleOldBaselinesTask,
} from '../handle-old-baselines.task';
import { MockOutputWriter } from '@/tasks/lib/output-writer';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

test('collectReferencedSnapshotIds batches distinct across Baseline and Check fields', async () => {
    const a = new Types.ObjectId();
    const b = new Types.ObjectId();
    const c = new Types.ObjectId();
    const d = new Types.ObjectId();

    const distinctCalls: Array<{ model: string; field: string; ids: string[] }> = [];

    const BaselineModel = {
        distinct: async (field: string, filter: any) => {
            const ids = (filter[field].$in as Types.ObjectId[]).map((id) => id.toString());
            distinctCalls.push({ model: 'baseline', field, ids });
            // only `a` still referenced by a baseline
            return ids.includes(a.toString()) ? [a] : [];
        },
    } as any;

    const CheckModel = {
        distinct: async (field: string, filter: any) => {
            const ids = (filter[field].$in as Types.ObjectId[]).map((id) => id.toString());
            distinctCalls.push({ model: 'check', field, ids });
            if (field === 'baselineId' && ids.includes(b.toString())) return [b];
            if (field === 'actualSnapshotId' && ids.includes(c.toString())) return [c];
            if (field === 'diffId') return [];
            return [];
        },
    } as any;

    const referenced = await collectReferencedSnapshotIds(
        [a.toString(), b.toString(), c.toString(), d.toString()],
        CheckModel,
        BaselineModel,
        2, // force two batches
    );

    assert.equal(referenced.has(a.toString()), true);
    assert.equal(referenced.has(b.toString()), true);
    assert.equal(referenced.has(c.toString()), true);
    assert.equal(referenced.has(d.toString()), false);

    // 2 batches × (1 baseline + 3 check) = 8 distinct calls
    assert.equal(distinctCalls.length, 8);
});

test('collectReferencedSnapshotIds treats invalid ids as referenced', async () => {
    const referenced = await collectReferencedSnapshotIds(
        ['not-an-object-id'],
        { distinct: async () => [] } as any,
        { distinct: async () => [] } as any,
        500,
    );
    assert.equal(referenced.has('not-an-object-id'), true);
});

test('handleOldBaselinesTask remove path deletes baselines then only unreferenced snapshots', async () => {
    const keptSnap = new Types.ObjectId();
    const freeSnap = new Types.ObjectId();
    const identity = {
        name: 'Login',
        app: new Types.ObjectId(),
        branch: 'main',
        browserName: 'chrome',
        viewport: '1280x720',
        os: 'mac',
    };

    // rank 0 kept (newest), rank 1+ removable when keepLast=1 and both old enough
    const baselines = [
        {
            _id: new Types.ObjectId(),
            ...identity,
            snapshootId: keptSnap,
            createdDate: daysAgo(200),
            markedAs: 'accepted',
        },
        {
            _id: new Types.ObjectId(),
            ...identity,
            snapshootId: freeSnap,
            createdDate: daysAgo(250),
            markedAs: 'accepted',
        },
    ];

    let remaining = [...baselines];
    const removedSnapshots: string[] = [];
    let distinctFilterSnapIds: string[] = [];

    const BaselineModel = {
        countDocuments: async () => remaining.length,
        find: () => ({
            lean: () => ({
                exec: async () => remaining,
            }),
        }),
        deleteMany: async ({ _id }: any) => {
            const ids = new Set((_id.$in as Types.ObjectId[]).map((id) => id.toString()));
            const before = remaining.length;
            remaining = remaining.filter((b) => !ids.has(b._id.toString()));
            return { deletedCount: before - remaining.length };
        },
        distinct: async (_field: string, filter: any) => {
            distinctFilterSnapIds = (filter.snapshootId.$in as Types.ObjectId[])
                .map((id) => id.toString());
            // keptSnap still referenced by remaining (newer) baseline
            return remaining
                .map((b) => b.snapshootId)
                .filter((id) => distinctFilterSnapIds.includes(id.toString()));
        },
    } as any;

    const CheckModel = {
        distinct: async () => [],
    } as any;

    const output = new MockOutputWriter();
    const result = await handleOldBaselinesTask(
        { days: 120, keepLast: 1, remove: true, batchSize: 50 },
        output,
        {
            BaselineModel,
            CheckModel,
            removeSnapshotFn: async (id: string) => {
                removedSnapshots.push(id);
            },
        },
    );

    assert.equal(result.removed, 1);
    assert.deepEqual(removedSnapshots, [freeSnap.toString()]);
    assert.match(output.getOutput(), /unreferenced snapshots to remove: 1/);
    assert.match(output.getOutput(), /snapshots removed \(unreferenced\): 1/);
});
