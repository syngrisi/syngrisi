/* eslint-disable */
import React, { FunctionComponent } from 'react';
import { Skeleton } from '@mantine/core';


import { adminLogsTableColumns } from './adminLogsTableColumns';

interface Props {
    visibleFields: any
}

const InfinityScrollSkeletonFiller: FunctionComponent<Props> = ({ visibleFields }) => {
    return (
        Object.keys(new Array(6).fill('')).map(x =>
            (<tr key={x} style={{ height: 72 }}>
                    <td style={{ width: 40, padding: 10 }}>
                        <Skeleton height={20} radius="sm" />

                    </td>
                    {
                        Object.keys(adminLogsTableColumns).map((column) => {
                            if (!visibleFields.includes(column)) return undefined;

                            if (column === 'level') return (
                                <td key={column}
                                    style={{ ...adminLogsTableColumns[column].cellStyle, paddingLeft: '8px' }}
                                >
                                    <Skeleton height={34} circle radius="xl" />
                                </td>
                            )

                            return (
                                <td key={column}
                                    style={{
                                        ...adminLogsTableColumns[column].cellStyle,
                                        paddingLeft: 5,
                                        paddingRight: 25
                                    }}
                                >
                                    <Skeleton height={16} radius="md" />
                                </td>
                            );

                        })
                    }
                </tr>
            )
        )
    )
}

export default InfinityScrollSkeletonFiller;
