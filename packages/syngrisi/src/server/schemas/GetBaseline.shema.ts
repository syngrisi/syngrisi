import { z } from 'zod';

export const RequiredIdentOptionsSchema = z.object({
    name: z.string().min(1),
    viewport: z.string().min(3),
    browserName: z.string().min(1),
    os: z.string().min(1),
    app: z.string().min(1),
    branch: z.string().min(1),
})

export const IdentJSONStringSchema = z
    .string()
    .optional()
    .refine((data) => {
        if (!data) return false;
        try {
            const parsed = JSON.parse(data);
            RequiredIdentOptionsSchema.parse(parsed); // Проверяем поля внутри объекта
            return true;
        } catch (e) {
            return false;
        }
    }, {
        message: "Invalid JSON string or does not match the required schema",
    })
    .openapi({
        description: "baseline filter based on ident",
        example: '{"name": "Login page", "viewport": "1366x768", "browserName": "chrome", "os": "macOS", "app": "My App", "branch": "master"}',
    });

export type RequiredIdentOptions = z.infer<typeof RequiredIdentOptionsSchema>;
