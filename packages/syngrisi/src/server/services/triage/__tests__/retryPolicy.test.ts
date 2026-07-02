import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldRetryTriage, canBackgroundDrain } from '../retryPolicy';

test('maxAttempts=3: retries after the first two failures, gives up after the third', () => {
    assert.equal(shouldRetryTriage(0, 3), true); // attempt 1 failed -> 2 attempts left, retry
    assert.equal(shouldRetryTriage(1, 3), true); // attempt 2 failed -> retry
    assert.equal(shouldRetryTriage(2, 3), false); // attempt 3 failed -> exactly 3 total attempts, give up
});

test('maxAttempts=1: never retries (single attempt only)', () => {
    assert.equal(shouldRetryTriage(0, 1), false);
});

test('canBackgroundDrain: true only when both global and per-app triage are enabled', () => {
    assert.equal(canBackgroundDrain(true, true), true);
    assert.equal(canBackgroundDrain(true, false), false);
    assert.equal(canBackgroundDrain(false, true), false);
    assert.equal(canBackgroundDrain(false, false), false);
});
