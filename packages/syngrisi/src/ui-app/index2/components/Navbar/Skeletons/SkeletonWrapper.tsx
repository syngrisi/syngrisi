import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Stack } from '@mantine/core';
import { SuitesDummySkeleton } from '@index/components/Navbar/Skeletons/SuitesDummySkeleton';
import { RunsDummySkeleton } from '@index/components/Navbar/Skeletons/RunsDummySkeleton';
import SimpleDummySkeleton from '@index/components/Navbar/Skeletons/SimpleDummySkeleton';

interface Props {
    infinityQuery: any,
    itemType?: string,
    num?: number,
    itemClass: string,
    scrollRootRef?: React.RefObject<HTMLDivElement>
}

function SkeletonWrapper({ infinityQuery, itemType, num, itemClass, scrollRootRef }: Props) {
    const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        if (scrollRootRef?.current) {
            setScrollRoot(scrollRootRef.current);
            return;
        }

        const fallbackRoot = document.querySelector('[data-test="navbar-scroll-area"]');
        if (fallbackRoot instanceof HTMLElement) {
            setScrollRoot(fallbackRoot);
        }
    }, [scrollRootRef]);

    const { ref, inView } = useInView({
        root: scrollRoot,
        rootMargin: '0px',
        threshold: 0.1,
    });

    const DummySkeletons = (key: string) => {
        const map: { [key: string]: any } = {
            runs: RunsDummySkeleton,
            suites: SuitesDummySkeleton,
        };
        return map[key] || SimpleDummySkeleton;
    };

    useEffect(() => {
        if (inView && infinityQuery && !infinityQuery.isFetchingNextPage) {
            infinityQuery.fetchNextPage();
        }
    }, [inView, infinityQuery?.isFetchingNextPage]);

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
