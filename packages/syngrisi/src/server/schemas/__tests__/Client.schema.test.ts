import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClientCreateCheckSchema } from '../Client.schema';
import { createRequestBodySchema } from '../utils/createRequestBodySchema';

const validBody = {
    testid: '666b2e1e93ca920ef5985b47',
    name: 'Login page',
    appName: 'My App',
    branch: 'main',
    suitename: 'Smoke tests',
    viewport: '1366x768',
    browserName: 'chrome',
    browserVersion: '125',
    browserFullVersion: '125.0.6422.142',
    os: 'macOS',
    hashcode: 'abc123',
};

// Regression: validateRequest replaces req.body with the Zod-parsed body, which strips
// unknown keys. If 'domdump' is missing from the schema, RCA DOM snapshots are silently
// dropped (the controller receives undefined). See fix in Client.schema.ts.
test('createCheck schema preserves the domdump field (RCA)', () => {
    const schema = createRequestBodySchema(ClientCreateCheckSchema);
    const dom = JSON.stringify({ tagName: 'BODY', attributes: {}, children: [] });

    const parsed = schema.parse({ body: { ...validBody, domdump: dom } }) as { body: Record<string, unknown> };

    assert.equal(parsed.body.domdump, dom, 'domdump must survive validation, otherwise RCA breaks');
});

test('createCheck schema accepts a compressed domdump payload', () => {
    const schema = createRequestBodySchema(ClientCreateCheckSchema);
    const compressed = JSON.stringify({ data: 'H4sIAAAA', compressed: true, originalSize: 1234 });

    const parsed = schema.parse({ body: { ...validBody, domdump: compressed } }) as { body: Record<string, unknown> };

    assert.equal(parsed.body.domdump, compressed);
});
