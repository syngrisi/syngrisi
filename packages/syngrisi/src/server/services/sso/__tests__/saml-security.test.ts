import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSamlSigning } from '../saml.provider';

test('SAML signatures are required by default', () => {
    assert.deepEqual(resolveSamlSigning(false), {
        wantAuthnResponseSigned: true,
        wantAssertionsSigned: true,
    });
});

test('SAML signing can be explicitly relaxed', () => {
    assert.deepEqual(resolveSamlSigning(true), {
        wantAuthnResponseSigned: false,
        wantAssertionsSigned: false,
    });
});
