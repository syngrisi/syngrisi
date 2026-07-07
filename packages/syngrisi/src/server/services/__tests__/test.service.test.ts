/* eslint-disable @typescript-eslint/no-explicit-any */
// `any` is used deliberately for lightweight model/service mocks in these tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { queryTests, resolveTestIdsByBaselineSnapshot, accept } from '../test.service';

// A Check model mock that honours a `{ test, _id: { $in } }` filter, so tests can
// assert which checks the accept scoping selects.
const makeAcceptCheckModel = (checks: { _id: string; actualSnapshotId: string }[]) => ({
    find: (filter: any) => ({
        exec: async () => {
            const idIn: string[] | undefined = filter?._id?.$in;
            return idIn ? checks.filter((c) => idIn.includes(c._id)) : checks;
        },
    }),
});

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

test('accept scopes to the given checkIds (AI-match / similar subset)', async () => {
    const allChecks = [
        { _id: 'c1', actualSnapshotId: 's1' },
        { _id: 'c2', actualSnapshotId: 's2' },
        { _id: 'c3', actualSnapshotId: 's3' },
    ];
    const accepted: string[] = [];
    await accept(
        'test1',
        { username: 'u' } as any,
        ['c1', 'c3'],
        {
            CheckModel: makeAcceptCheckModel(allChecks) as any,
            acceptCheck: (async (checkId: string) => { accepted.push(String(checkId)); }) as any,
        },
    );
    assert.deepEqual(accepted.sort(), ['c1', 'c3']);
});

test('accept without checkIds accepts every check of the test (unchanged)', async () => {
    const allChecks = [
        { _id: 'c1', actualSnapshotId: 's1' },
        { _id: 'c2', actualSnapshotId: 's2' },
        { _id: 'c3', actualSnapshotId: 's3' },
    ];
    const accepted: string[] = [];
    await accept(
        'test1',
        { username: 'u' } as any,
        undefined,
        {
            CheckModel: makeAcceptCheckModel(allChecks) as any,
            acceptCheck: (async (checkId: string) => { accepted.push(String(checkId)); }) as any,
        },
    );
    assert.deepEqual(accepted.sort(), ['c1', 'c2', 'c3']);
});

test('accept with an empty checkIds array accepts the whole test (no accidental no-op)', async () => {
    const allChecks = [{ _id: 'c1', actualSnapshotId: 's1' }, { _id: 'c2', actualSnapshotId: 's2' }];
    const accepted: string[] = [];
    await accept('test1', { username: 'u' } as any, [], {
        CheckModel: makeAcceptCheckModel(allChecks) as any,
        acceptCheck: (async (checkId: string) => { accepted.push(String(checkId)); }) as any,
    });
    assert.deepEqual(accepted.sort(), ['c1', 'c2']);
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
