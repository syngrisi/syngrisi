import { z } from 'zod';
export const createRequestBodySchema = (schema: z.ZodTypeAny) => z.object({ body: schema })