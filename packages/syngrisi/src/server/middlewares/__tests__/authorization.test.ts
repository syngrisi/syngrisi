import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError } from '@utils';
import { appSettings } from '@settings';
import { authorization } from '../authorization';

// authorization(type) reads appSettings.isAuthEnabled() (an imported
// singleton); monkey-patch it per test and restore the original after.
const originalIsAuthEnabled = appSettings.isAuthEnabled;

after(() => {
    (appSettings as any).isAuthEnabled = originalIsAuthEnabled;
});

const setAuthEnabled = (enabled: boolean) => {
    (appSettings as any).isAuthEnabled = async () => enabled;
};

// The 'admin'/'user' handlers are genuinely async, so a thrown ApiError
// inside them becomes a rejected promise that catchAsync forwards to next(err).
const callAsyncMiddleware = (middleware: any, req: any) => new Promise<any>((resolve) => {
    const next = (err?: unknown) => resolve(err);
    middleware(req, {} as any, next);
});

test('authorization("admin"): auth enabled + role "admin" -> next() called with no error', async () => {
    setAuthEnabled(true);
    const middleware = authorization('admin');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'admin' } });
    assert.equal(err, undefined);
});

test('authorization("admin"): auth enabled + role "user" -> next(err) with FORBIDDEN wrong Role', async () => {
    setAuthEnabled(true);
    const middleware = authorization('admin');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'user' } });
    assert.ok(err instanceof ApiError);
    assert.equal((err as ApiError).statusCode, 403);
    assert.match((err as ApiError).message, /wrong Role/);
});

test('authorization("admin"): auth disabled -> next() called with no error regardless of role', async () => {
    setAuthEnabled(false);
    const middleware = authorization('admin');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'guest' } });
    assert.equal(err, undefined);
});

test('authorization("user"): role "reviewer" -> next() called with no error', async () => {
    setAuthEnabled(true);
    const middleware = authorization('user');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'reviewer' } });
    assert.equal(err, undefined);
});

test('authorization("user"): role "user" -> next() called with no error', async () => {
    setAuthEnabled(true);
    const middleware = authorization('user');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'user' } });
    assert.equal(err, undefined);
});

test('authorization("user"): role "guest" -> next(err) with FORBIDDEN wrong Role', async () => {
    setAuthEnabled(true);
    const middleware = authorization('user');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'guest' } });
    assert.ok(err instanceof ApiError);
    assert.equal((err as ApiError).statusCode, 403);
    assert.match((err as ApiError).message, /wrong Role/);
});

test('authorization("user"): auth disabled -> next() called with no error', async () => {
    setAuthEnabled(false);
    const middleware = authorization('user');
    const err = await callAsyncMiddleware(middleware, { user: { username: 'u', role: 'guest' } });
    assert.equal(err, undefined);
});

// Unknown type: the handler registered for this branch is a *synchronous*
// function (not async) passed through catchAsync. Because it throws before
// the catchAsync wrapper's Promise.resolve(...) call is entered, the
// rejection path is never reached -- the ApiError escapes as a synchronous
// throw from the middleware call itself, it is NOT delivered via next().
// This characterizes the actual current behavior (see NOTES in the plan-019
// executor report) rather than routing through the next() spy.
test('authorization("unknown-type"): throws ApiError FORBIDDEN synchronously (never reaches next())', () => {
    const middleware = authorization('unknown-type');
    assert.throws(
        () => middleware({ user: { username: 'u', role: 'admin' } } as any, {} as any, () => {
            throw new Error('next() should not be called for the unknown-type branch');
        }),
        (err: unknown) => {
            assert.ok(err instanceof ApiError);
            assert.equal((err as ApiError).statusCode, 403);
            assert.match((err as ApiError).message, /wrong type of authorization/);
            return true;
        },
    );
});
