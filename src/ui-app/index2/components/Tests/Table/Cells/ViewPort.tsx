import * as React from 'react';
import { Badge, Text, Tooltip } from '@mantine/core';
import { tableColumns } from '../tableColumns';

interface Props {
    type: string
    test: any
}

export function Viewport({ type, test }: Props) {
    const uniqueCheckViewports = [...new Set(test.checks.map((x) => x.viewport))];

    // eslint-disable-next-line no-nested-ternary
    const resultViewport = uniqueCheckViewports.length > 0
        ? (uniqueCheckViewports.length === 1 ? uniqueCheckViewports[0] : '≠')
        : test.viewport;
    return (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip
                withinPortal
                label={
                    (uniqueCheckViewports.length !== 1)
                        ? 'There are checks with different viewports'
                        : resultViewport
                }
                multiline
            >
                <Badge
                    size="md"
                    color="blue"
                >
                    <Text
                        lineClamp={1}
                        sx={{ wordBreak: 'break-all' }}
                    >
                        {resultViewport}
                    </Text>
                </Badge>
            </Tooltip>
        </td>
    );
}
