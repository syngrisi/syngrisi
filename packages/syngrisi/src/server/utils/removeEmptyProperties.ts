export const removeEmptyProperties = (obj: { [key: string]: string }): { [key: string]: string } =>
    Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, v]) => (v != null) && (v !== ''))
    );
