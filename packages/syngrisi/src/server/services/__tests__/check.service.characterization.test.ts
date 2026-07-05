import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Baseline } from '@models';
import { enrichChecksWithCurrentAcceptance } from '../check.service';

// enrichChecksWithCurrentAcceptance calls Baseline.aggregate(...) only when a
// check has all ident fields (name/viewport/browserName/os/app/branch).
// Monkey-patch it to stay DB-free; the acceptance decision in these fixtures
// is driven entirely by the check's own baselineId (the matchesOwnBaseline
// path), so an empty aggregate result is sufficient.
const originalAggregate = Baseline.aggregate;

before(() => {
    (Baseline as any).aggregate = () => ({ exec: async () => [] });
});

after(() => {
    (Baseline as any).aggregate = originalAggregate;
});

const identFields = {
    name: 'check-name',
    viewport: '1280x720',
    browserName: 'chromium',
    os: 'darwin',
    app: 'app-1',
    branch: 'main',
};

const makeCheck = (overrides: Record<string, unknown>) => ({
    _id: 'check-1',
    ...identFields,
    ...overrides,
});

test('enrichChecksWithCurrentAcceptance: accepted + actualSnapshotId matches own baselineId -> currently accepted', async () => {
    const check = makeCheck({
        markedAs: 'accepted',
        actualSnapshotId: 'snap-1',
        baselineId: 'snap-1',
    });

    const [result] = await enrichChecksWithCurrentAcceptance([check]);

    assert.equal(result.isCurrentlyAccepted, true);
    assert.equal(result.wasAcceptedEarlier, false);
});

test('enrichChecksWithCurrentAcceptance: accepted + actualSnapshotId differs from known baselineId -> was accepted earlier', async () => {
    const check = makeCheck({
        markedAs: 'accepted',
        actualSnapshotId: 'snap-2',
        baselineId: 'snap-1',
    });

    const [result] = await enrichChecksWithCurrentAcceptance([check]);

    assert.equal(result.isCurrentlyAccepted, false);
    assert.equal(result.wasAcceptedEarlier, true);
});

test('enrichChecksWithCurrentAcceptance: accepted + no baseline anywhere -> neither flag set', async () => {
    const check = makeCheck({
        markedAs: 'accepted',
        actualSnapshotId: 'snap-3',
        // no baselineId
    });

    const [result] = await enrichChecksWithCurrentAcceptance([check]);

    assert.equal(result.isCurrentlyAccepted, false);
    assert.equal(result.wasAcceptedEarlier, false);
});

test('enrichChecksWithCurrentAcceptance: markedAs not "accepted" -> both flags false regardless of baseline match', async () => {
    const check = makeCheck({
        markedAs: 'pending',
        actualSnapshotId: 'snap-1',
        baselineId: 'snap-1',
    });

    const [result] = await enrichChecksWithCurrentAcceptance([check]);

    assert.equal(result.isCurrentlyAccepted, false);
    assert.equal(result.wasAcceptedEarlier, false);
});

test('enrichChecksWithCurrentAcceptance: empty input returns empty array', async () => {
    const result = await enrichChecksWithCurrentAcceptance([]);
    assert.deepEqual(result, []);
});
