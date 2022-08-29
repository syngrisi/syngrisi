import { ActionIcon, DefaultMantineColor, Popover, Button } from '@mantine/core';
import React, { ReactElement } from 'react';
import { useToggle } from '@mantine/hooks';

interface IActionPopoverIcon {
    icon: ReactElement,
    color?: DefaultMantineColor | undefined,
    action: React.MouseEventHandler,
    confirmLabel: string,
    title: string,
    testAttr: string,
    loading: boolean
}

export default function ActionPopoverIcon(
    {
        icon,
        color = 'red',
        action,
        confirmLabel,
        title,
        testAttr,
        loading,
    }: IActionPopoverIcon,
): ReactElement {
    const [openPopover, toggleOpenPopover] = useToggle([false, true]);

    return (
        <Popover opened={openPopover} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon
                    data-test={testAttr}
                    variant="light"
                    color={color}
                    onClick={() => toggleOpenPopover()}
                    title={title}
                    loading={loading}
                >
                    {icon}
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
                p={4}
                onBlurCapture={() => toggleOpenPopover()}
            >
                <Button
                    data-test={`${testAttr}-confirm`}
                    color={color}
                    onClick={action}
                >
                    {confirmLabel}
                </Button>
            </Popover.Dropdown>
        </Popover>
    );
}
