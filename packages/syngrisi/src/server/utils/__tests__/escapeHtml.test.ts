import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../escapeHtml';

test('escapes all five special characters', () => {
    assert.equal(escapeHtml('&'), '&amp;');
    assert.equal(escapeHtml('<'), '&lt;');
    assert.equal(escapeHtml('>'), '&gt;');
    assert.equal(escapeHtml('"'), '&quot;');
    assert.equal(escapeHtml("'"), '&#39;');
});

test('leaves a plain string untouched', () => {
    assert.equal(escapeHtml('hello world 123'), 'hello world 123');
});

test('converts null and undefined to an empty string', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
});

test('neutralizes a realistic XSS payload', () => {
    assert.equal(
        escapeHtml('<img src=x onerror=alert(1)>'),
        '&lt;img src=x onerror=alert(1)&gt;'
    );
});
