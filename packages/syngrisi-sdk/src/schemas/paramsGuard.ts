import { ZodObject } from 'zod';

export const paramsGuard = (params: any, functionName: string, schema: ZodObject<any>) => {
    const result = schema.safeParse(params)
    if (result.success) {
        return true
    } else {
        const errorDetails = result.error.format()
        throw new Error(`
        Invalid '${functionName}' parameters: \n${JSON.stringify(errorDetails, null, 2)}
        \n error: ${result.error?.stack || result.error}
        \n params: ${JSON.stringify(params, null, 2)}
        `)
    }
}
