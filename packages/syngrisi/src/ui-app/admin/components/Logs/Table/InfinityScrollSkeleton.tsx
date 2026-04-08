/* eslint-disable indent,react/jsx-indent */
import React, { useEffect, useState, useRef } from 'react';
import { Skeleton } from '@mantine/core';

import { adminLogsTableColumns } from '@admin/components/Logs/Table/adminLogsTableColumns';

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

    // Scroll-based detection for loading more items
    useEffect(() => {
        if (!root || infinityQuery === null) return;

        const checkShouldLoad = () => {
            if (!root) return;
            if (!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage) return;

            const { scrollHeight, scrollTop, clientHeight } = root;

            if (scrollHeight <= clientHeight + 5) {
                // Content fits within viewport: fetch next page
                infinityQuery.fetchNextPage();
            } else {
                // Content overflows: fetch if scrolled near bottom
                const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
                if (distanceFromBottom < 600) {
                    infinityQuery.fetchNextPage();
                }
            }
        };

        const handleScroll = () => {
            checkShouldLoad();
        };

        // Delay initial check to let DOM render
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                checkShouldLoad();
            });
        });

        root.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafId);
            root.removeEventListener('scroll', handleScroll);
        };
    }, [root, infinityQuery?.hasNextPage, infinityQuery?.isFetchingNextPage]);

    return (
        <tfoot ref={tfootRef}>
        {
            infinityQuery.hasNextPage && (

                Object.keys(new Array(6).fill('')).map(
                    (x) => (
                        <tr key={x} style={{ height: 72 }}>
                            <td style={{ width: 40, padding: 10 }}>
                                <Skeleton height={20} radius="sm" />

                            </td>
                            {
                                Object.keys(adminLogsTableColumns).map(
                                    (column) => {
                                        if (!visibleFields.includes(column)) return undefined;

                                        if (column === 'level') {
                                            return (
                                                <td
                                                    key={column}
                                                    style={{
                                                        ...adminLogsTableColumns[column].cellStyle,
                                                        paddingLeft: '8px',
                                                    }}
                                                >
                                                    <Skeleton height={34} circle radius="xl" />
                                                </td>
                                            );
                                        }

                                        return (
                                            <td
                                                key={column}
                                                style={{
                                                    ...adminLogsTableColumns[column].cellStyle,
                                                    paddingLeft: 5,
                                                    paddingRight: 25,
                                                }}
                                            >
                                                <Skeleton height={16} radius="md" />
                                            </td>
                                        );
                                    },
                                )
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
