import { test } from 'node:test';
import assert from 'node:assert/strict';
import deserializeIfJSON, { assertSafeMongoFilter } from '../deserializeIfJSON';

test('parses a plain JSON filter with allowed operators', () => {
    const filter = deserializeIfJSON('{"$and":[{"status":{"$in":["failed"]}},{"name":{"$regex":"home","$options":"i"}}]}');
    assert.deepEqual(filter.$and[0].status, { $in: ['failed'] });
});

test('parses Extended JSON ($oid) without treating BSON values as operators', () => {
    const filter = deserializeIfJSON('{"_id":{"$oid":"507f1f77bcf86cd799439011"}}');
    assert.equal(String(filter._id), '507f1f77bcf86cd799439011');
});

test('rejects $where', () => {
    assert.throws(() => deserializeIfJSON('{"$where":"sleep(10000)"}'), /unsupported query operator/);
});

test('rejects nested and array-buried dangerous operators', () => {
    assert.throws(() => deserializeIfJSON('{"$or":[{"a":1},{"b":{"$expr":{"$gt":["$x",1]}}}]}'), /\$expr/);
    assert.throws(() => assertSafeMongoFilter({ a: { $function: { body: 'x' } } }), /\$function/);
    assert.throws(() => assertSafeMongoFilter({ a: { $jsonSchema: {} } }), /\$jsonSchema/);
});

test('returns non-JSON strings untouched', () => {
    assert.equal(deserializeIfJSON('plain-text'), 'plain-text');
});
