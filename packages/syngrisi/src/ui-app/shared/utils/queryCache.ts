type PaginatedResult<T> = {
    results?: T[];
    page?: number;
    limit?: number;
    totalPages?: number;
    totalResults?: number;
    timestamp?: string | number;
};

type InfinitePage<T> = PaginatedResult<T>;

const getItemId = (item: any): string | undefined => item?._id || item?.id;

export function replaceItemInPaginatedResult<T extends Record<string, any>>(
    data: PaginatedResult<T> | undefined,
    item: T,
): PaginatedResult<T> | undefined {
    if (!data?.results?.length) return data;

    const targetId = getItemId(item);
    if (!targetId) return data;

    return {
        ...data,
        results: data.results.map((current) => (
            getItemId(current) === targetId
                ? { ...current, ...item }
                : current
        )),
    };
}

export function removeItemFromPaginatedResult<T extends Record<string, any>>(
    data: PaginatedResult<T> | undefined,
    itemId: string,
): PaginatedResult<T> | undefined {
    if (!data?.results?.length) return data;

    const nextResults = data.results.filter((current) => getItemId(current) !== itemId);
    if (nextResults.length === data.results.length) return data;

    return {
        ...data,
        results: nextResults,
        totalResults: typeof data.totalResults === 'number'
            ? Math.max(0, data.totalResults - 1)
            : data.totalResults,
    };
}

export function replaceItemInInfinitePages<T extends Record<string, any>>(
    data: { pages?: InfinitePage<T>[]; pageParams?: unknown[] } | undefined,
    item: T,
): { pages?: InfinitePage<T>[]; pageParams?: unknown[] } | undefined {
    if (!data?.pages?.length) return data;

    return {
        ...data,
        pages: data.pages.map((page) => replaceItemInPaginatedResult(page, item) as InfinitePage<T>),
    };
}

