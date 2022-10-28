import * as React from 'react';
import { Badge, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '../tableColumns';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function Viewport({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline>
                <Badge
                    size="md"
                    color="blue"
                >
                    <Text
                        lineClamp={1}
                        sx={{ wordBreak: 'break-all' }}
                    >
                        {itemValue}
                    </Text>
                </Badge>
            </Tooltip>
        </td>
    );
}
