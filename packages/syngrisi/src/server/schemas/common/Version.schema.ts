import { z } from 'zod';

const VersionSchema = z.string()
  .regex(/^\d+\.\d+\.\d+$/, 'Version must be in the format "x.y.z"')
  .transform((value) => {
    const parts = value.split('.');
    return {
      major: parseInt(parts[0]),
      minor: parseInt(parts[1]),
      patch: parseInt(parts[2]),
    };
  });

export default VersionSchema;