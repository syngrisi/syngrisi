import { z } from 'zod'

export const SessionParamsSchema = z.object({
    run: z.string().min(1),
    runident: z.string().min(1),
    test: z.string().min(1),
    branch: z.string().min(1),
    app: z.string().min(1),
    suite: z.string().min(1).optional(),
    os: z.string().min(1).optional(),
    viewport: z.string().min(3).optional(),
    browserName: z.string().min(1).optional(),
    browserVersion: z.string().min(1).optional(),
    browserFullVersion: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    commit: z.string().regex(/^[0-9a-fA-F]{7,40}$/).optional(), // Git commit SHA, used to report a commit status back to GitHub
}).catchall(z.union([z.string(), z.array(z.string()), z.undefined()]))

export type SessionParams = z.infer<typeof SessionParamsSchema>;
