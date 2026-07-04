/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Badge, Loader, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
    IconCircleDot, IconCircleCheck, IconCircleX, IconClock, IconCircleMinus, IconAlertTriangle, IconLoader2,
} from '@tabler/icons-react';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';

// Colors aligned with StatusesRing (shared/components/Tests/StatusesRing.tsx) so the same
// status reads as the same color across the grid Status cell/run panel and per-check badges.
const statusColor = (status: string) => {
    const map = {
        new: 'blue',
        passed: 'green',
        failed: 'red',
        running: 'grape',
    } as { [key: string]: any };
    return map[status] || 'gray';
};

const STATUS_ICONS: { [key: string]: React.ComponentType<any> } = {
    new: IconCircleDot,
    passed: IconCircleCheck,
    approved: IconCircleCheck,
    failed: IconCircleX,
    pending: IconClock,
    running: IconLoader2,
    aborted: IconCircleMinus,
    blinking: IconAlertTriangle,
};

const normStatus = (status: any): string => String(Array.isArray(status) ? status[0] : (status ?? '')).toLowerCase();

interface Props {
    check: any,
    variant?: string
    size?: number | string,
    iconOnly?: boolean, // grid preview cards: icon instead of text label
}

export function Status({ check, size, variant = 'light', iconOnly = false, ...rest }: Props) {
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const status = normStatus(check.status);
    const Icon = STATUS_ICONS[status];

    if (!check.status) {
        return <Loader size="xs" color="blue" variant="dots" />;
    }

    // grid preview cards: bare colored icon, no Badge chrome (outline/background)
    if (iconOnly) {
        return (
            <Tooltip label={status} withinPortal>
                <span
                    data-test="check-status"
                    data-check-status-name={check.name}
                    data-check-status-value={status}
                    title="Check status"
                    style={{ display: 'inline-flex', alignItems: 'center', color: `var(--mantine-color-${statusColor(status)}-6)` }}
                    {...rest}
                >
                    <span
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'inline-block',
                            backgroundColor: `var(--mantine-color-${statusColor(status)}-6)`,
                        }}
                    />
                </span>
            </Tooltip>
        );
    }

    const badge = (
        <Badge
            color={statusColor(status)}
            data-test="check-status"
            data-check-status-name={check.name}
            data-check-status-value={status}
            variant={variant}
            size={size || sizes[checksViewSize].statusBadge}
            title="Check status"
            leftSection={Icon ? <Icon size={14} stroke={1.8} /> : undefined}
            {...rest}
        >
            {check.status}
        </Badge>
    );

    return badge;
}
