import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LogsService } from '../services/logs.service';
import { IFirstPagesQuery, IPagesQuery } from '../interfaces/logQueries';
import ILog from '../interfaces/ILog';

export default function useInfinityScroll(searchParams: URLSearchParams) {
    const firstPageQuery = useQuery(
        ['logs_infinity_first_page'],
        () => LogsService.getLogs(
            {},
            {
                page: '1',
                limit: '1',
            },
        ),
        {
            enabled: false,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        },
    ) as IFirstPagesQuery<ILog>;

    const lastLogTimestamp = firstPageQuery?.data?.results?.length
        ? firstPageQuery?.data?.results[0].timestamp
        : undefined;

    const firstPageData: { [key: string]: string | undefined } = useMemo(() => ({
        lastLogTimestamp,
        totalPages: firstPageQuery?.data?.totalPages,
        totalResults: firstPageQuery?.data?.totalResults,
    }), [lastLogTimestamp]);

    const timestampUpdatedFilter = useMemo(() => {
        const prevFilterObj = JSON.parse(searchParams.get('filter')!);
        return {
            $and: [
                { timestamp: { $lte: new Date(firstPageData.lastLogTimestamp!) } },
                prevFilterObj || {},
            ],
        };
    }, [firstPageData.lastLogTimestamp, firstPageQuery.status, searchParams.toString()]);

    const infinityQuery: IPagesQuery<ILog> = useInfiniteQuery(
        ['logs_infinity_pages', firstPageData.lastLogTimestamp, searchParams.toString()],
        ({ pageParam = 1 }) => LogsService.getLogs(
            timestampUpdatedFilter,
            {
                limit: String(20),
                page: pageParam,
                sortBy: searchParams.get('sortBy') || undefined,
            },
        ),
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page >= lastPage.totalPages) return undefined;
                return lastPage.page + 1;
            },
            refetchOnWindowFocus: false,
            enabled: !!firstPageData.lastLogTimestamp && !!timestampUpdatedFilter,
        },
    ) as IPagesQuery<ILog>;

    const newestItemsQuery = useQuery(
        ['logs_infinity_newest_pages', firstPageData.lastLogTimestamp],
        () => LogsService.getLogs(
            { timestamp: { $gt: firstPageData.lastLogTimestamp } },
            {
                limit: String(0),
            },
        ),
        {
            enabled: infinityQuery.data?.pages?.length! > 0,
            refetchInterval: 3000,
        },
    );
    return { firstPageQuery, infinityQuery, newestItemsQuery };
}
