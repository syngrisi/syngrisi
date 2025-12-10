import { z } from 'zod'
import { DomDumpSchema } from '@syngrisi/core-api'

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

    domDump: DomDumpSchema.optional(), // DomNode tree or compressed format for RCA
})

export type CheckOptions = z.infer<typeof CheckOptionsSchema>;
