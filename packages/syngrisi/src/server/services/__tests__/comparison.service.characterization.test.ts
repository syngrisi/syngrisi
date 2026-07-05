import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    ignoreDifferentResolutions,
    compareSnapshots,
    compareCheck,
} from '../comparison.service';

// --- ignoreDifferentResolutions truth table (comparison.service.ts:88-92) ---

test('ignoreDifferentResolutions returns true for {width:0,height:-1}', () => {
    assert.equal(ignoreDifferentResolutions({ width: 0, height: -1 }), true);
});

test('ignoreDifferentResolutions returns true for {width:0,height:1}', () => {
    assert.equal(ignoreDifferentResolutions({ width: 0, height: 1 }), true);
});

test('ignoreDifferentResolutions returns false for {width:0,height:2}', () => {
    assert.equal(ignoreDifferentResolutions({ width: 0, height: 2 }), false);
});

test('ignoreDifferentResolutions returns false for {width:1,height:1}', () => {
    assert.equal(ignoreDifferentResolutions({ width: 1, height: 1 }), false);
});

test('ignoreDifferentResolutions returns false for {width:0,height:0}', () => {
    assert.equal(ignoreDifferentResolutions({ width: 0, height: 0 }), false);
});

// --- compareSnapshots identical-imghash short-circuit (comparison.service.ts:40-50) ---

test('compareSnapshots returns a zeroed diff when imghash matches, without touching the filesystem', async () => {
    const baselineSnapshot = { id: 'baseline-1', imghash: 'same-hash' } as any;
    const actual = { id: 'actual-1', imghash: 'same-hash' } as any;

    const diff = await compareSnapshots(baselineSnapshot, actual);

    assert.equal(diff.isSameDimensions, true);
    assert.deepEqual(diff.dimensionDifference, { width: 0, height: 0 });
    assert.equal(diff.rawMisMatchPercentage, 0);
    assert.equal(diff.misMatchPercentage, '0.00');
    assert.equal(diff.analysisTime, 0);
    assert.equal(diff.executionTotalTime, '0');
    assert.equal(diff.getBuffer, null);
});

// --- compareCheck new-check short-circuit (comparison.service.ts:131) ---

test('compareCheck skips the compare block for status:"new" with empty failReasons', async () => {
    const expectedSnapshot = {} as any;
    const actualSnapshot = {} as any;
    const newCheckParams = { name: 'a-check', status: 'new', failReasons: [] } as any;
    const currentUser = { username: 'u' } as any;

    const result = await compareCheck(expectedSnapshot, actualSnapshot, newCheckParams, false, currentUser);

    assert.deepEqual(result.failReasons, []);
    assert.equal(result.status, undefined);
});

test('compareCheck sets status:"failed" for status:"new" with preset non-empty failReasons', async () => {
    const expectedSnapshot = {} as any;
    const actualSnapshot = {} as any;
    const newCheckParams = { name: 'a-check', status: 'new', failReasons: ['not_accepted'] } as any;
    const currentUser = { username: 'u' } as any;

    const result = await compareCheck(expectedSnapshot, actualSnapshot, newCheckParams, false, currentUser);

    assert.deepEqual(result.failReasons, ['not_accepted']);
    assert.equal(result.status, 'failed');
});
