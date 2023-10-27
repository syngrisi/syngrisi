"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredIdentOptionsSchema = exports.BaselineParamsSchema = void 0;
const zod_1 = require("zod");
exports.BaselineParamsSchema = zod_1.z.object({
    // ident
    name: zod_1.z.string().min(1),
    viewport: zod_1.z.string().min(2).optional(),
    browserName: zod_1.z.string().min(2).optional(),
    os: zod_1.z.string().min(1).optional(),
    app: zod_1.z.string().min(1).optional(),
    branch: zod_1.z.string().min(1).optional(),
});
exports.RequiredIdentOptionsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    viewport: zod_1.z.string().min(3),
    browserName: zod_1.z.string().min(1),
    os: zod_1.z.string().min(1),
    app: zod_1.z.string().min(1),
    branch: zod_1.z.string().min(1),
    imghash: zod_1.z.string().length(128)
});
