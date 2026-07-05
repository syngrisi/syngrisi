import { test } from 'node:test';
import assert from 'node:assert/strict';
import User from '../../models/User.model';

test('serialized User document omits password', () => {
    const doc = new User({
        username: 'u', firstName: 'f', lastName: 'l', role: 'user',
        password: 'x', token: 'x', apiKey: 'x',
    });
    const json = doc.toJSON();
    assert.equal('password' in json, false);
});

test('serialized User document omits token', () => {
    const doc = new User({
        username: 'u', firstName: 'f', lastName: 'l', role: 'user',
        password: 'x', token: 'x', apiKey: 'x',
    });
    const json = doc.toJSON();
    assert.equal('token' in json, false);
});

test('serialized User document omits apiKey', () => {
    const doc = new User({
        username: 'u', firstName: 'f', lastName: 'l', role: 'user',
        password: 'x', token: 'x', apiKey: 'x',
    });
    const json = doc.toJSON();
    assert.equal('apiKey' in json, false);
});

test('serialized User document omits salt', () => {
    const doc = new User({
        username: 'u', firstName: 'f', lastName: 'l', role: 'user',
        password: 'x', token: 'x', apiKey: 'x',
    });
    const json = doc.toJSON();
    assert.equal('salt' in json, false);
});
