/**
 * Native URLSearchParams-based query string utilities
 * Replaces query-string package with native browser APIs
 */

type QueryObject = Record<string, string | number | boolean | null | undefined>;

/**
 * Stringify an object to a query string (without leading '?')
 * Skips null/undefined values
 */
export function stringify(obj: QueryObject): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
        }
    }

    return params.toString();
}

/**
 * Parse a query string to an object
 * Handles strings with or without leading '?'
 */
export function parse(queryString: string): Record<string, string> {
    const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const params = new URLSearchParams(cleanQuery);

    return Object.fromEntries(params.entries());
}

/**
 * Default export for compatibility with query-string import style
 */
export default {
    stringify,
    parse,
};
