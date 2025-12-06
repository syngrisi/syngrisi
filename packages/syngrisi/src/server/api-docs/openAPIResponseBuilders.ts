import { HttpStatus } from '@utils';
import { z } from 'zod';
import { ServiceResponsePaginationSchema } from './serviceResponse';

export function createApiResponse(schema: z.ZodTypeAny, description: string, statusCode: number = HttpStatus.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        'application/json': {
          schema,
        },
      },
    },
  };
}

export function createApiEmptyResponse(description: string, statusCode: number = HttpStatus.OK) {
  return {
    [statusCode]: {
      description,
    },
  };
}


export function createPaginatedApiResponse(schema: z.ZodTypeAny, description: string, statusCode:number = HttpStatus.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        'application/json': {
          schema: ServiceResponsePaginationSchema(schema),
        },
      },
    },
  };
}
