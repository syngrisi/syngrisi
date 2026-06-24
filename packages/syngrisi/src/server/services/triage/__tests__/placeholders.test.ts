import { test } from 'node:test';
import assert from 'node:assert/strict';
import { substitutePlaceholders } from '../prompt';

test('substitutes known placeholders with context values', () => {
    const out = substitutePlaceholders('check "{{checkName}}" in "{{testName}}" diff {{diffPercent}}%', {
        checkName: 'Login', testName: 'Auth flow', diffPercent: '12.5',
    });
    assert.equal(out, 'check "Login" in "Auth flow" diff 12.5%');
});

test('tolerates spaces inside braces', () => {
    assert.equal(substitutePlaceholders('{{ appName }}', { appName: 'Web' }), 'Web');
});

test('missing/unknown placeholders become empty', () => {
    assert.equal(substitutePlaceholders('a{{nope}}b{{checkName}}', { checkName: '' }), 'ab');
});

test('leaves text without placeholders untouched', () => {
    assert.equal(substitutePlaceholders('plain text, no tokens', {}), 'plain text, no tokens');
});
