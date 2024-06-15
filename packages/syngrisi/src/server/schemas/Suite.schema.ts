import { z } from 'zod';
import { commonValidations } from './utils';

const SuiteGetSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the suite',
        example: 'Smoke tests'
    }),
    tags: z.array(z.string()).openapi({
        description: 'Tags associated with the suite',
        example: []
    }),
    app: commonValidations.id.openapi({
        description: 'Application identifier',
        example: '666b3b82db17d34ecdbd06f6'
    }),
    createdDate: commonValidations.date.openapi({
        description: 'Creation date of the suite',
        example: '2024-06-13T18:33:38.617Z'
    }),
    updatedDate: commonValidations.date.openapi({
        description: 'Last update date of the suite',
        example: '2024-06-13T19:55:40.114Z'
    }),
    id: commonValidations.id.openapi({
        description: 'ID of the suite',
        example: '666b3b828833d0cf24a670d7'
    })
});

export { SuiteGetSchema };
