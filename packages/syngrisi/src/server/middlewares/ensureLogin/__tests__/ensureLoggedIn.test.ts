import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIncomingApiKey } from '../ensureLoggedIn';

const HEX_128 = /^[a-f0-9]{128}$/;

test('normalizeIncomingApiKey: undefined -> undefined', () => {
    assert.equal(normalizeIncomingApiKey(undefined), undefined);
});

test('normalizeIncomingApiKey: null -> undefined', () => {
    assert.equal(normalizeIncomingApiKey(null), undefined);
});

test('normalizeIncomingApiKey: empty string -> undefined', () => {
    assert.equal(normalizeIncomingApiKey(''), undefined);
});

test('normalizeIncomingApiKey: whitespace-only string -> undefined', () => {
    assert.equal(normalizeIncomingApiKey('   '), undefined);
});

test('normalizeIncomingApiKey: array unwraps to its first element before processing', () => {
    const fromArray = normalizeIncomingApiKey(['k']);
    const fromString = normalizeIncomingApiKey('k');
    assert.equal(fromArray, fromString);
});

test('normalizeIncomingApiKey: an already-hashed 128-hex-char string passes through unchanged', () => {
    const alreadyHashed = 'a'.repeat(128);
    assert.equal(normalizeIncomingApiKey(alreadyHashed), alreadyHashed);
});

test('normalizeIncomingApiKey: an already-hashed uppercase 128-hex-char string passes through unchanged (case-insensitive pattern)', () => {
    const alreadyHashed = 'A'.repeat(128);
    assert.equal(normalizeIncomingApiKey(alreadyHashed), alreadyHashed);
});

test('normalizeIncomingApiKey: an arbitrary plaintext key is hashed to a 128-char lowercase-hex string, and is idempotent', () => {
    const result1 = normalizeIncomingApiKey('k');
    const result2 = normalizeIncomingApiKey('k');

    assert.match(result1!, HEX_128);
    assert.equal(result1, result2);
});
