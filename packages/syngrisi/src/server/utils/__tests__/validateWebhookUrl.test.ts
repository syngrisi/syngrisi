import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWebhookUrl } from '../validateWebhookUrl';

test('accepts a public https URL (IP literal, no DNS lookup)', async () => {
    const parsed = await validateWebhookUrl('https://93.184.216.34/hook');
    assert.equal(parsed.hostname, '93.184.216.34');
});

test('rejects loopback IPv4 literal', async () => {
    await assert.rejects(() => validateWebhookUrl('https://127.0.0.1/x'));
});

test('rejects RFC-1918 private IPv4 literal (10.0.0.0/8)', async () => {
    await assert.rejects(() => validateWebhookUrl('https://10.0.0.5/x'));
});

test('rejects RFC-1918 private IPv4 literal (192.168.0.0/16)', async () => {
    await assert.rejects(() => validateWebhookUrl('https://192.168.1.10/x'));
});

test('rejects link-local IPv4 literal, incl. cloud metadata address', async () => {
    await assert.rejects(() => validateWebhookUrl('https://169.254.169.254/latest/meta-data'));
});

test('rejects IPv6 loopback literal', async () => {
    await assert.rejects(() => validateWebhookUrl('https://[::1]/x'));
});

test('rejects non-https scheme (http, not allowlisted)', async () => {
    await assert.rejects(() => validateWebhookUrl('http://example.com'));
});

test('rejects non-http(s) scheme (file:)', async () => {
    await assert.rejects(() => validateWebhookUrl('file:///etc/passwd'));
});

test('rejects an unparseable string', async () => {
    await assert.rejects(() => validateWebhookUrl('not a url'));
});
