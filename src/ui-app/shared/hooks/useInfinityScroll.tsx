/* eslint-disable */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { IFirstPagesQuery, IPagesQuery } from '../interfaces/logQueries';
import ILog from '../interfaces/ILog';
import { errorMsg } from '../utils';
import { GenericService } from '../services';

interface IIScrollParams {
    resourceName: string,
    baseFilterObj?: { [key: string]: any },
    filterObj?: { [key: string]: any },
    newestItemsFilterKey: string,
    sortBy: string,
}

export default function useInfinityScroll(
    {
        resourceName,
        baseFilterObj = {},
        filterObj = {},
        newestItemsFilterKey,
        sortBy,
    }: IIScrollParams,
) {

    /**
     * this query is for getting info about current first page start position
     * for example particular timestamp, to not to mix records that were at the moment when user to open the page
     * and the new records.
     * also it get metadata, like page counts, current page, etc. to use them for example in inf.scroll affix.
     */
    const firstPageQuery = useQuery(
        [
            'logs_infinity_first_page',
            resourceName,
        ],
        () => GenericService.get(
            resourceName,
            baseFilterObj,
            {
                page: '1',
                limit: '1',
            },
            'firstPageQuery'
        ),
        {
            enabled: false,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    ) as IFirstPagesQuery<ILog>;


    const firstPageData: { [key: string]: string | undefined } = useMemo(() => ({
        newestItemsFilterValue: (newestItemsFilterKey && firstPageQuery?.data?.results?.length)
            ? firstPageQuery?.data?.results[0][newestItemsFilterKey]
            : undefined,
        totalPages: firstPageQuery?.data?.totalPages,
        totalResults: firstPageQuery?.data?.totalResults,
        timestamp: firstPageQuery?.data?.timestamp,
    }), [firstPageQuery?.data?.timestamp]);

    const newestItemsFilter = (newestItemsFilterKey && firstPageData.newestItemsFilterValue)
        ? { [newestItemsFilterKey]: { $lte: firstPageData.newestItemsFilterValue } }
        : {};

    const newRequestFilter = useMemo(() => {
            return {
                $and: [
                    baseFilterObj,
                    newestItemsFilter,
                    // { [newestItemsFilterKey]: { $lte: new Date(firstPageData.newestItemsFilterValue!) } },
                    // { [newestItemsFilterKey]: { $lte: firstPageData.newestItemsFilterValue! } },
                    filterObj || {},
                ],
            };
        }, [
            firstPageData.timestamp,
        ]
    );

    const infinityQuery: IPagesQuery<ILog> = useInfiniteQuery(
        [
            'logs_infinity_pages',
            resourceName,
            firstPageData.timestamp,
        ],
        ({ pageParam = 1 }) => GenericService.get(
            resourceName,
            newRequestFilter,
            {
                limit: String(20),
                page: pageParam,
                sortBy,
                populate: 'checks',
            },
            'infinityQuery'
        ),
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page >= lastPage.totalPages) return undefined;
                return lastPage.page + 1;
            },
            refetchOnWindowFocus: false,
            enabled: true,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    ) as IPagesQuery<ILog>;

    const newestItemsQuery = useQuery(
        [
            'logs_infinity_newest_pages',
            resourceName,
            firstPageData.newestItemsFilterValue
        ],
        () => {
            const beforeNewestItemsFilter = (newestItemsFilterKey && firstPageData.newestItemsFilterValue)
                ? { [newestItemsFilterKey]: { $gt: firstPageData.newestItemsFilterValue } }
                : {};

            return GenericService.get(
                resourceName,
                {
                    $and: [
                        beforeNewestItemsFilter,
                        baseFilterObj,
                    ],
                },
                {
                    limit: String(0),
                },
                'newestItemsQuery'
            );
        },
        {
            enabled: infinityQuery.data?.pages?.length! > 0,
            // @ts-ignore
            refetchInterval: import.meta.env.MODE === 'development' ? Infinity : 7000,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );
    return { firstPageQuery, infinityQuery, newestItemsQuery };
}
