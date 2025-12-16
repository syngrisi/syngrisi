/* eslint-disable indent,react/jsx-indent */
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@mantine/core';

import { tableColumns } from '@index/components/Tests/Table/tableColumns';

interface Props {
    infinityQuery: any,
    visibleFields: any,
}

function InfinityScrollSkeleton({ infinityQuery, visibleFields }: Props) {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (infinityQuery === null) return;
        if (inView) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    return (
        <tfoot ref={ref} style={{ marginBottom: -100 }}>
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
