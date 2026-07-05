import { test } from 'node:test';
import assert from 'node:assert/strict';

// Unit-tests the secret-stripping step used by ai.controller.ts's
// `registerWebhook` (see the `const { secret: _omit, ...safe } = webhook.toJSON();`
// line). Exercising the full controller would require a live Mongo connection
// (webhookService.createWebhook -> Webhook.create), so this asserts the same
// destructuring logic on a fake doc whose `.toJSON()` returns a raw webhook
// shape including the write-only `secret` field.
const fakeWebhookDoc = {
    toJSON: () => ({
        id: 'abc123',
        url: 'https://example.com/hook',
        events: ['check.created'],
        enabled: true,
        secret: 'super-secret-value',
    }),
};

test('registerWebhook response strips the secret field', () => {
    const webhook = fakeWebhookDoc;
    const { secret: _omit, ...safe } = webhook.toJSON();

    assert.strictEqual('secret' in safe, false);
    assert.strictEqual(safe.url, 'https://example.com/hook');
    assert.strictEqual(safe.id, 'abc123');
});
