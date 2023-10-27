"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionParamsGuard = void 0;
const sessionParamsGuard = (params, functionName, schema) => {
    const result = schema.safeParse(params);
    if (result.success) {
        return true;
    }
    else {
        const errorDetails = result.error.format();
        throw new Error(`Invalid '${functionName}' parameters: \n${JSON.stringify(errorDetails, null, 2)}
        \n ${JSON.stringify(result.error, null, 2)}`);
    }
};
exports.sessionParamsGuard = sessionParamsGuard;
