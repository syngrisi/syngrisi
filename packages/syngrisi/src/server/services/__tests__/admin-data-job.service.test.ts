import { test } from 'node:test';
import assert from 'node:assert/strict';
import { claimJobSlot, runRestoreWithSafetyBackup } from '../admin-data-job.service';
import type { JobAdmissionGate } from '../admin-data-job.service';

// --- Job admission gate (Problem B) --------------------------------------
//
// `claimJobSlot` wraps a `JobAdmissionGate` with the existing error shape.
// The gate itself is what must be atomic (in production, a MongoDB
// `findOneAndUpdate`/`insertOne` on a single locked document); here we use a
// simple in-memory counting semaphore, which is trivially atomic because
// Node.js is single-threaded and `tryClaim`/`release` never `await` inside
// their own critical section. These tests prove `claimJobSlot` introduces no
// additional race between the claim and the rejection it raises, and that
// release-then-reclaim works — the same contract the real Mongo-backed gate
// must uphold.
function createFakeGate(max = 1): JobAdmissionGate {
    let count = 0;
    return {
        async tryClaim() {
            if (count >= max) return false;
            count += 1;
            return true;
        },
        async release() {
            if (count > 0) count -= 1;
        },
    };
}

test('second concurrent restore claim is rejected', async () => {
    const gate = createFakeGate(1);
    const getBlockingJobId = async () => 'job-1';

    const results = await Promise.allSettled([
        claimJobSlot(gate, getBlockingJobId),
        claimJobSlot(gate, getBlockingJobId),
    ]);

    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');

    assert.equal(fulfilled.length, 1, 'exactly one claim should be accepted');
    assert.equal(rejected.length, 1, 'exactly one claim should be rejected');

    const rejection = rejected[0] as PromiseRejectedResult;
    assert.match(rejection.reason.message, /Another data job is already active: job-1/);
});

test('a claim is accepted again after the previous one is released', async () => {
    const gate = createFakeGate(1);

    await claimJobSlot(gate, async () => 'job-1');
    await assert.rejects(
        () => claimJobSlot(gate, async () => 'job-1'),
        /Another data job is already active: job-1/,
    );

    await gate.release();

    await assert.doesNotReject(() => claimJobSlot(gate, async () => 'job-2'));
});

test('claim is rejected with "unknown" when no blocking job id is available', async () => {
    const gate = createFakeGate(1);
    await claimJobSlot(gate, async () => undefined);

    await assert.rejects(
        () => claimJobSlot(gate, async () => undefined),
        /Another data job is already active: unknown/,
    );
});

// --- Restore safety backup + rollback (Problem A) ------------------------
//
// `runRestoreWithSafetyBackup` is the pure orchestration extracted from
// `runDbRestore`: create a safety backup, attempt drop+import, and on ANY
// failure roll back from the safety backup before re-throwing. These tests
// exercise it directly with fakes so the recovery contract is verified
// without a live MongoDB.

test('restore failure after drop is recoverable: safety backup is restored and the error propagates', async () => {
    const calls: string[] = [];

    await assert.rejects(
        () => runRestoreWithSafetyBackup({
            createSafetyBackup: async () => { calls.push('backup'); },
            performDropAndImport: async () => {
                calls.push('drop-import');
                throw new Error('Invalid BSON document size -1 in checks');
            },
            restoreFromSafetyBackup: async () => { calls.push('recover'); },
        }),
        /Invalid BSON document size -1 in checks/,
    );

    assert.deepEqual(calls, ['backup', 'drop-import', 'recover']);
});

test('restore recovers even when the failure after drop is a cancellation', async () => {
    const calls: string[] = [];

    await assert.rejects(
        () => runRestoreWithSafetyBackup({
            createSafetyBackup: async () => { calls.push('backup'); },
            performDropAndImport: async () => {
                calls.push('drop-import');
                throw new Error('Job cancelled');
            },
            restoreFromSafetyBackup: async () => { calls.push('recover'); },
        }),
        /Job cancelled/,
    );

    assert.deepEqual(calls, ['backup', 'drop-import', 'recover'], 'cancellation must trigger recovery just like any other failure');
});

test('restore recovers on an index-recreation failure after drop', async () => {
    const calls: string[] = [];

    await assert.rejects(
        () => runRestoreWithSafetyBackup({
            createSafetyBackup: async () => { calls.push('backup'); },
            performDropAndImport: async () => {
                calls.push('drop-import');
                throw new Error('createIndexes failed: bad index definition');
            },
            restoreFromSafetyBackup: async () => { calls.push('recover'); },
        }),
        /createIndexes failed/,
    );

    assert.deepEqual(calls, ['backup', 'drop-import', 'recover']);
});

test('happy path: a clean restore does not trigger recovery and the safety backup step is the only overhead', async () => {
    const calls: string[] = [];

    await runRestoreWithSafetyBackup({
        createSafetyBackup: async () => { calls.push('backup'); },
        performDropAndImport: async () => { calls.push('drop-import'); },
        restoreFromSafetyBackup: async () => { calls.push('recover'); },
    });

    assert.deepEqual(calls, ['backup', 'drop-import']);
});

test('a failure while creating the safety backup itself skips drop/import and recovery', async () => {
    const calls: string[] = [];

    await assert.rejects(
        () => runRestoreWithSafetyBackup({
            createSafetyBackup: async () => { calls.push('backup'); throw new Error('disk full'); },
            performDropAndImport: async () => { calls.push('drop-import'); },
            restoreFromSafetyBackup: async () => { calls.push('recover'); },
        }),
        /disk full/,
    );

    assert.deepEqual(calls, ['backup'], 'nothing was dropped yet, so no recovery should be attempted');
});
