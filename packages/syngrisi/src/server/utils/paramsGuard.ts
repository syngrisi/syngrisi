/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodObject, SafeParseError } from 'zod';

export const paramsGuard = (params: any, functionName: string, schema: ZodObject<any>) => {
    const result = schema.safeParse(params);
    if (result.success) {
        return true;
    } else {
        const errorDetails = (result as SafeParseError<any>).error.format();
        throw new Error(`
        Invalid '${functionName}' parameters: ${JSON.stringify(errorDetails)}
        \n error: ${(result as SafeParseError<any>).error.stack || (result as SafeParseError<any>).error}
        \n params: ${JSON.stringify(params, null, 2)}
        `);
    }
}
