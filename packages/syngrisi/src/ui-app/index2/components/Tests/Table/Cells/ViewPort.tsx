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
                    size="sm"
                    color="blue"
                    variant="light"
                    styles={{
                        root: {
                            borderRadius: '32px',
                            paddingLeft: '9px',
                            paddingRight: '9px',
                        },
                        label: {
                            overflow: 'visible',
                            whiteSpace: 'nowrap',
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: '16px',
                            letterSpacing: '0.01em',
                        },
                    }}
                >
                    {resultViewport}
                </Badge>
            </Tooltip>
        </td>
    );
}
