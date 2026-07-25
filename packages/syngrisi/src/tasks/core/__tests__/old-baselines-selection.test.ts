import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    effectiveKeepLast,
    selectOldBaselinesForRemoval,
    SelectableBaseline,
} from '../old-baselines-selection';

const now = new Date('2026-07-25T12:00:00.000Z');
const day = 24 * 60 * 60 * 1000;

function daysAgo(n: number): Date {
    return new Date(now.getTime() - n * day);
}

function bl(
    id: string,
    createdDaysAgo: number,
    identity: Partial<SelectableBaseline> = {},
): SelectableBaseline {
    return {
        _id: id,
        createdDate: daysAgo(createdDaysAgo),
        snapshootId: `snap-${id}`,
        name: identity.name ?? 'check-a',
        app: identity.app ?? 'app1',
        branch: identity.branch ?? 'main',
        browserName: identity.browserName ?? 'chrome',
        viewport: identity.viewport ?? '800x600',
        os: identity.os ?? 'linux',
        ...identity,
    };
}

test('effectiveKeepLast clamps to at least 1', () => {
    assert.equal(effectiveKeepLast(5), 5);
    assert.equal(effectiveKeepLast(1), 1);
    assert.equal(effectiveKeepLast(0), 1);
    assert.equal(effectiveKeepLast(-3), 1);
    assert.equal(effectiveKeepLast(Number.NaN), 1);
});

test('never deletes the newest baseline even when keepLast is 0 and age exceeds days', () => {
    const baselines = [
        bl('newest', 200),
        bl('old2', 210),
        bl('old3', 220),
    ];
    const removable = selectOldBaselinesForRemoval(baselines, { days: 120, keepLast: 0, now });
    assert.equal(removable.some((r) => r.id === 'newest'), false);
    assert.deepEqual(removable.map((r) => r.id).sort(), ['old2', 'old3'].sort());
});

test('AND rule: old but within keepLast is kept', () => {
    // 5 baselines, all older than 120d; keepLast=5 → none removable (ranks 0..4)
    const baselines = [0, 1, 2, 3, 4].map((i) => bl(`b${i}`, 150 + i));
    const removable = selectOldBaselinesForRemoval(baselines, { days: 120, keepLast: 5, now });
    assert.equal(removable.length, 0);
});

test('AND rule: beyond keepLast but young is kept', () => {
    // 6 baselines all younger than 120d; keepLast=5 → 6th is rank 5 but not old
    const baselines = [0, 1, 2, 3, 4, 5].map((i) => bl(`b${i}`, 10 + i));
    const removable = selectOldBaselinesForRemoval(baselines, { days: 120, keepLast: 5, now });
    assert.equal(removable.length, 0);
});

test('AND rule: 6th oldest beyond 120d is removed', () => {
    // newest → oldest by age: 10,20,30,40,50,150 days
    const baselines = [
        bl('r0', 10),
        bl('r1', 20),
        bl('r2', 30),
        bl('r3', 40),
        bl('r4', 50),
        bl('r5', 150),
    ];
    const removable = selectOldBaselinesForRemoval(baselines, { days: 120, keepLast: 5, now });
    assert.equal(removable.length, 1);
    assert.equal(removable[0].id, 'r5');
    assert.equal(removable[0].rank, 5);
});

test('single old baseline is never removed', () => {
    const removable = selectOldBaselinesForRemoval(
        [bl('only', 400)],
        { days: 120, keepLast: 5, now },
    );
    assert.equal(removable.length, 0);
});

test('identities are independent', () => {
    const baselines = [
        bl('a-new', 10, { name: 'A' }),
        bl('a-old', 200, { name: 'A' }),
        bl('b-only', 300, { name: 'B' }),
    ];
    // keepLast=1 → for A, rank1 old is removable; B single kept
    const removable = selectOldBaselinesForRemoval(baselines, { days: 120, keepLast: 1, now });
    assert.deepEqual(removable.map((r) => r.id), ['a-old']);
});

test('empty input yields no removals', () => {
    assert.deepEqual(selectOldBaselinesForRemoval([], { days: 120, keepLast: 5, now }), []);
});
