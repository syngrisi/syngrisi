import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isWithinToleranceThreshold } from '../comparison.service';

test('isWithinToleranceThreshold passes when mismatch is lower than threshold', () => {
    assert.equal(isWithinToleranceThreshold(0.5, 0.6), true);
});

test('isWithinToleranceThreshold fails when mismatch is greater than threshold', () => {
    assert.equal(isWithinToleranceThreshold(0.7, 0.6), false);
});

test('isWithinToleranceThreshold fails on zero mismatch', () => {
    assert.equal(isWithinToleranceThreshold(0, 0.6), false);
});
