import * as React from 'react';
import { Badge, Tooltip } from '@mantine/core';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';

interface Props {
    type: string
    test: any
}

export function Viewport({ type, test }: Props) {
    const uniqueCheckViewports = [...new Set(test.checks.map((x: any) => x.viewport))];

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
                    variant="light"
                    styles={{
                        root: {
                            borderRadius: '32px',
                            paddingLeft: '10.6667px',
                            paddingRight: '10.6667px',
                        },
                        label: {
                            overflow: 'visible',
                            whiteSpace: 'nowrap',
                        },
                    }}
                >
                    {resultViewport}
                </Badge>
            </Tooltip>
        </td>
    );
}
