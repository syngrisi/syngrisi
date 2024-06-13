import { z } from 'zod';
export const createRequestQuerySchema = (schema: z.ZodTypeAny) => z.object({ query: schema })
