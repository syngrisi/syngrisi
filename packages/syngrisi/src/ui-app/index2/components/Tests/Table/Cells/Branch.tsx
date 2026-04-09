import * as React from 'react';
import { Badge, Text, Tooltip } from '@mantine/core';
import { IconGitBranch } from '@tabler/icons-react';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';

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
                    styles={{ label: { fontSize: '12px', fontWeight: 600, lineHeight: '16px', letterSpacing: '0.01em' } }}
                >
                    <Text
                        lineClamp={1}
                        style={{
                            wordBreak: 'break-all',
                            maxWidth: 100,
                            fontSize: '12px',
                            lineHeight: '16px',
                            letterSpacing: '-0.01em',
                            fontFamily: '"Roboto","Arial",sans-serif',
                        }}
                    >
                        {itemValue}
                    </Text>
                </Badge>
            </Tooltip>
        </td>
    );
}
