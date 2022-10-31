/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import useInfinityScroll from '../../../../../../../shared/hooks/useInfinityScroll';

export function useRelatedChecks(checkData: any) {
    const [relatedActiveCheck, setRelatedActiveCheck] = useState(checkData._id);
    const [sortBy, setSortBy] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [relatedFilter, setRelatedFilter] = useState({ name: checkData.name });

    const relatedChecksQuery = useInfinityScroll(
        {
            resourceName: 'checks',
            filterObj: relatedFilter,
            firstPageQueryUniqueKey: checkData._id,
            infinityScrollLimit: 10,
            sortBy: `${sortBy}:${sortOrder}`,
        },
    );

    const { data } = relatedChecksQuery.infinityQuery;
    const relatedFlatChecksData = data ? data.pages.flat().map((x: any) => x.results).flat() : [];
    return {
        relatedActiveCheck,
        setRelatedActiveCheck,
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
