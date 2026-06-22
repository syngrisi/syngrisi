import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoAccept } from '../policy';

const auto = { policy: 'auto' as const, autoAcceptThreshold: 9, autoAcceptVerdicts: ['intended_change', 'noise'] };

test('accepts allowed verdict at/above threshold', () => {
    assert.equal(shouldAutoAccept(auto, 'noise', 9), true);
    assert.equal(shouldAutoAccept(auto, 'intended_change', 10), true);
});

test('rejects below threshold', () => {
    assert.equal(shouldAutoAccept(auto, 'intended_change', 7), false);
});

test('never auto-accepts likely_bug or uncertain even if listed', () => {
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['likely_bug'] }, 'likely_bug', 10), false);
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['uncertain'] }, 'uncertain', 10), false);
});

test('rejects verdict not in allowlist', () => {
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['noise'] }, 'intended_change', 10), false);
});

test('does nothing in suggest mode or with no policy', () => {
    assert.equal(shouldAutoAccept({ ...auto, policy: 'suggest' }, 'noise', 10), false);
    assert.equal(shouldAutoAccept(undefined, 'noise', 10), false);
});
