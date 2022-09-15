/* eslint-disable */
import React, { FunctionComponent, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@mantine/core';

interface Props {
    infinityQuery: any,
}

import { adminLogsTableColumns } from './adminLogsTableColumns';

const InfinityScrollSkeleton: FunctionComponent<Props> = ({ infinityQuery }) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    return (
        <tfoot ref={ref}>

        {infinityQuery.hasNextPage && (

            Object.keys(new Array(6).fill('')).map(x =>
                (<tr key={x} style={{ height: 72 }}>
                    <td style={{ width: 40, padding: 10 }}>
                        <Skeleton height={20} radius="sm" />

                    </td>
                    {
                        Object.keys(adminLogsTableColumns).map((name) => {
                            if (!adminLogsTableColumns[name].visible) return;
                            if (name === 'level') return (
                                <td key={name}
                                    style={{ ...adminLogsTableColumns[name].cellStyle, paddingLeft: '8px' }}
                                >
                                    <Skeleton height={34} circle radius="xl" />
                                </td>
                            )

                            return (
                                <td key={name}
                                    style={{ ...adminLogsTableColumns[name].cellStyle, paddingLeft: 5, paddingRight: 25 }}
                                >
                                    <Skeleton height={16} radius="md" />
                                </td>
                            );

                        })
                    }
                </tr>)
            )
        )}
        </tfoot>
    );
};

export default InfinityScrollSkeleton;
