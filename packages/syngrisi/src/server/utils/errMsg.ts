export const errMsg = (e: unknown) => {
    return String((e instanceof Error) ? e.stack : e)
}