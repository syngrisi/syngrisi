import { z } from 'zod';

export const SnapshotDiffSchema = z.object({
    isSameDimensions: z.boolean(),
    dimensionDifference: z.object({
        width: z.number(),
        height: z.number()
    }),
    rawMisMatchPercentage: z.number(),
    misMatchPercentage: z.string(),
    analysisTime: z.number(),
    executionTotalTime: z.string(),
    stabMethod: z.string().optional(),
    vOffset: z.number().optional(),
    baselineDimensions: z.object({ width: z.number(), height: z.number() }).optional(),
    actualDimensions: z.object({ width: z.number(), height: z.number() }).optional(),
});

export type SnapshotDiff = z.infer<typeof SnapshotDiffSchema> & { getBuffer: (() => Buffer) | null, totalCheckHandleTime?: string };
