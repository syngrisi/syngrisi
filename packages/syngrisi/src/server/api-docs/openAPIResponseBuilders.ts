import StatusCodes  from 'http-status';
import { z } from 'zod';
import { ServiceResponsePaginationSchema } from './serviceResponse';

export function createApiResponse(schema: z.ZodTypeAny, description: string, statusCode: number = StatusCodes.OK) {
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

export function createApiEmptyResponse(description: string, statusCode: number = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
    },
  };
}


export function createPaginatedApiResponse(schema: z.ZodTypeAny, description: string, statusCode:number = StatusCodes.OK) {
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
