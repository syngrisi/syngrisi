import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { removeSnapshotFile } from '../snapshot.service';

const makeSnapshot = (filename = 'abc.png') => {
    const _id = new Types.ObjectId();
    return { _id, filename } as any;
};

test('removeSnapshotFile unlinks the file when it is the last reference', async () => {
    const snapshot = makeSnapshot();
    const unlinkedPaths: string[] = [];
    await removeSnapshotFile(snapshot, {
        SnapshotModel: { find: async () => [] } as any,
        unlink: (async (p: string) => { unlinkedPaths.push(p); }) as any,
    });
    assert.equal(unlinkedPaths.length, 1, 'expected unlink to be called exactly once');
    assert.ok(unlinkedPaths[0].endsWith('abc.png'));
});

test('removeSnapshotFile does NOT unlink when another snapshot shares the filename', async () => {
    const snapshot = makeSnapshot();
    let called = false;
    await removeSnapshotFile(snapshot, {
        SnapshotModel: { find: async () => [{ _id: new Types.ObjectId() }] } as any,
        unlink: (async () => { called = true; }) as any,
    });
    assert.equal(called, false);
});

test('removeSnapshotFile excludes the current snapshot from the reference query', async () => {
    const snapshot = makeSnapshot();
    let capturedFilter: any = null;
    await removeSnapshotFile(snapshot, {
        SnapshotModel: { find: async (filter: any) => { capturedFilter = filter; return []; } } as any,
        unlink: (async () => {}) as any,
    });
    assert.equal(capturedFilter.filename, 'abc.png');
    assert.equal(String(capturedFilter._id.$ne), String(snapshot._id));
});
