"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredIdentOptionsSchema = void 0;
const zod_1 = require("zod");
// export const BaselineParamsSchema = z.object({
//     // ident
//     name: z.string().min(1), //
//     viewport: z.string().min(2).optional(),
//     browserName: z.string().min(2).optional(),
//     os: z.string().min(1).optional(),
//     app: z.string().min(1).optional(),
//     branch: z.string().min(1).optional(),
// })
//
// export type BaselineParams = z.infer<typeof BaselineParamsSchema>;
exports.RequiredIdentOptionsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    viewport: zod_1.z.string().min(3),
    browserName: zod_1.z.string().min(1),
    os: zod_1.z.string().min(1),
    app: zod_1.z.string().min(1),
    branch: zod_1.z.string().min(1),
    // imghash: z.string().length(128)
});
// export type RequiredIdentOptions = z.infer<typeof RequiredIdentOptionsSchema>;
