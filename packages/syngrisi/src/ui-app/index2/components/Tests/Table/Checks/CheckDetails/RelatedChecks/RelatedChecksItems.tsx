/* eslint-disable no-underscore-dangle,indent */
import * as React from 'react';
import { RelatedCheckItem } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedCheckItem';

interface Props {
    infinityQuery: any
    relatedActiveCheckId: any
    setRelatedActiveCheckId: any
}

export function RelatedChecksItems({ infinityQuery, relatedActiveCheckId, setRelatedActiveCheckId }: Props) {
    return infinityQuery.data
        ? (infinityQuery.data.pages.map(
                (page: any) => (
                    page.results.map(
                        // eslint-disable-next-line no-unused-vars
                        (item: any, index: number) => (
                            <RelatedCheckItem
                                checkData={item}
                                activeCheckId={relatedActiveCheckId}
                                setRelatedActiveCheckId={setRelatedActiveCheckId}
                                key={item._id}
                                index={index}
                            />
                        ),
                    )
                ),
            )
        )
        : [];
}
