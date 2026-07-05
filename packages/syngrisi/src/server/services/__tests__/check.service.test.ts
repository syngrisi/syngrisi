import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { collectCheckSnapshotIds } from '../check.service';

test('collectCheckSnapshotIds includes actual and diff when baselineId is absent', () => {
    const actualId = new Types.ObjectId();
    const diffId = new Types.ObjectId();
    const ids = collectCheckSnapshotIds({ actualSnapshotId: actualId, diffId } as any);
    assert.deepEqual(ids, [actualId.toString(), diffId.toString()]);
});

test('collectCheckSnapshotIds includes all three in baseline/actual/diff order', () => {
    const baselineId = new Types.ObjectId();
    const actualId = new Types.ObjectId();
    const diffId = new Types.ObjectId();
    const ids = collectCheckSnapshotIds({ baselineId, actualSnapshotId: actualId, diffId } as any);
    assert.deepEqual(ids, [baselineId.toString(), actualId.toString(), diffId.toString()]);
});

test('collectCheckSnapshotIds returns empty when no snapshot ids are present', () => {
    assert.deepEqual(collectCheckSnapshotIds({} as any), []);
});
