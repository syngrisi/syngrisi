import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Stack } from '@mantine/core';
import { SuitesDummySkeleton } from '@index/components/Navbar/Skeletons/SuitesDummySkeleton';
import { RunsDummySkeleton } from '@index/components/Navbar/Skeletons/RunsDummySkeleton';
import SimpleDummySkeleton from '@index/components/Navbar/Skeletons/SimpleDummySkeleton';

interface Props {
    infinityQuery: any,
    itemType?: string,
    num?: number,
    itemClass: string
}

function SkeletonWrapper({ infinityQuery, itemType, num, itemClass }: Props) {
    const { ref, inView } = useInView();

    const DummySkeletons = (key: string) => {
        const map: { [key: string]: any } = {
            runs: RunsDummySkeleton,
            suites: SuitesDummySkeleton,
        };
        return map[key] || SimpleDummySkeleton;
    };

    useEffect(() => {
        if (inView && infinityQuery) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    const DummySkeleton = DummySkeletons(itemType!);
    return (
        <Stack ref={ref} spacing={0}>
            {
                (infinityQuery === null || infinityQuery.hasNextPage)
                && (
                    <DummySkeleton num={num} itemClass={itemClass} />
                )
            }
        </Stack>
    );
}

export default SkeletonWrapper;
