/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Badge, BadgeVariant } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { sizes } from '../../../index2/components/Tests/Table/Checks/checkSizes';

const statusColor = (status: string) => {
    const map = {
        new: 'blue',
        passed: 'green',
        failed: 'red',
    } as { [key: string]: any };
    return map[status] || 'gray';
};

interface Props {
    check: any,
    variant?: BadgeVariant
    size?: number | string,
}

export function Status({ check, size, variant = 'light', ...rest }: Props) {
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    return (
        <Badge
            color={statusColor(check.status)}
            data-test="check-status"
            data-check-status-name={check.name}
            variant={variant}
            size={size || sizes[checksViewSize].statusBadge}
            title="Check status"
            {...rest}
        >
            {check.status}
        </Badge>
    );
}
