import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { queryTests, resolveTestIdsByBaselineSnapshot } from '../test.service';

const makeCheckModel = (distinctResult: Types.ObjectId[]) => ({
    find: () => ({
        distinct: async () => distinctResult,
    }),
});

test('resolveTestIdsByBaselineSnapshot returns empty for invalid id', async () => {
    const result = await resolveTestIdsByBaselineSnapshot('not-object-id', { CheckModel: makeCheckModel([]) as any });
    assert.equal(result.length, 0);
});

test('queryTests returns empty result when baseline snapshot has no tests', async () => {
    const options = { limit: 5, page: 2 };
    const result = await queryTests(
        {},
        options,
        new Types.ObjectId().toString(),
        { CheckModel: makeCheckModel([]) as any },
    );

    assert.equal(result.totalResults, 0);
    assert.equal(result.totalPages, 0);
    assert.equal(result.page, 2);
    assert.equal(result.limit, 5);
});

test('queryTests delegates to paginate with resolved test ids', async () => {
    const testId = new Types.ObjectId();
    const snapshotId = new Types.ObjectId();

    const filterCapture: any[] = [];
    const fakeTestModel = {
        paginate: async (filter: any) => {
            filterCapture.push(filter);
            return {
                results: [{ _id: testId }],
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 1,
                timestamp: 1,
            };
        },
    };

    const result = await queryTests(
        {},
        {},
        snapshotId.toString(),
        {
            CheckModel: makeCheckModel([testId]) as any,
            TestModel: fakeTestModel as any,
        },
    );

    assert.equal(result.totalResults, 1);
    assert.equal(filterCapture.length, 1);
    assert.ok(filterCapture[0]._id.$in.some((id: Types.ObjectId) => id.equals(testId)));
});
