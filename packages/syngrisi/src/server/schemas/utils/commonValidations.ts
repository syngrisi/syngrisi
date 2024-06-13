import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import VersionSchema from '@schemas/common/Version.schema';
extendZodWithOpenApi(z);

const mongooseIdRegex = /^[0-9a-fA-F]{24}$/;
const id = z
  .string()
  .regex(mongooseIdRegex, {
    message: 'Invalid Mongoose ObjectId format: /^[0-9a-fA-F]{24}$/',
  })
  .openapi({
    description: 'baseline ID',
    example: "6bbF35cAB3C59dA969edAe79"
  });

export const commonValidations = {
  id,
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
  // TODO: workaround TBD
  date: z.string().refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, {
    message: 'Invalid date format'
  }),
  paramsId: { params: z.object({ id }) },
};
