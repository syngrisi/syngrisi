"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsGuard = void 0;
const paramsGuard = (params, functionName, schema) => {
    const result = schema.safeParse(params);
    if (result.success) {
        return true;
    }
    else {
        const errorDetails = result.error.format();
        throw new Error(`
        Invalid '${functionName}' parameters: ${JSON.stringify(errorDetails)}
        \n error: ${result.error?.stack || result.error}
        \n params: ${JSON.stringify(params, null, 2)}
        `);
    }
};
exports.paramsGuard = paramsGuard;
