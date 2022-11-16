/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import useInfinityScroll from '../../../../../../../shared/hooks/useInfinityScroll';
import { useParams } from '../../../../../../hooks/useParams';

export function useRelatedChecks(checkData: any) {
    const { query } = useParams();
    const [relatedActiveCheckId, setRelatedActiveCheckId] = useState<string>(checkData._id);
    const [sortBy, setSortBy] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [relatedFilter, setRelatedFilter] = useState({ name: checkData.name });

    const filterObj: any = relatedFilter;
    if (query.app) filterObj.app = { $oid: query?.app || '' };

    const relatedChecksQuery = useInfinityScroll(
        {
            resourceName: 'checks',
            filterObj,
            firstPageQueryUniqueKey: checkData._id,
            infinityScrollLimit: 10,
            sortBy: `${sortBy}:${sortOrder}`,
        },
    );

    const { data } = relatedChecksQuery.infinityQuery;
    const relatedFlatChecksData = data ? data.pages.flat().map((x: any) => x.results).flat() : [];
    return {
        relatedActiveCheckId,
        setRelatedActiveCheckId,
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
