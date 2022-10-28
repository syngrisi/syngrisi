import * as React from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '../tableColumns';
import { BrowserIcon } from '../../../../../shared/components/Check/BrowserIcon';

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
            <Tooltip label={test[type]} multiline>
                <Group spacing={6} align="center" noWrap>
                    <BrowserIcon size={24} browser={itemValue} />
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
