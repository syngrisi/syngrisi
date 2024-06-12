
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { QueryFilterSchema } from './QueryFilter.schema';
import { commonValidations } from '../utils';
export const registry = new OpenAPIRegistry();
extendZodWithOpenApi(z);

export const ReqGetMultipleSchema =
    z.object({
        filter: QueryFilterSchema.optional(),
        limit: commonValidations.positiveNumberString.optional().openapi({example: "10"}),
        page: commonValidations.positiveNumberString.optional().openapi({example: "2"}),
        sortBy: z.string().optional().openapi({example: "name"}),
        populate: z.string().optional().openapi({example: "check"}),
    });

