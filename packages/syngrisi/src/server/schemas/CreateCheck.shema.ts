import { z } from 'zod';

export const createCheckParamsSchema = z.object({
    branch: z.string().min(1),
    appName: z.string().min(1),
    suitename: z.string().min(1),
    testid: z.string().regex(/^[a-f0-9]{24}$/), // Regex for 24 hex characters
    name: z.string().min(1),
    viewport: z.string().regex(/^\d+x\d+$/), // "WidthxHeight" format
    browserName: z.string().min(1),
    browserVersion: z.string().min(1),
    browserFullVersion: z.string(),
    os: z.string().min(1),
    hashcode: z.string().length(128) // Assuming hashcode is always 128 chars length
});

export type createCheckParam = z.infer<typeof createCheckParamsSchema>;
