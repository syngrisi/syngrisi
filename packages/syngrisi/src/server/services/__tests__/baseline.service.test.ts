import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildUsageCountMap } from '../baseline.service';
import { Types } from 'mongoose';

test('buildUsageCountMap builds map by stringified id', () => {
    const id1 = new Types.ObjectId();
    const id2 = new Types.ObjectId();

    const map = buildUsageCountMap([
        { _id: id1, count: 3 },
        { _id: id2, count: 0 },
    ]);

    assert.equal(map[id1.toString()], 3);
    assert.equal(map[id2.toString()], 0);
});

test('buildUsageCountMap skips empty rows', () => {
    const map = buildUsageCountMap([
        // @ts-ignore
        { _id: null, count: 5 },
        // @ts-ignore
        { count: 1 },
    ]);

    assert.deepEqual(map, {});
});
