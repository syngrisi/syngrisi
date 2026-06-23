import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoAccept } from '../policy';
import { DEFAULT_VERDICTS } from '../verdicts';

const V = DEFAULT_VERDICTS;
const auto = { policy: 'auto' as const, autoAcceptThreshold: 9, autoAcceptVerdicts: ['intended_change', 'noise'] };

test('accepts allowed verdict at/above threshold', () => {
    assert.equal(shouldAutoAccept(auto, 'noise', 9, V), true);
    assert.equal(shouldAutoAccept(auto, 'intended_change', 10, V), true);
});

test('rejects below threshold', () => {
    assert.equal(shouldAutoAccept(auto, 'intended_change', 7, V), false);
});

test('never auto-accepts likely_bug or uncertain even if listed (hard safety flag)', () => {
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['likely_bug'] }, 'likely_bug', 10, V), false);
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['uncertain'] }, 'uncertain', 10, V), false);
});

test('rejects verdict not in allowlist', () => {
    assert.equal(shouldAutoAccept({ ...auto, autoAcceptVerdicts: ['noise'] }, 'intended_change', 10, V), false);
});

test('does nothing in suggest mode or with no policy', () => {
    assert.equal(shouldAutoAccept({ ...auto, policy: 'suggest' }, 'noise', 10, V), false);
    assert.equal(shouldAutoAccept(undefined, 'noise', 10, V), false);
});

test('honors a custom verdict set (custom key auto-accepts; custom never-accept blocked)', () => {
    const custom = [
        { key: 'safe', label: 'Safe', color: 'green', severity: 1, autoAcceptable: true },
        { key: 'danger', label: 'Danger', color: 'red', severity: 5, autoAcceptable: false, neverAutoAccept: true },
    ];
    const pol = { policy: 'auto' as const, autoAcceptThreshold: 8, autoAcceptVerdicts: ['safe', 'danger'] };
    assert.equal(shouldAutoAccept(pol, 'safe', 9, custom), true);
    assert.equal(shouldAutoAccept(pol, 'danger', 10, custom), false);
});
