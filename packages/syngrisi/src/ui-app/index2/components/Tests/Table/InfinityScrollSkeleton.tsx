/* eslint-disable indent,react/jsx-indent */
import React, { useEffect, useState, useRef } from 'react';
import { Skeleton } from '@mantine/core';

import { tableColumns } from '@index/components/Tests/Table/tableColumns';

interface Props {
    infinityQuery: any,
    visibleFields: any,
    scrollRootRef?: React.RefObject<HTMLDivElement>
}

function InfinityScrollSkeleton({ infinityQuery, visibleFields, scrollRootRef }: Props) {
    const [root, setRoot] = useState<HTMLElement | null>(null);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const tfootRef = useRef<HTMLTableSectionElement | null>(null);

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

    // Fetch next page via onBottomReached on ScrollArea (parent component).
    // This skeleton only handles the "content doesn't overflow" case where
    // the user can't scroll and onBottomReached won't fire.
    useEffect(() => {
        if (!root || infinityQuery === null) return;

        const checkShouldLoad = () => {
            if (!root) return;
            if (!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage) return;

            // Only auto-fetch if content doesn't overflow the scroll container
            const { scrollHeight, clientHeight } = root;
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

    return (
        <tfoot ref={tfootRef}>
        {
            (infinityQuery === null || infinityQuery.hasNextPage) && (
                Object.keys(new Array(6).fill('')).map(
                    (x) => (
                        <tr key={x} style={{ height: 72 }}>
                            <td style={{ width: 40, padding: 10 }}>
                                <Skeleton height={20} radius="sm" />
                            </td>
                            {
                                Object.keys(tableColumns).map((column) => {
                                    if (!visibleFields.includes(column)) return undefined;

                                    if (column === 'level') {
                                        return (
                                            <td
                                                key={column}
                                                style={{ ...tableColumns[column].cellStyle, paddingLeft: '8px' }}
                                            >
                                                <Skeleton height={34} circle radius="xl" />
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={column}
                                            style={{
                                                ...tableColumns[column].cellStyle,
                                                paddingLeft: 5,
                                                paddingRight: 25,
                                            }}
                                        >
                                            <Skeleton height={16} radius="md" />
                                        </td>
                                    );
                                })
                            }
                        </tr>
                    ),
                )
            )
        }
        </tfoot>
    );
}

export default InfinityScrollSkeleton;
