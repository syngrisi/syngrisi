import { z } from 'zod'
import { ApiSessionParams } from '@syngrisi/core-api'

export const BaselineParamsSchema = z.object({
    // ident
    name: z.string().min(1), //
    viewport: z.string().min(2).optional(),
    browserName: z.string().min(2).optional(),
    os: z.string().min(1).optional(),
    app: z.string().min(1).optional(),
    branch: z.string().min(1).optional(),
})

export type BaselineParams = z.infer<typeof BaselineParamsSchema>;

export const RequiredIdentOptionsSchema = z.object({
    name: z.string().min(1),
    viewport: z.string().min(3),
    browserName: z.string().min(1),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),
    imghash: z.string().length(128)
})

export type RequiredIdentOptions = z.infer<typeof RequiredIdentOptionsSchema>;

export const SessionParamsSchema = z.object({
    run: z.string().min(1),
    runident: z.string().min(1),
    test: z.string().min(1),
    branch: z.string().min(1),
    app: z.string().min(1),
    suite: z.string().min(1),
    os: z.string().min(1).optional(),
    viewport: z.string().min(3).optional(),
    browserName: z.string().min(1).optional(),
    browserVersion: z.string().min(1).optional(),
    browserFullVersion: z.string().min(1).optional(),
    tags: z.array(z.string()).optional()
}).catchall(z.union([z.string(), z.array(z.string()), z.undefined()]))

export type SessionParams = z.infer<typeof SessionParamsSchema>;

export interface DriverParams {
    suite?: string;
    test: ApiSessionParams & {testId?: string};
}
