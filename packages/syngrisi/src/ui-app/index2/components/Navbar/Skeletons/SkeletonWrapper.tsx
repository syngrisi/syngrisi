import React, { useEffect, useState, useRef } from 'react';
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
    const [root, setRoot] = useState<HTMLElement | null>(null);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const skeletonRef = useRef<HTMLDivElement | null>(null);

    // Poll for scrollRootRef.current until it becomes available
    useEffect(() => {
        if (root) return;

        const checkForRoot = () => {
            if (scrollRootRef?.current && scrollRootRef.current !== root) {
                setRoot(scrollRootRef.current);
                if (checkIntervalRef.current) {
                    clearInterval(checkIntervalRef.current);
                    checkIntervalRef.current = null;
                }
            }
        };

        checkForRoot();

        if (!root) {
            checkIntervalRef.current = setInterval(checkForRoot, 250);
        }

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [scrollRootRef, root]);

    // Use scroll-based detection instead of IntersectionObserver
    useEffect(() => {
        if (!root || infinityQuery === null) return;

        const checkShouldLoad = () => {
            if (!skeletonRef.current || !root) return;
            if (!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage) return;

            const rootRect = root.getBoundingClientRect();
            const skeletonRect = skeletonRef.current.getBoundingClientRect();

            // Load more if skeleton is within 400px of viewport bottom
            const margin = 400;
            const isNearViewport = skeletonRect.top < rootRect.bottom + margin;

            if (isNearViewport) {
                infinityQuery.fetchNextPage();
            }
        };

        const handleScroll = () => {
            checkShouldLoad();
        };

        // Check immediately on mount/update
        checkShouldLoad();

        root.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            root.removeEventListener('scroll', handleScroll);
        };
    }, [root, infinityQuery?.hasNextPage, infinityQuery?.isFetchingNextPage]);

    const DummySkeletons = (key: string) => {
        const map: { [key: string]: any } = {
            runs: RunsDummySkeleton,
            suites: SuitesDummySkeleton,
        };
        return map[key] || SimpleDummySkeleton;
    };

    const DummySkeleton = DummySkeletons(itemType!);
    return (
        <Stack ref={skeletonRef} gap={0}>
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
