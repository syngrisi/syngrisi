/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import useInfinityScrollRelatedChecks from '../../../../../../../shared/hooks/useInfinityScrollRelatedChecks';
import { useParams } from '../../../../../../hooks/useParams';

export function useRelatedChecks(checkData: any) {
    const { query } = useParams();
    const [sortBy, setSortBy] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [relatedFilter, setRelatedFilter] = useState({});

    const filterObj: any = relatedFilter;

    const relatedChecksQuery = useInfinityScrollRelatedChecks(
        {
            resourceName: 'checks',
            filterObj,
            infinityScrollLimit: 10,
            sortBy: `${sortBy}:${sortOrder}`,
            infinityUniqueKey: [checkData._id],
        },
    );

    // eslint-disable-next-line prefer-arrow-callback
    useEffect(function onFilterOrSortChange() {
        if (query.app) filterObj.app = { $oid: query?.app || '' };
        if (Object.keys(filterObj).length < 1) return;
        relatedChecksQuery.infinityQuery.refetch();
    }, [relatedFilter, sortBy, sortOrder, query.app]);
    const { data } = relatedChecksQuery.infinityQuery;

    const relatedFlatChecksData = data ? data.pages.flat().map((x: any) => x.results).flat() : [];
    return {
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        relatedFlatChecksData,
        relatedChecksQuery,
        relatedFilter,
        setRelatedFilter,
    };
}
