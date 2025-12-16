import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Base version schema without transform - for OpenAPI
export const VersionBaseSchema = z.string()
  .regex(/^\d+\.\d+\.\d+$/, 'Version must be in the format "x.y.z"');

// Transformed version schema
const VersionSchema = VersionBaseSchema
  .transform((value) => {
    const parts = value.split('.');
    return {
      major: parseInt(parts[0]),
      minor: parseInt(parts[1]),
      patch: parseInt(parts[2]),
    };
  });

export default VersionSchema;