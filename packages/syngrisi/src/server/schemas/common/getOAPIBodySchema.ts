import { z } from 'zod';
export const getOAPIBodySchema = (schema: z.ZodTypeAny) => ({
    content: {
        'application/json': { schema: schema }
    }
})