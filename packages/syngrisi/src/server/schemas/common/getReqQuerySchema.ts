import { z } from 'zod';
export const getReqQueryMultipleSchema = (schema: z.ZodTypeAny) => z.object({ query: schema })
