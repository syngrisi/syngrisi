/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeEmptyProperties = (obj: { [key: string]: any }): { [key: string]: any } =>
    Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, v]) => (v != null) && (v !== ''))
    );
