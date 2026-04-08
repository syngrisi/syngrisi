/* eslint-disable */
import { useInfiniteQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';

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
        {
            queryKey: [
                'related_checks_infinity_pages',
                ...infinityUniqueKey,
                filterObj
            ],
            queryFn: ({ pageParam }) => GenericService.get(
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
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                if (lastPage.page >= lastPage.totalPages) return undefined;
                return lastPage.page + 1;
            },
            refetchOnWindowFocus: false,
            enabled: filterObj !== null,
        },
    ) as any;

    return { infinityQuery };
}
