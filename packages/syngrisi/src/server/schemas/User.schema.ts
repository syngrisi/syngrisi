import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from '@schemas/utils';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;


export const UserSchema = z.object({
  username: z.string().min(1, 'UserSchema: the username name is empty').openapi({ example: "johndoe@example.com" }),
  firstName: z.string().min(1, 'UserSchema: the firstName name is empty').openapi({ example: "John" }),
  lastName: z.string().min(1, 'UserSchema: the lastName name is empty').openapi({ example: "Doe" }),
  role: z.enum(['admin', 'reviewer', 'user']),
  password: z.string().optional(),
  token: z.string().optional(),
  apiKey: z.string().optional(),
  createdDate: z.date().optional().openapi({ example: "2024-05-25T15:23:21.150Z" }),
  updatedDate: z.date().optional().openapi({ example: "2024-05-26T15:23:21.150Z" }),
  expiration: z.date().optional(),
  meta: z.record(z.string(), z.any()).optional(),
  _id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
  id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
})

export const UserCreateReqSchema =
  z.object({
    username: z.string().min(1, 'UserSchema: the username name is empty').openapi({ example: "johndoe@example.com" }),
    firstName: z.string().min(1, 'UserSchema: the firstName name is empty').openapi({ example: "John" }),
    lastName: z.string().min(1, 'UserSchema: the lastName name is empty').openapi({ example: "Doe" }),
    role: z.enum(['admin', 'reviewer', 'user']),
    email: z.string().optional(),
    password: z.string(),
  })

export type UserCreateReq = z.infer<typeof UserCreateReqSchema>

export const UserCurrentRespSchema = z.object({
  _id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
  id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
  username: z.string().min(1, 'UserSchema: the username name is empty').openapi({ example: "johndoe@example.com" }),
  firstName: z.string().min(1, 'UserSchema: the firstName name is empty').openapi({ example: "John" }),
  lastName: z.string().min(1, 'UserSchema: the lastName name is empty').openapi({ example: "Doe" }),
  role: z.enum(['admin', 'reviewer', 'user']),
})

export const UserGetRespSchema = UserCurrentRespSchema;

export const UserCreateRespSchema = z.object({
  username: z.string().min(1, 'UserSchema: the username name is empty').openapi({ example: "johndoe@example.com" }),
  firstName: z.string().min(1, 'UserSchema: the firstName name is empty').openapi({ example: "John" }),
  lastName: z.string().min(1, 'UserSchema: the lastName name is empty').openapi({ example: "Doe" }),
  role: z.enum(['admin', 'reviewer', 'user']),
  createdDate: z.date().optional().openapi({ example: "2024-05-25T15:23:21.150Z" }),
  updatedDate: z.date().optional().openapi({ example: "2024-05-26T15:23:21.150Z" }),
  _id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
  id: commonValidations.id.openapi({ example: "6bbF35cAB3C59dA969edAe79" }),
})

