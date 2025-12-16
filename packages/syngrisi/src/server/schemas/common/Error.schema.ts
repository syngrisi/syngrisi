import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ApiErrorSchema = z.object({
    name: z.string().openapi({
      description: 'Name of the error type',
      example: 'Error'
    }),
    message: z.string().openapi({
      description: 'Detailed message describing the error',
      example: "cannot remove run with id: '6651e46e85f83573a821d1f4', not found"
    }),
    stacktrace: z.string().openapi({
      description: 'Stack trace of the error for debugging purposes',
      example: "Error: cannot remove run with id: '6651e46e85f83573a821d1f4', not found\\n    at Object.remove2 (/Users/exadel/Projects/SYNGRISI/packages/syngrisi/src/server/services/run.service.ts:27:15)\\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at /Users/exadel/Projects/SYNGRISI/packages/syngrisi/src/server/controllers/runs.controller.ts:25:20"
    })
  });