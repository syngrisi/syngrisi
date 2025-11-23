import { z } from 'zod';
import { commonValidations } from './utils';

const LogGetSchema = z.object({
    _id: commonValidations.id,
    level: z.enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).openapi({
        description: 'Log level',
        example: 'info'
    }),
    message: z.string().min(1).openapi({
        description: 'Log message',
        example: 'User logged in'
    }),
    timestamp: commonValidations.date.openapi({
        description: 'Timestamp of the log entry',
        example: '2024-05-26T10:49:19.896Z'
    }),
    meta: z.object({}).optional().openapi({
        description: 'Additional metadata for the log entry',
        example: { userId: '66519e582c2c701cc438ce59' }
    }),
    id: commonValidations.id,
});

const LogCreateSchema = z.object({
    level: z.enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly']).openapi({
        description: 'Log level',
        example: 'info'
    }).optional(),
    message: z.string().min(1).openapi({
        description: 'Log message',
        example: 'User logged in'
    }).optional(),
    meta: z.object({}).optional().openapi({
        description: 'Additional metadata for the log entry',
        example: { userId: '66519e582c2c701cc438ce59' }
    }),
});

const LogCreateRespSchema = commonValidations.success;

const LogDistinctSchema = z.object({
    field: z.string().min(1).openapi({
        description: 'Field name for distinct query',
        example: 'level'
    }),
});

const LogDistinctResponseSchema = z.array(z.string()).openapi({
    description: 'Array of distinct log levels',
    example: ["debug", "error", "info", "warn"]
});


export {
    LogGetSchema,
    LogCreateSchema,
    LogDistinctSchema,
    LogDistinctResponseSchema,
    LogCreateRespSchema
};
