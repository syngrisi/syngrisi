import * as React from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '../tableColumns';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function BrowserVersion({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline withinPortal>
                <Group spacing={6} align="center" noWrap>
                    <Text
                        lineClamp={1}
                        sx={{ wordBreak: 'break-all' }}
                    >
                        {itemValue}
                    </Text>
                </Group>
            </Tooltip>
        </td>

    );
}
