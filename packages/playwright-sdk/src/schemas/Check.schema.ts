import { z } from 'zod'

export const CheckOptionsSchema = z.object({
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    name: z.string().min(1),
    viewport: z.string().min(3),
    browserName: z.string().min(1),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),

    testId: z.string().min(1),
    suite: z.string().min(1),
    browserVersion: z.string().min(1),
    browserFullVersion: z.string().min(1),
    hashCode: z.string().length(128).optional(),

    domDump: z.any().optional(), // Replace with appropriate schema if possible
})

export type CheckOptions = z.infer<typeof CheckOptionsSchema>;
