import { z } from 'zod';

export const ServiceResponsePaginationSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    results: z.array(dataSchema.optional()),
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
    totalPages: z.number().openapi({ example: 2 }),
    totalResults: z.number().openapi({ example: 12 }),
    timestamp: z.number().openapi({ example: 1718035239731968 }),
  });
