import { useSearchParams } from 'react-router';
import { useCallback, useMemo, useRef } from 'react';

export type ParamType = 'string' | 'json';
export const StringParam: ParamType = 'string';
export const JsonParam: ParamType = 'json';

export type QueryConfig = Record<string, ParamType>;

function decodeValue(raw: string | null, type: ParamType): any {
    if (raw === null || raw === undefined) return undefined;
    if (type === 'json') {
        try { return JSON.parse(raw); } catch { return undefined; }
    }
    return raw;
}

function encodeValue(value: any, type: ParamType): string | null {
    if (value === null || value === undefined) return null;
    if (type === 'json') return JSON.stringify(value);
    return String(value);
}

export function useQueryParams<T extends QueryConfig>(config: T) {
    const [searchParams, setSearchParams] = useSearchParams();
    const pendingUpdates = useRef<Record<string, any>>({});
    const flushScheduled = useRef(false);

    const query = useMemo(() => {
        const result: Record<string, any> = {};
        for (const [key, type] of Object.entries(config)) {
            result[key] = decodeValue(searchParams.get(key), type);
        }
        return result as { [K in keyof T]: T[K] extends 'json' ? any : string | undefined };
    }, [searchParams]);

    const setQuery = useCallback((updates: Record<string, any>) => {
        Object.assign(pendingUpdates.current, updates);

        if (!flushScheduled.current) {
            flushScheduled.current = true;
            queueMicrotask(() => {
                const batch = { ...pendingUpdates.current };
                pendingUpdates.current = {};
                flushScheduled.current = false;

                setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    for (const [key, value] of Object.entries(batch)) {
                        const type = config[key] || 'string';
                        const encoded = encodeValue(value, type);
                        if (encoded === null) {
                            next.delete(key);
                        } else {
                            next.set(key, encoded);
                        }
                    }
                    return next;
                }, { replace: true });
            });
        }
    }, [config, setSearchParams]);

    return [query, setQuery] as const;
}

export function encodeQueryParams(config: QueryConfig, values: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(values)) {
        const type = config[key] || 'string';
        const encoded = encodeValue(value, type);
        if (encoded !== null) {
            result[key] = encoded;
        }
    }
    return result;
}
