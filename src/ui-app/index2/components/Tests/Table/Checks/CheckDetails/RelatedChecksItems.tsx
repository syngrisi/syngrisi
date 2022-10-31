/* eslint-disable no-underscore-dangle,indent */
import * as React from 'react';
import { RelatedCheckItem } from './RelatedCheckItem';

interface Props {
    infinityQuery: any
    relatedActiveCheck: any
    setRelatedActiveCheck: any
}

export function RelatedChecksItems({ infinityQuery, relatedActiveCheck, setRelatedActiveCheck }: Props) {
    return infinityQuery.data
        ? (infinityQuery.data.pages.map(
                (page: any) => (
                    page.results.map(
                        (item: any, index: number) => (
                            <RelatedCheckItem
                                checkData={item}
                                activeCheck={relatedActiveCheck}
                                setActiveCheck={setRelatedActiveCheck}
                                key={item._id}
                            />
                        ),
                    )
                ),
            )
        )
        : [];
}
