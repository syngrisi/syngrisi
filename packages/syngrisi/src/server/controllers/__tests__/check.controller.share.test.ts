import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDomSnapshot, getSimilar } from '../check.controller';
import { ApiError } from '@utils';

// getDomSnapshot/getSimilar are wrapped in catchAsync, which turns a thrown
// ApiError into a call to next(err). Invoke the handler directly with a fake
// request and capture whatever next() is called with.
function invoke(
    handler: (req: any, res: any, next: any) => void,
    req: any
): Promise<any> {
    return new Promise((resolve) => {
        const res: any = {};
        const next = (err: unknown) => resolve(err);
        handler(req, res, next);
    });
}

test('getDomSnapshot rejects with 404 when share-mode request targets a different check', async () => {
    const req: any = {
        params: { id: 'checkB' },
        isShareMode: true,
        shareToken: { checkId: 'checkA' },
    };

    const err = await invoke(getDomSnapshot, req);

    assert.ok(err instanceof ApiError, 'expected an ApiError');
    assert.equal(err.statusCode, 404);
});

test('getSimilar rejects with 404 when share-mode request targets a different check', async () => {
    const req: any = {
        params: { id: 'checkB' },
        isShareMode: true,
        shareToken: { checkId: 'checkA' },
    };

    const err = await invoke(getSimilar, req);

    assert.ok(err instanceof ApiError, 'expected an ApiError');
    assert.equal(err.statusCode, 404);
});
