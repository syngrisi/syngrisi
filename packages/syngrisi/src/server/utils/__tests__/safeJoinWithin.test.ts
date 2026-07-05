import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import { safeJoinWithin } from '../safeJoinWithin';

const dest = path.resolve('/tmp/syngrisi-extract-dest');

test('accepts a plain nested entry name', () => {
    assert.equal(safeJoinWithin(dest, 'collections/app.bson.gz'), path.join(dest, 'collections/app.bson.gz'));
});

test('accepts an entry that normalizes to the destination root', () => {
    assert.equal(safeJoinWithin(dest, 'a/../b.txt'), path.join(dest, 'b.txt'));
});

test('rejects a parent-traversal entry name', () => {
    assert.equal(safeJoinWithin(dest, '../evil'), null);
    assert.equal(safeJoinWithin(dest, '../../../../etc/passwd'), null);
});

test('rejects an absolute entry name', () => {
    assert.equal(safeJoinWithin(dest, '/etc/cron.d/evil'), null);
});

test('rejects an empty entry name', () => {
    assert.equal(safeJoinWithin(dest, ''), null);
});

test('rejects a sibling-prefix escape (dest name is a prefix of sibling)', () => {
    // ensures we compare on a path separator, not raw string prefix
    assert.equal(safeJoinWithin(dest, '../syngrisi-extract-dest-evil/x'), null);
});
