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

// Regression: vShifting is read by the controller but was missing from the schema, so it
// was stripped too. It arrives over multipart as a string and must become a real boolean.
test('createCheck schema coerces vShifting "true"/"false" strings to booleans', () => {
    const schema = createRequestBodySchema(ClientCreateCheckSchema);

    const enabled = schema.parse({ body: { ...validBody, vShifting: 'true' } }) as { body: Record<string, unknown> };
    assert.equal(enabled.body.vShifting, true);

    const disabled = schema.parse({ body: { ...validBody, vShifting: 'false' } }) as { body: Record<string, unknown> };
    assert.equal(disabled.body.vShifting, false);

    const absent = schema.parse({ body: { ...validBody } }) as { body: Record<string, unknown> };
    assert.equal(absent.body.vShifting, undefined);
});
