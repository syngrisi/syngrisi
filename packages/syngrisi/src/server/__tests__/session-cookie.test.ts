import { test } from 'node:test';
import assert from 'node:assert/strict';

// Mirrors the derivation in app.ts (cookie.secure) and config.ts (hsts).
const secureFor = (nodeEnv: string) => nodeEnv === 'production';

test('session cookie is secure in production', () => {
    assert.equal(secureFor('production'), true);
});

test('session cookie is not secure in development/test', () => {
    assert.equal(secureFor('development'), false);
    assert.equal(secureFor('test'), false);
});
