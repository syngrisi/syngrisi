import { z } from 'zod';

const mongooseIdRegex = /^[0-9a-fA-F]{24}$/;

export const commonValidations = {
    id: z
        .string()
        .regex(mongooseIdRegex, {
            message: 'Invalid Mongoose ObjectId format: /^[0-9a-fA-F]{24}$/',
        })
};
