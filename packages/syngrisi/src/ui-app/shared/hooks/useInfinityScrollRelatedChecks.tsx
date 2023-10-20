/* eslint-disable */
import { useInfiniteQuery } from '@tanstack/react-query';
import { errorMsg } from '../utils';
import { GenericService } from '../services';

interface IIScrollParams {
    resourceName: string
    baseFilterObj?: { [key: string]: any } | null
    filterObj?: { [key: string]: any }
    newestItemsFilterKey?: string
    infinityScrollLimit?: number
    infinityUniqueKey?: any
    sortBy: string
}

export default function useInfinityScrollRelatedChecks(
    {
        resourceName,
        baseFilterObj = {},
        filterObj = {},
        newestItemsFilterKey,
        sortBy,
        infinityScrollLimit = 20,
        infinityUniqueKey
    }: IIScrollParams,
) {

    const infinityQuery: any = useInfiniteQuery(
        [
            'related_checks_infinity_pages',
            // resourceName,
            ...infinityUniqueKey,
            filterObj
        ],
        ({ pageParam = 1 }) => GenericService.get(
            resourceName,
            filterObj,
            {
                limit: String(infinityScrollLimit),
                page: pageParam,
                sortBy,
                populate: 'suite,app,test,baselineId,actualSnapshotId,diffId',
            },
            'relatedChecksInfinityQuery'
        ),
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.page >= lastPage.totalPages) return undefined;
                return lastPage.page + 1;
            },
            refetchOnWindowFocus: false,
            enabled: filterObj !== null,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    ) as any;

    return { infinityQuery };
}
