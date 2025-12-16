import { z } from 'zod';

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
    'filter',
] as const;

const TestDistinctRequestParamsSchema = z.object({
    id: z.enum(validIds).openapi({
        description: 'Parameter identifier',
        example: 'suite'
    })
});

const TestDistinctResponseSchema = z.object({
    name: z.string().min(1).openapi({
        description: 'Distinct field value',
        example: 'chrome'
    })
});

export { TestDistinctRequestParamsSchema, TestDistinctResponseSchema };
