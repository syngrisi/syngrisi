import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from '@schemas/utils';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const AppInfoRespSchema = z.object({
    version: commonValidations.version,
});

export const AppRespSchema = z.object({
    _id: commonValidations.id,
    id: commonValidations.id,
    name: z.string().min(1, 'AppRespSchema: the name is empty').openapi({ example: "Admin Panel" }),
});
