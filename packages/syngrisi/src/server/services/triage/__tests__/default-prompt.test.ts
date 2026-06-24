import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSystemPrompt } from '../prompt';
import { DEFAULT_VERDICTS as V } from '../verdicts';

test('default prompt lists every verdict key and its description', () => {
    const p = buildSystemPrompt(V);
    for (const v of V) {
        assert.ok(p.includes(v.key), `prompt should mention verdict key "${v.key}"`);
        assert.ok(p.includes(v.description || v.label), `prompt should mention "${v.key}" description`);
    }
});

test('default prompt demands strict JSON with the verdict/confidence/reason shape', () => {
    const p = buildSystemPrompt(V);
    assert.ok(/STRICT JSON/i.test(p));
    assert.ok(p.includes('"verdict"') && p.includes('"confidence"') && p.includes('"reason"'));
});

test('default prompt carries the context placeholders that get substituted at triage time', () => {
    const p = buildSystemPrompt(V);
    for (const key of ['checkName', 'testName', 'suiteName', 'appName', 'diffPercent']) {
        assert.ok(p.includes(`{{${key}}}`), `prompt should contain placeholder {{${key}}}`);
    }
});
