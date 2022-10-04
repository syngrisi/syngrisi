/* eslint-disable */
import React, { FunctionComponent, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { List, Skeleton } from '@mantine/core';

interface Props {
    infinityQuery: any,
    itemType?: any,
}


const InfinityScrollSkeleton: FunctionComponent<Props> = ({ infinityQuery, itemType = 'runs' }) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    return (
        <List ref={ref} listStyleType="none">

            {infinityQuery.hasNextPage && (

                Object.keys(new Array(6).fill('')).map(x =>
                    (<List.Item key={x} style={{ height: 72 }}>
                        <Skeleton height={20} radius="sm" />
                    </List.Item>)
                )
            )}
        </List>
    );
};

export default InfinityScrollSkeleton;
