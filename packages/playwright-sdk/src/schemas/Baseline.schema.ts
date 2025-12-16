import { z } from 'zod'

export const BaselineParamsSchema = z.object({
    // ident
    name: z.string().min(1), //
    viewport: z.string().min(2),
    browserName: z.string().min(2),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),
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
