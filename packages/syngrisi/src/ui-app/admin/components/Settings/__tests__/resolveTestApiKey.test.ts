import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTestApiKey, MASKED_API_KEY } from '../resolveTestApiKey';

test('resolveTestApiKey returns undefined for the masked placeholder', () => {
    assert.equal(resolveTestApiKey(MASKED_API_KEY), undefined);
});

test('resolveTestApiKey returns undefined for an empty string', () => {
    assert.equal(resolveTestApiKey(''), undefined);
});

test('resolveTestApiKey returns undefined for undefined input', () => {
    assert.equal(resolveTestApiKey(undefined), undefined);
});

test('resolveTestApiKey returns the real key unchanged', () => {
    assert.equal(resolveTestApiKey('sk-real-key-123'), 'sk-real-key-123');
});
