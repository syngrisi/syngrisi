import { z } from 'zod';
import { commonValidations } from './commonValidations';
export const createRequestParamsSchema = (schema: z.ZodTypeAny) => z.object({ params: schema })

export const getByIdParamsSchema = (id = 'id') => createRequestParamsSchema(
    z.object({ [id]: commonValidations.id })
);
