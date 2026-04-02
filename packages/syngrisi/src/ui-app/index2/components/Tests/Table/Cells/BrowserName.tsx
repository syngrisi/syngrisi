import * as React from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function BrowserName({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline withinPortal>
                <Group gap={6} align="center" wrap="nowrap">
                    <BrowserIcon size={24} browser={itemValue} />
                    <Text
                        lineClamp={1}
                        style={{ wordBreak: 'break-all' }}
                    >
                        {itemValue}
                    </Text>
                </Group>
            </Tooltip>
        </td>

    );
}
