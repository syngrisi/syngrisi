import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChecksFilter } from '../ai.controller';

const NAME_MAX = 200;

test('an object-shaped param carrying a Mongo operator key is not passed through for `status`', () => {
    const maliciousStatus = { $ne: 'failed' };
    const filter = buildChecksFilter({ status: maliciousStatus as unknown });
    assert.ok(
        filter.status === undefined || typeof filter.status === 'string',
        'filter.status must be absent or a plain string, never an operator object',
    );
});

test('an object-shaped param carrying a Mongo operator key is not passed through for `run`', () => {
    const maliciousRun = { $gt: '' };
    const filter = buildChecksFilter({ run: maliciousRun as unknown });
    assert.ok(
        filter.run === undefined || typeof filter.run === 'string',
        'filter.run must be absent or a plain string, never an operator object',
    );
});

test('an object-shaped param carrying a Mongo operator key is not passed through for `app`', () => {
    const maliciousApp = { $where: 'sleep(10000)' };
    const filter = buildChecksFilter({ app: maliciousApp as unknown });
    assert.ok(
        filter.app === undefined || typeof filter.app === 'string',
        'filter.app must be absent or a plain string, never an operator object',
    );
});

test('name regex metacharacters are escaped', () => {
    const raw = 'a.b*c(d)';
    const filter = buildChecksFilter({ name: raw });
    const nameFilter = filter.name as { $regex: string; $options: string };
    assert.notEqual(nameFilter.$regex, raw);
    assert.ok(nameFilter.$regex.includes('\\.'));
    assert.ok(nameFilter.$regex.includes('\\*'));
    assert.ok(nameFilter.$regex.includes('\\('));
});

test('name regex is length-bounded', () => {
    const longName = 'a'.repeat(NAME_MAX * 2);
    const filter = buildChecksFilter({ name: longName });
    const nameFilter = filter.name as { $regex: string; $options: string };
    assert.ok(nameFilter.$regex.length <= NAME_MAX);
});

test('name at the length boundary of metacharacters yields a valid regex (no dangling backslash)', () => {
    const f = buildChecksFilter({ name: '.'.repeat(NAME_MAX) });
    const rx = (f.name as { $regex: string }).$regex;
    assert.doesNotThrow(() => new RegExp(rx));
    assert.ok(!/(^|[^\\])\\$/.test(rx), 'regex must not end with a lone (unescaped) backslash');
});

test('happy path: status is preserved as a plain string', () => {
    const filter = buildChecksFilter({ status: 'failed' });
    assert.equal(filter.status, 'failed');
});

test('happy path: name produces the expected literal regex filter', () => {
    const filter = buildChecksFilter({ name: 'Login' });
    assert.deepEqual(filter.name, { $regex: 'Login', $options: 'i' });
});

test('happy path: hasDiff=true produces the expected diffId existence filter', () => {
    const filter = buildChecksFilter({ hasDiff: 'true' });
    assert.deepEqual(filter.diffId, { $exists: true, $ne: null });
});
