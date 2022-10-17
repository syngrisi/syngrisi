import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Stack } from '@mantine/core';
import RunsDummySkeleton from './RunsDummySkeleton';
import SimpleDummySkeleton from './SimpleDummySkeleton';

interface Props {
    infinityQuery: any,
    itemType?: string,
    num?: number,
}

function SkeletonWrapper({ infinityQuery, itemType, num }: Props) {
    const { ref, inView } = useInView();

    const DummySkeletons = (key: string) => {
        const map = {
            runs: RunsDummySkeleton,
            suites: RunsDummySkeleton,
        };
        return map[key] || SimpleDummySkeleton;
    };

    useEffect(() => {
        if (inView && infinityQuery) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    const DummySkeleton = DummySkeletons(itemType);
    return (
        <Stack ref={ref}>
            {
                (infinityQuery === null || infinityQuery.hasNextPage)
                && (
                    <DummySkeleton num={num} />
                )
            }
        </Stack>
    );
}

export default SkeletonWrapper;
