import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeResult } from '../prompt';

test('parses valid JSON string', () => {
    const r = normalizeResult('{"verdict":"noise","confidence":8,"reason":"aliasing"}', 'm');
    assert.deepEqual(r, { verdict: 'noise', confidence: 8, reason: 'aliasing', model: 'm' });
});

test('extracts JSON from surrounding text / code fences', () => {
    const r = normalizeResult('```json\n{"verdict":"likely_bug","confidence":6,"reason":"layout"}\n```', 'm');
    assert.equal(r.verdict, 'likely_bug');
    assert.equal(r.confidence, 6);
});

test('coerces unknown verdict to uncertain', () => {
    assert.equal(normalizeResult('{"verdict":"totally_broken","confidence":9,"reason":"x"}', 'm').verdict, 'uncertain');
});

test('clamps and rounds confidence to 0..10 integer', () => {
    assert.equal(normalizeResult('{"verdict":"noise","confidence":99,"reason":"x"}', 'm').confidence, 10);
    assert.equal(normalizeResult('{"verdict":"noise","confidence":-5,"reason":"x"}', 'm').confidence, 0);
    assert.equal(normalizeResult('{"verdict":"noise","confidence":7.6,"reason":"x"}', 'm').confidence, 8);
});

test('falls back to uncertain on garbage', () => {
    const r = normalizeResult('not json at all', 'm');
    assert.equal(r.verdict, 'uncertain');
    assert.equal(r.confidence, 0);
});

test('accepts an already-parsed object', () => {
    assert.equal(normalizeResult({ verdict: 'intended_change', confidence: 5, reason: 'new button' }, 'm').verdict, 'intended_change');
});
