/* eslint-disable react/jsx-props-no-spreading */
import { ActionIcon, DefaultMantineColor, Popover, Button } from '@mantine/core';
import React, { ReactElement } from 'react';
import { useDisclosure, useClickOutside } from '@mantine/hooks';

interface IActionPopoverIcon {
    icon: ReactElement
    color?: DefaultMantineColor | undefined
    buttonColor?: DefaultMantineColor | undefined
    action: () => void,
    confirmLabel: string
    title: string
    testAttr: string
    loading: boolean
    variant?: string
    sx?: any
    paused?: boolean
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
        buttonColor,
        paused,
        ...rest
    }: IActionPopoverIcon,
): ReactElement {
    const [openPopover, handlers] = useDisclosure(false);

    const ref = useClickOutside(() => handlers.close());
    return (
        <Popover
            opened={openPopover}
            position="bottom"
            withArrow
            shadow="md"
            closeOnClickOutside
            closeOnEscape

        >
            <Popover.Target>
                <ActionIcon
                    data-test={testAttr}
                    variant={'light' as any}
                    color={color}
                    onClick={() => {
                        if (paused) return;
                        handlers.toggle();
                    }}
                    title={title}
                    loading={loading}
                    {...rest}
                >
                    {icon}
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown
                p={4}
                // onBlurCapture={() => handlers.close()}
                // onBlurCapture={() => alert(123)}
            >
                <Button
                    ref={ref}
                    data-test={`${testAttr}-confirm`}
                    color={buttonColor || color}
                    onClick={() => {
                        action();
                    }}
                >
                    {confirmLabel}
                </Button>
            </Popover.Dropdown>
        </Popover>
    );
}
