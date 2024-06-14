
import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { requestQueryFilterSchema } from './requestQueryFilterSchema.schema';
import { commonValidations } from '../utils';
export const registry = new OpenAPIRegistry();
extendZodWithOpenApi(z);

export const RequestPaginationSchema =
    z.object({
        filter: requestQueryFilterSchema.optional(),
        limit: commonValidations.positiveNumberString.optional().openapi({example: "10"}),
        page: commonValidations.positiveNumberString.optional().openapi({example: "1"}),
        sortBy: z.string().optional().openapi({example: "id"}),
        populate: z.string().optional().openapi({example: "test"}),
    });

