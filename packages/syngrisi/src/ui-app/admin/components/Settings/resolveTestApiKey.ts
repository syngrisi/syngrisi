// The stored API key is returned masked as '***'. When building the "Test connection"
// payload, a masked key must be treated as "not provided" so the caller can omit it and
// let the server fall back to the stored secret — sending '***' verbatim tests with a
// bogus key. Returns undefined for a masked/empty key, otherwise the real value.
export const MASKED_API_KEY = '***';
export function resolveTestApiKey(apiKey: string | undefined): string | undefined {
    return !apiKey || apiKey === MASKED_API_KEY ? undefined : apiKey;
}
