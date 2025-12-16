export const removeEmptyProperties = (obj: { [key: string]: unknown }): { [key: string]: unknown } =>
    Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, v]) => (v != null) && (v !== ''))
    );
