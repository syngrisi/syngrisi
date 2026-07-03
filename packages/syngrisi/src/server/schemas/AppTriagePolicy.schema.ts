import { z } from 'zod';

// This file intentionally avoids path-aliased imports (e.g. `@schemas/utils`) so it can be
// imported directly via a relative path from tests run with plain `tsx --test`, which does
// not resolve tsconfig path aliases. Keep it dependency-free (zod only).

// Reserved service verdict keys — must stay in sync with `services/triage/verdicts.ts`
// (UNKNOWN_VERDICT / CANCELLED_VERDICT). Custom verdict sets may not reuse them.
const RESERVED_VERDICT_KEYS = ['unknown', 'cancelled'] as const;

const TriagePolicySchema = z.object({
    policy: z.enum(['suggest', 'auto']).optional(),
    autoAcceptThreshold: z.number().int().min(0).max(10).optional(),
    autoAcceptVerdicts: z.array(z.string().max(64)).max(50).optional(),
}).strict();

const TriageVerdictSchema = z.object({
    key: z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/i, 'key must match /^[a-z0-9_-]+$/i'),
    label: z.string().max(128),
    color: z.string().max(64),
    icon: z.string().max(64).optional(),
    severity: z.number(),
    autoAcceptable: z.boolean(),
    neverAutoAccept: z.boolean().optional(),
    isFallback: z.boolean().optional(),
    description: z.string().max(2000).optional(),
}).strict();

const TriageVerdictsSchema = z.array(TriageVerdictSchema).max(20).superRefine((verdicts, ctx) => {
    if (verdicts.length === 0) return;

    const seenKeys = new Set<string>();
    verdicts.forEach((verdict, index) => {
        if (seenKeys.has(verdict.key)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `duplicate verdict key: '${verdict.key}'`,
                path: [index, 'key'],
            });
        }
        seenKeys.add(verdict.key);

        if ((RESERVED_VERDICT_KEYS as readonly string[]).includes(verdict.key)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `'${verdict.key}' is a reserved service verdict key`,
                path: [index, 'key'],
            });
        }
    });

    if (!verdicts.some((verdict) => verdict.isFallback)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'at least one verdict must be marked as isFallback: true',
        });
    }
});

const TriageExampleSchema = z.object({
    verdict: z.string().min(1),
    image: z.string().max(2_000_000).startsWith('data:image/', 'image must be a data URL (data:image/...)'),
    note: z.string().max(500).optional(),
});

export const AppTriagePolicyUpdateSchema = z.object({
    triageEnabled: z.union([z.boolean(), z.enum(['true', 'false'])]).optional(),
    triagePolicy: TriagePolicySchema.optional(),
    triageVerdicts: TriageVerdictsSchema.optional(),
    triagePrompt: z.string().max(20000).optional(),
    triageExamples: z.array(TriageExampleSchema).max(20).optional(),
    changeSimGate: z.number().min(0).max(1).optional(),
    // Read-time baseline fallback: branch whose accepted baselines cover every other branch for
    // this project. Empty string clears it (feature disabled, preserving today's behavior).
    mainBranch: z.string().max(255).optional(),
}).strict();

export type AppTriagePolicyUpdateType = z.infer<typeof AppTriagePolicyUpdateSchema>;
