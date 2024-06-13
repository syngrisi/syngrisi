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

            // Define a recursive schema to support nested objects and arrays
            const valueSchema = z.lazy(() => z.union([
                z.string(),
                z.number(),
                z.boolean(),
                z.array(z.any()),
                z.record(z.any())
            ]));

            const schema = z.record(valueSchema);
            schema.parse(parsed);
            return true;
        } catch (e) {
            return false;
        }
    }, {
        message: "Invalid JSON string or does not match the required schema",
    })
    .openapi({ example: '{"key1": "value1", "key2": 123, "key3": true, "$and":[{"name":"CheckName"}]}' });
