import { z } from 'zod';
import { commonValidations } from './utils';

const TestGetSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the test',
        example: 'Get IP'
    }),
    status: z.string().openapi({
        description: 'Status of the test',
        example: 'Failed'
    }),
    browserName: z.string().openapi({
        description: 'Name of the browser',
        example: 'chrome'
    }),
    browserVersion: z.string().openapi({
        description: 'Version of the browser',
        example: '125'
    }),
    branch: z.string().openapi({
        description: 'Branch name',
        example: 'master'
    }),
    tags: z.array(z.string()).openapi({
        description: 'Tags associated with the test',
        example: ['@smoke', '@regression']
    }),
    viewport: z.string().openapi({
        description: 'Viewport size',
        example: '1366x768'
    }),
    os: z.string().openapi({
        description: 'Operating system',
        example: 'macOS'
    }),
    app: commonValidations.id.openapi({
        description: 'Application identifier',
        example: '6651dd45b9c3e1e0b8c1ce26'
    }),
    blinking: z.number().openapi({
        description: 'Blinking count',
        example: 0
    }),
    updatedDate: commonValidations.date.openapi({
        description: 'Last update date of the test',
        example: '2024-06-13T19:55:40.108Z'
    }),
    startDate: commonValidations.date.openapi({
        description: 'Start date of the test',
        example: '2024-06-13T19:54:28.409Z'
    }),
    checks: z.array(commonValidations.id).openapi({
        description: 'List of checks associated with the test',
        example: ['666b4e7e421977cbf466b458', '666b4ebc421977cbf466b47c']
    }),
    suite: commonValidations.id.openapi({
        description: 'Suite identifier',
        example: '666b3b828833d0cf24a670d7'
    }),
    run: commonValidations.id.openapi({
        description: 'Run identifier',
        example: '666b4e74421977cbf466b443'
    }),
    creatorId: commonValidations.id.openapi({
        description: 'Creator identifier',
        example: '66519e582c2c701cc438ce59'
    }),
    creatorUsername: z.string().openapi({
        description: 'Username of the creator',
        example: 'Guest'
    }),
    markedAs: z.string().openapi({
        description: 'Marked as status',
        example: 'Unaccepted'
    }),
    calculatedViewport: z.string().openapi({
        description: 'Calculated viewport size',
        example: '1366x768'
    }),
    id: commonValidations.id.openapi({
        description: 'ID of the test',
        example: '666b4e74421977cbf466b446'
    })
});

const TestAcceptSchema = z.object({
    id: commonValidations.id,
});

const validIds = [
    'suite',
    'run',
    'markedAs',
    'creatorId',
    'creatorUsername',
    'name',
    'status',
    'browserName',
    'browserVersion',
    'branch',
    'tags',
    'viewport',
    'os',
    'app',
    'startDate',

] as const;

export const TestDistinctRequestFieldParamsSchema = z.object({
    field: z.enum(validIds).openapi({
        description: 'Parameter identifier',
        example: 'suite'
    })
});

const TestDistinctSchema = TestGetSchema;

export { TestGetSchema, TestAcceptSchema, TestDistinctSchema };
