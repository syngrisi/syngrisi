import * as React from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';
import { OsIcon } from '@shared/components/Check/OsIcon';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function Os({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline withinPortal>
                <Group gap={6} align="center" wrap="nowrap">
                    <OsIcon size={18} os={itemValue} />
                    <Text
                        lineClamp={1}
                        style={{
                            wordBreak: 'break-all',
                            fontSize: '13px',
                            lineHeight: '18px',
                            letterSpacing: '-0.01em',
                            fontFamily: '"Roboto","Arial",sans-serif',
                        }}
                    >
                        {itemValue}
                    </Text>
                </Group>
            </Tooltip>
        </td>
    );
}
