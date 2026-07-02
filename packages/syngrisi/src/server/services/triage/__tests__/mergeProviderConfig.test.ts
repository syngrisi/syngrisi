import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeProviderConfig } from '../mergeProviderConfig';

test('openai type: OPENAI_API_KEY wins, OPENAI_API_BASE_URL applied', () => {
    const result = mergeProviderConfig(
        { type: 'openai' },
        { OPENAI_API_KEY: 'sk-openai', OPENAI_API_BASE_URL: 'https://custom.openai.example/v1' },
    );
    assert.equal(result?.apiKey, 'sk-openai');
    assert.equal(result?.baseUrl, 'https://custom.openai.example/v1');
});

test('anthropic type with only OPENAI_API_KEY set: apiKey is undefined, not the openai key', () => {
    const result = mergeProviderConfig(
        { type: 'anthropic' },
        { OPENAI_API_KEY: 'sk-openai' },
    );
    assert.equal(result?.apiKey, undefined);
});

test('anthropic type: cfg.apiKey used if present, OPENAI_API_KEY is not applied', () => {
    const result = mergeProviderConfig(
        { type: 'anthropic', apiKey: 'db-anthropic-key' },
        { OPENAI_API_KEY: 'sk-openai' },
    );
    assert.equal(result?.apiKey, 'db-anthropic-key');
});

test('anthropic type: OPENAI_API_BASE_URL is NOT applied to baseUrl', () => {
    const result = mergeProviderConfig(
        { type: 'anthropic' },
        { OPENAI_API_BASE_URL: 'https://api.openai.com/v1' },
    );
    assert.equal(result?.baseUrl, undefined);
});

test('anthropic type: cfg.baseUrl used if present', () => {
    const result = mergeProviderConfig(
        { type: 'anthropic', baseUrl: 'https://api.anthropic.com' },
        { OPENAI_API_BASE_URL: 'https://api.openai.com/v1' },
    );
    assert.equal(result?.baseUrl, 'https://api.anthropic.com');
});

test('SYNGRISI_AI_KEY applies to any provider type', () => {
    const anthropic = mergeProviderConfig({ type: 'anthropic' }, { SYNGRISI_AI_KEY: 'generic-key' });
    const gemini = mergeProviderConfig({ type: 'gemini' }, { SYNGRISI_AI_KEY: 'generic-key' });
    const openai = mergeProviderConfig({ type: 'openai' }, { SYNGRISI_AI_KEY: 'generic-key' });
    assert.equal(anthropic?.apiKey, 'generic-key');
    assert.equal(gemini?.apiKey, 'generic-key');
    assert.equal(openai?.apiKey, 'generic-key');
});

test('SYNGRISI_AI_KEY does not override OPENAI_API_KEY for openai type', () => {
    const result = mergeProviderConfig(
        { type: 'openai' },
        { OPENAI_API_KEY: 'sk-openai', SYNGRISI_AI_KEY: 'generic-key' },
    );
    assert.equal(result?.apiKey, 'sk-openai');
});

test('cfg.apiKey used when no env keys', () => {
    const result = mergeProviderConfig({ type: 'openai', apiKey: 'db-key' }, {});
    assert.equal(result?.apiKey, 'db-key');
});

test('empty-string env values treated as absent, cfg.apiKey wins', () => {
    const result = mergeProviderConfig(
        { type: 'openai', apiKey: 'db-key' },
        { OPENAI_API_KEY: '', SYNGRISI_AI_KEY: '', OPENAI_API_BASE_URL: '' },
    );
    assert.equal(result?.apiKey, 'db-key');
    assert.equal(result?.baseUrl, undefined);
});

test('missing type defaults to openai', () => {
    const result = mergeProviderConfig({}, { OPENAI_API_KEY: 'sk-openai' });
    assert.equal(result?.type, 'openai');
    assert.equal(result?.apiKey, 'sk-openai');
});

test('passthrough of model/maxTokens/temperature/timeoutMs/fake* fields', () => {
    const result = mergeProviderConfig(
        {
            type: 'anthropic',
            model: 'claude-3-5-sonnet',
            maxTokens: 512,
            temperature: 0.2,
            timeoutMs: 15000,
            fakeVerdict: 'noise',
            fakeConfidence: 8,
            fakeReason: 'test reason',
        },
        {},
    );
    assert.equal(result?.model, 'claude-3-5-sonnet');
    assert.equal(result?.maxTokens, 512);
    assert.equal(result?.temperature, 0.2);
    assert.equal(result?.timeoutMs, 15000);
    assert.equal(result?.fakeVerdict, 'noise');
    assert.equal(result?.fakeConfidence, 8);
    assert.equal(result?.fakeReason, 'test reason');
});
