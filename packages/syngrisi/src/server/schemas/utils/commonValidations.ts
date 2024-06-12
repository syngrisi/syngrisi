import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import VersionSchema from '@schemas/common/Version.schema';
extendZodWithOpenApi(z);

const mongooseIdRegex = /^[0-9a-fA-F]{24}$/;

export const commonValidations = {
  id: z
    .string()
    .regex(mongooseIdRegex, {
      message: 'Invalid Mongoose ObjectId format: /^[0-9a-fA-F]{24}$/',
    })
    .openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
  version: VersionSchema.openapi({ example: "1.1.2" }),
  positiveNumberString: z.string().refine(value => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
  }, {
    message: "String must be a positive number or 0"
  }),
  password: z.string()
    .min(6)
    .regex(/(?=.*[0-9])/, "Password must include a number")
    .regex(/(?=.*[a-z])/, "Password must include a lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must include an uppercase letter")
    .refine(value => {
      return /(?=.*[!@#$%^&*(),.?":{}|<>-])/.test(value);
    }, {
      message: "Password must include a special symbol"
    })
    .openapi({ example: "Aa1!IJASSNOJ" }),
  username: z.string().min(1).openapi({ example: "john.doe@example.com" }),
};
