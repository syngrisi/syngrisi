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

    // Fallback auto-load for non-overflowing content.
    // The primary fetch trigger for infinite scroll is ScrollArea's `onBottomReached`
    // prop (see AdminLogsTable), which only ever fires from inside the viewport's
    // native `scroll` event handler. If the loaded rows don't overflow the scroll
    // container (scrollHeight <= clientHeight), the browser never dispatches a
    // `scroll` event, so `onBottomReached` can structurally never fire and paging
    // would stall. This effect covers exactly that gap; it does not duplicate
    // `onBottomReached` (no scroll listener here) and only acts while there is no
    // overflow to scroll.
    useEffect(() => {
        if (!root || infinityQuery === null) return;
        if (!infinityQuery.hasNextPage || infinityQuery.isFetchingNextPage) return;

        // Delay the check to let the DOM render before measuring.
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!root) return;
                const { scrollHeight, clientHeight } = root;

                if (scrollHeight <= clientHeight + 5) {
                    // Content fits within viewport: fetch next page
                    infinityQuery.fetchNextPage();
                }
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
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
