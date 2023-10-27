"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckOptionsSchema = void 0;
const zod_1 = require("zod");
exports.CheckOptionsSchema = zod_1.z.object({
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    name: zod_1.z.string().min(1),
    viewport: zod_1.z.string().min(3),
    browserName: zod_1.z.string().min(1),
    os: zod_1.z.string().min(1),
    app: zod_1.z.string().min(1),
    branch: zod_1.z.string().min(1),
    testId: zod_1.z.string().min(1),
    suite: zod_1.z.string().min(1),
    browserVersion: zod_1.z.string().min(1),
    browserFullVersion: zod_1.z.string().min(1),
    hashCode: zod_1.z.string().length(128).optional(),
    domDump: zod_1.z.any().optional(), // Replace with appropriate schema if possible
});
