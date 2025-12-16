import { z } from 'zod';
export const createRequestOpenApiBodySchema = (schema: z.ZodTypeAny) => ({
    content: {
        'application/json': { schema: schema }
    }
})