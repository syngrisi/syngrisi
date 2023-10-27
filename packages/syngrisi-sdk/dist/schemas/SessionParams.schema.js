"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionParamsSchema = void 0;
const zod_1 = require("zod");
exports.SessionParamsSchema = zod_1.z.object({
    run: zod_1.z.string().min(1),
    runident: zod_1.z.string().min(1),
    test: zod_1.z.string().min(1),
    branch: zod_1.z.string().min(1),
    app: zod_1.z.string().min(1),
    suite: zod_1.z.string().min(1).optional(),
    os: zod_1.z.string().min(1).optional(),
    viewport: zod_1.z.string().min(3).optional(),
    browserName: zod_1.z.string().min(1).optional(),
    browserVersion: zod_1.z.string().min(1).optional(),
    browserFullVersion: zod_1.z.string().min(1).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
}).catchall(zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string()), zod_1.z.undefined()]));
