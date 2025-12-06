import { z } from 'zod'

const viewPort = z.string().min(3).regex(/^\d+x\d+$/) // regex for 'width x height' format
const idString = z.string().length(24) // Assuming all ID-like strings are MongoDB ObjectIDs with fixed 24-character length

export const SnapshotSchema = z.object({
    _id: idString.optional(),
    name: z.string().min(1).optional(),
    filename: z.string().min(1).optional(),
    imghash: z.string().length(128).optional(),
    createdDate: z.date().optional(),
})

export type Snapshot = z.infer<typeof SnapshotSchema>;

const getResponseSchema = (itemSchema: z.ZodObject<any>) => {
    return z.object({
        results: z.array(itemSchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number(),
        timestamp: z.bigint(),
    })
}

export const SnapshotResponseSchema = getResponseSchema(SnapshotSchema)

export type SnapshotResponse = z.infer<typeof SnapshotResponseSchema>;

export const BaselineParamsSchema = z.object({
    name: z.string().min(1),
    viewport: viewPort,
    browserName: z.string().min(1),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),
})

export type BaselineParams = z.infer<typeof BaselineParamsSchema>;
export const BaselineResponseSchema = getResponseSchema(BaselineParamsSchema)

export type BaselineResponse = z.infer<typeof BaselineResponseSchema>;

const checkStatusSchema = z.union([
    z.string().min(1),
    z.array(z.string().min(1)),
])

export const CheckResponseSchema = z.object({
    name: z.string().min(1),
    test: idString,
    suite: idString,
    app: idString,
    branch: z.string().min(1),
    baselineId: idString,
    actualSnapshotId: idString,
    updatedDate: z.string().min(1), // This assumes ISO date string format
    status: checkStatusSchema,
    browserName: z.string().min(1),
    browserVersion: z.union([
        z.string().min(1),
        z.number(),
    ]),
    browserFullVersion: z.string().min(1),
    viewport: viewPort,
    os: z.string().min(1),
    result: z.string().min(1), // Adjusted if a JSON object is needed
    run: idString,
    creatorId: idString,
    creatorUsername: z.string().min(1),
    failReasons: z.array(z.any()), // Allows an array of any type, assuming failure reasons can vary in type
    _id: idString,
    createdDate: z.string().min(1), // This assumes ISO date string format
    currentSnapshot: SnapshotSchema,
    expectedSnapshot: SnapshotSchema,
    lastSuccess: idString,
})

export type CheckResponse = z.infer<typeof CheckResponseSchema>;

export const CheckParamsSchema = z.object({
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    name: z.string().min(1),
    viewport: viewPort,
    browserName: z.string().min(1),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),

    testId: idString,
    suite: z.string().min(1),
    browserVersion: z.union([
        z.string().min(1),
        z.number(),
    ]),
    browserFullVersion: z.string().min(1),
    hashCode: z.string().min(64), // SHA256 (64 chars) or SHA512 (128 chars)

    domDump: z.any().optional(), // Replace with appropriate schema if possible
})

export type CheckParams = z.infer<typeof CheckParamsSchema>;

export const ApiSessionParamsSchema = z.object({
    run: z.string().min(1),
    suite: z.string().min(1),
    runident: z.string().min(1),
    name: z.string().min(1),
    viewport: viewPort,
    browser: z.string().min(1),
    browserVersion: z.union([
        z.string().min(1),
        z.number(),
    ]),
    browserFullVersion: z.string().min(1),
    os: z.string(),
    app: z.string(),
    tags: z.array(z.string()).optional(),
    branch: z.string(),
})

export type ApiSessionParams = z.infer<typeof ApiSessionParamsSchema>;

export const ApiSessionOptsSchema = z.object({
    run: z.string(),
    suite: z.string(),
    runident: z.string(),
    name: z.string(),
    viewport: viewPort,
    browser: z.string(),
    browserVersion: z.union([
        z.string().min(1),
        z.number(),
    ]),
    os: z.string(),
    app: z.string(),
    tags: z.array(z.string()).optional(),
    branch: z.string(),
    browserFullVersion: z.string().optional(),
})

export type ApiSessionOpts = z.infer<typeof ApiSessionOptsSchema>;


export const ConfigSchema = z.object({
    url: z.string().min(1),
    apiKey: z.string().optional(),
    apiHash: z.string().min(1).optional(),
})

export type Config = z.infer<typeof ConfigSchema>;

export const ConstructorParamsSchema = z.object({
    url: z.string().min(1),
    apiKey: z.string().optional(),
})

export type ConstructorParam = z.infer<typeof ConstructorParamsSchema>;

export const SessionResponseSchema = z.object({
    name: z.string().min(1),
    status: z.string().min(1),
    browserName: z.string().min(1),
    browserVersion: z.string().min(1),
    branch: z.string().min(1),
    tags: z.array(z.string()).min(1), // Assuming that an empty array is not allowed
    viewport: viewPort,
    os: z.string().min(1),
    app: idString, // Fixed length string for IDs
    blinking: z.number(),
    updatedDate: z.string().min(1), // You may want to refine this to a date-time string format
    startDate: z.string().min(1), // Similar to updatedDate
    checks: z.array(z.array(z.string())), // Placeholder for any type as specifics are not given
    suite: idString, // Fixed length string for IDs
    run: idString, // Fixed length string for IDs
    _id: idString, // Fixed length string for IDs
    id: idString, // Fixed length string for IDs
})

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

export interface ErrorObject {
    error: boolean;
    errorMsg: string;
    statusCode?: number; // statusCode is optional because it may not be present if e.response is undefined
    statusMessage?: string; // statusMessage is optional for the same reason as statusCode
    stack?: string; // stack is optional as it may not be present on all error objects
}

