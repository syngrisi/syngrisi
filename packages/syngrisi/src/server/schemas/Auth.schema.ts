import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { commonValidations } from './utils';

extendZodWithOpenApi(z);
export const AuthLoginSchema = z.object({
    username: commonValidations.username,
    password: commonValidations.password
});

export const AuthLoginSuccessRespSchema = z.object({
    message: z.literal("success")
});

export const AuthChangePasswordSchema = z.object({
    currentPassword: commonValidations.password,
    newPassword: commonValidations.password,
});

export const AuthChangePasswordFirstRunSchema = z.object({
    // currentPassword: commonValidations.password,
    newPassword: commonValidations.password,
});


export const AuthApiKeyRespSchema = z.object({
    apikey: z.string().regex(/^[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}-[A-Z0-9]{7}$/).openapi({ example: 'J3QQ400-H7H2V00-2HCH400-M3HK800' }),
});

export const AuthLogoutRespSchema = z.object({
    message: z.literal("success")
});
