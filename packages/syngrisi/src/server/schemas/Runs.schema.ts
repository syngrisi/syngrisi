import { z } from 'zod';
import { commonValidations } from './utils';

const RunResponseSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the run',
        example: 'DEBUG (VIKTAR)'
    }),
    app: commonValidations.id.openapi({
        description: 'App identifier',
        example: '6651dd45b9c3e1e0b8c1ce26'
    }),
    ident: z.string().uuid().openapi({
        description: 'Identifier for the run',
        example: '7a930247-e422-4833-8ab6-b136c23d07e9'
    }),
    createdDate: z.string().datetime().openapi({
        description: 'Creation date of the run',
        example: '2024-05-25T13:15:26.592Z'
    }),
    parameters: z.array(z.unknown()).openapi({
        description: 'Parameters of the run',
        example: []
    }),
    updatedDate: z.string().datetime().openapi({
        description: 'Last update date of the run',
        example: '2024-05-25T13:15:30.969Z'
    }),
    id: commonValidations.id.openapi({
        description: 'Run identifier',
        example: '6651e46e85f83573a821d1f4'
    }),
});

const RunGetSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the run',
        example: 'Sample Run'
    }),
    // additional fields here...
});

export { RunGetSchema, RunResponseSchema };
