import { z } from 'zod';
export const getReqBodySchema = (schema: z.ZodTypeAny) => z.object({ body: schema })