import { z } from 'zod';
// import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from './utils';

const CheckGetSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the check',
        example: 'Sample Check'
    }),
    test: commonValidations.id.openapi({
        description: 'Test identifier',
        example: '666acbe24fe1d2a67424ff60'
    }),
    suite: commonValidations.id.openapi({
        description: 'Suite identifier',
        example: '6651dd457c9186e315910b00'
    }),
    app: commonValidations.id.openapi({
        description: 'Application identifier',
        example: '6651dd45b9c3e1e0b8c1ce26'
    }),
    branch: z.string().min(1).openapi({
        description: 'Branch name',
        example: 'master'
    }),
    baselineId: commonValidations.id.openapi({
        description: 'Baseline identifier',
        example: '6656ee01bac26a33185c9488'
    }),
    actualSnapshotId: commonValidations.id.openapi({
        description: 'Actual snapshot identifier',
        example: '666acbf04fe1d2a67424ffa4'
    }),
    diffId: commonValidations.id.openapi({
        description: 'Difference identifier',
        example: '666acbf04fe1d2a67424ffa9'
    }),
    updatedDate: commonValidations.date.openapi({
        description: 'Last update date of the check',
        example: '2024-06-13T10:37:36.264Z'
    }),
    status: z.array(z.string().min(1)).openapi({
        description: 'Status of the check',
        example: ['failed']
    }),
    browserName: z.string().min(1).openapi({
        description: 'Browser name used for the check',
        example: 'chrome'
    }),
    browserVersion: z.string().min(1).openapi({
        description: 'Browser version used for the check',
        example: '125'
    }),
    browserFullVersion: z.string().min(1).openapi({
        description: 'Full browser version used for the check',
        example: '125.0.6422.142'
    }),
    viewport: z.string().min(1).openapi({
        description: 'Viewport size used for the check',
        example: '1366x768'
    }),
    os: z.string().min(1).openapi({
        description: 'Operating system used for the check',
        example: 'macOS'
    }),
    result: z.string().openapi({
        description: 'Result of the check',
        example: '{\n\t"isSameDimensions": false,\n\t"dimensionDifference": {\n\t\t"width": 24,\n\t\t"height": 8\n\t},\n\t"rawMisMatchPercentage": 67.38024135551241,\n\t"misMatchPercentage": "67.38",\n\t"analysisTime": 99,\n\t"executionTotalTime": "0,398753687",\n\t"totalCheckHandleTime": "0,431217924"\n}'
    }),
    run: commonValidations.id.openapi({
        description: 'Run identifier',
        example: '666acbe24fe1d2a67424ff5d'
    }),
    markedAs: z.string().min(1).openapi({
        description: 'Status marked for the check',
        example: 'accepted'
    }),
    markedDate: commonValidations.date.openapi({
        description: 'Marked date of the check',
        example: '2024-06-13T07:19:32.246Z'
    }),
    markedByUsername: z.string().min(1).openapi({
        description: 'Username of the user who marked the check',
        example: 'Administrator'
    }),
    creatorId: commonValidations.id.openapi({
        description: 'Identifier of the user who created the check',
        example: '66519e582c2c701cc438ce59'
    }),
    creatorUsername: z.string().min(1).openapi({
        description: 'Username of the user who created the check',
        example: 'Guest'
    }),
    failReasons: z.array(z.string().min(1)).openapi({
        description: 'Reasons for the check failure',
        example: ['wrong_dimensions', 'different_images']
    }),
    createdDate: commonValidations.date.openapi({
        description: 'Creation date of the check',
        example: '2024-06-13T10:37:36.721Z'
    }),
    id: commonValidations.id,
});


const CheckUpdateSchema = CheckGetSchema.omit({ id: true, _id: true }).partial();

export type CheckUpdateType = z.infer<typeof CheckUpdateSchema>

const CheckAcceptSchema = z.object({
    baselineId: commonValidations.id.openapi({
        description: 'Baseline identifier to accept the check',
        example: '6651ec20917e9ce26f7c0849'
    }),
});

export { CheckGetSchema, CheckUpdateSchema, CheckAcceptSchema };
