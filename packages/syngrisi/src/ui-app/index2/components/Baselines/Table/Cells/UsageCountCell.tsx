import * as React from 'react';
import { Text, Tooltip, Badge } from '@mantine/core';

interface Props {
    baseline: any
}

export function UsageCountCell({ baseline }: Props) {
    return (
        <td style={{ width: '10%' }} data-test="table-row-Usage">
            <Tooltip label="Number of checks using this baseline (reference only)" withinPortal>
                <Badge color="gray" variant="light">
                    {baseline.usageCount || 0}
                </Badge>
            </Tooltip>
        </td>
    );
}
