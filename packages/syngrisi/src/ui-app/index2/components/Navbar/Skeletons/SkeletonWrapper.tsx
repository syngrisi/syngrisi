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

    // Handle case when content doesn't overflow the scroll container.
    // When content fits entirely, the user cannot scroll, so onBottomReached on
    // ScrollArea won't fire. In that case, auto-fetch the next page.
    useEffect(() => {
        if (!root || infinityQuery === null) return;

        const checkShouldLoad = () => {
            if (!root) return;
            if (!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage) return;

            const { scrollHeight, clientHeight } = root;
            // Only auto-fetch if content doesn't overflow
            if (scrollHeight <= clientHeight + 5) {
                infinityQuery.fetchNextPage();
            }
        };

        // Delay to let DOM render before measuring
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                checkShouldLoad();
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
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
