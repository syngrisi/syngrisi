"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaselineParamsSchema = void 0;
const zod_1 = require("zod");
exports.BaselineParamsSchema = zod_1.z.object({
    // ident
    name: zod_1.z.string(),
    viewport: zod_1.z.string().optional(),
    browserName: zod_1.z.string().optional(),
    os: zod_1.z.string().optional(),
    app: zod_1.z.string().optional(),
    branch: zod_1.z.string().optional(),
    // // non ident
    // tags: z.array(z.string()),
    // test: z.string(),
    // suite: z.string(),
    // run: z.string(),
    // runident: z.string(),
});
