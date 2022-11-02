import * as React from 'react';
import { Badge, Text, Tooltip } from '@mantine/core';
import { IconGitBranch } from '@tabler/icons';
import { tableColumns } from '../tableColumns';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function Branch({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline withinPortal>
                <Badge
                    size="sm"
                    color="dark"
                    leftSection={<IconGitBranch style={{ marginTop: '4' }} size={11} />}
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
