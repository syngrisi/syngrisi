import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { Run, App } from '@models';
import {
    isBaselineValid,
    updateCheckParamsFromBaseline,
    promoteRun,
} from '../baseline.service';

// --- isBaselineValid (baseline.service.ts:59-71) ---

const REQUIRED_KEYS = [
    'name', 'app', 'branch', 'browserName', 'viewport', 'os',
    'createdDate', 'lastMarkedDate', 'markedAs', 'markedById', 'markedByUsername', 'snapshootId',
];

const makeValidBaseline = () => ({
    name: 'a-check',
    app: 'app-1',
    branch: 'main',
    browserName: 'chromium',
    viewport: '1280x720',
    os: 'darwin',
    createdDate: new Date(),
    lastMarkedDate: new Date(),
    markedAs: 'accepted',
    markedById: 'user-1',
    markedByUsername: 'u',
    snapshootId: new Types.ObjectId(),
} as any);

test('isBaselineValid returns true when every required key is present', () => {
    assert.equal(isBaselineValid(makeValidBaseline()), true);
});

for (const key of REQUIRED_KEYS) {
    test(`isBaselineValid returns false when '${key}' is missing`, () => {
        const baseline = makeValidBaseline();
        delete baseline[key];
        assert.equal(isBaselineValid(baseline), false);
    });
}

// --- updateCheckParamsFromBaseline (baseline.service.ts:73-80) ---

test('updateCheckParamsFromBaseline maps baseline fields onto a copy of params, leaving the input untouched', () => {
    const snapshotId = new Types.ObjectId();
    const lastMarkedDate = new Date('2026-01-01T00:00:00.000Z');
    const baseline = {
        snapshootId: snapshotId,
        markedAs: 'accepted',
        lastMarkedDate,
        markedByUsername: 'alice',
    } as any;
    const params = { name: 'a-check', failReasons: [] } as any;

    const updated = updateCheckParamsFromBaseline(params, baseline);

    assert.equal(updated.baselineId, snapshotId.toString());
    assert.equal(updated.markedAs, 'accepted');
    assert.equal(updated.markedDate, lastMarkedDate.toString());
    assert.equal(updated.markedByUsername, 'alice');
    // input params object is not mutated (a copy is returned)
    assert.equal((params as any).baselineId, undefined);
    assert.equal((params as any).markedAs, undefined);
    assert.notEqual(updated, params);
});

// --- promoteRun guard branches (baseline.service.ts:288-303) ---

const originalRunFindById = Run.findById;
const originalAppFindById = App.findById;

after(() => {
    Run.findById = originalRunFindById;
    App.findById = originalAppFindById;
});

test('promoteRun throws NOT_FOUND when the run does not exist', async () => {
    (Run as any).findById = () => ({ exec: async () => null });

    await assert.rejects(
        () => promoteRun({ runId: 'missing-run', user: { _id: 'u1', username: 'u' } }),
        (err: any) => {
            assert.equal(err.statusCode, 404);
            assert.match(err.message, /run not found/);
            return true;
        },
    );
});

test('promoteRun throws NOT_FOUND when the run exists but its app does not', async () => {
    (Run as any).findById = () => ({ exec: async () => ({ app: 'app-1' }) });
    (App as any).findById = () => ({ exec: async () => null });

    await assert.rejects(
        () => promoteRun({ runId: 'run-1', user: { _id: 'u1', username: 'u' } }),
        (err: any) => {
            assert.equal(err.statusCode, 404);
            assert.match(err.message, /app not found/);
            return true;
        },
    );
});

test('promoteRun throws BAD_REQUEST when the app has no mainBranch configured', async () => {
    (Run as any).findById = () => ({ exec: async () => ({ app: 'app-1' }) });
    (App as any).findById = () => ({ exec: async () => ({ id: 'app-1', mainBranch: undefined }) });

    await assert.rejects(
        () => promoteRun({ runId: 'run-1', user: { _id: 'u1', username: 'u' } }),
        (err: any) => {
            assert.equal(err.statusCode, 400);
            assert.match(err.message, /project has no main branch configured/);
            return true;
        },
    );
});
