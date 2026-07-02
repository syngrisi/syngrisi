import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AppTriagePolicyUpdateSchema } from '../AppTriagePolicy.schema';
import { createRequestBodySchema } from '../utils/createRequestBodySchema';

const validBody = {
    triageEnabled: true,
    triagePolicy: {
        policy: 'auto',
        autoAcceptThreshold: 5,
        autoAcceptVerdicts: ['noise'],
    },
    triageVerdicts: [
        {
            key: 'noise',
            label: 'Noise',
            color: 'gray',
            icon: 'wave',
            severity: 1,
            autoAcceptable: true,
            description: 'pixels differ but the UI is effectively unchanged',
        },
        {
            key: 'uncertain',
            label: 'Uncertain',
            color: 'yellow',
            severity: 3,
            autoAcceptable: false,
            neverAutoAccept: true,
            isFallback: true,
        },
    ],
    triagePrompt: 'Classify the visual diff.',
    triageExamples: [
        {
            verdict: 'noise',
            image: 'data:image/png;base64,AAAA',
            note: 'anti-aliasing shift',
        },
    ],
    changeSimGate: 0.8,
};

// Regression: PATCH /v1/app/:id/triage-policy used SkipValid (z.any()), so an unauthenticated
// caller could push an arbitrary payload and, e.g., flip the policy to 'auto'. This schema
// enforces the shape of every field the controller reads.
test('triage policy schema accepts a valid full payload', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const parsed = schema.parse({ body: validBody }) as { body: Record<string, unknown> };
    assert.equal((parsed.body.triagePolicy as Record<string, unknown>).policy, 'auto');
});

test('triage policy schema accepts an empty body (all fields optional)', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const parsed = schema.parse({ body: {} }) as { body: Record<string, unknown> };
    assert.deepEqual(parsed.body, {});
});

test('triage policy schema rejects duplicate verdict keys', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = {
        triageVerdicts: [
            { key: 'noise', label: 'Noise', color: 'gray', severity: 1, autoAcceptable: true, isFallback: true },
            { key: 'noise', label: 'Noise 2', color: 'gray', severity: 1, autoAcceptable: true },
        ],
    };
    assert.throws(() => schema.parse({ body }));
});

test('triage policy schema rejects the reserved "cancelled" verdict key', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = {
        triageVerdicts: [
            { key: 'cancelled', label: 'Cancelled', color: 'gray', severity: 0, autoAcceptable: false, isFallback: true },
        ],
    };
    assert.throws(() => schema.parse({ body }));
});

test('triage policy schema rejects a verdict set without an isFallback verdict', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = {
        triageVerdicts: [
            { key: 'noise', label: 'Noise', color: 'gray', severity: 1, autoAcceptable: true },
        ],
    };
    assert.throws(() => schema.parse({ body }));
});

test('triage policy schema rejects autoAcceptThreshold out of range', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = { triagePolicy: { autoAcceptThreshold: 11 } };
    assert.throws(() => schema.parse({ body }));
});

test('triage policy schema rejects an example image that is not a data URL', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = {
        triageExamples: [{ verdict: 'noise', image: 'https://example.com/image.png' }],
    };
    assert.throws(() => schema.parse({ body }));
});

test('triage policy schema rejects unknown top-level keys', () => {
    const schema = createRequestBodySchema(AppTriagePolicyUpdateSchema);
    const body = { ...validBody, unexpectedField: 'nope' };
    assert.throws(() => schema.parse({ body }));
});
