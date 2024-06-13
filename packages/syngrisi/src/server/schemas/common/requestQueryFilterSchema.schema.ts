import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const requestQueryFilterSchema = z
    .string()
    .optional()
    .refine((data) => {
        if(!data) return false
        try {
            const parsed = JSON.parse(data);
            const valueSchema = z.union([z.string(), z.number(), z.boolean()]);
            const schema = z.record(valueSchema);
            schema.parse(parsed);
            return true;
        } catch (e) {
            return false;
        }
    }, {
        message: "Invalid JSON string or does not match the required schema",
    })
    .openapi({ example: '{"key1": "value1", "key2": 123, "key3": true}' });

