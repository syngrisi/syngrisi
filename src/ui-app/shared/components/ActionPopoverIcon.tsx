/* eslint-disable react/jsx-props-no-spreading */
import {
    ActionIcon,
    Popover,
    Button,
    MantineNumberSize,
    Group,
    Text,
    Tooltip,
    MantineColor,
} from '@mantine/core';
import React, { ReactElement } from 'react';
import { useDisclosure, useClickOutside } from '@mantine/hooks';

interface IActionPopoverIcon {
    icon: ReactElement
    color?: MantineColor
    iconColor?: MantineColor
    buttonColor?: MantineColor
    action: () => void,
    confirmLabel: string
    title?: string
    testAttr: string
    loading: boolean
    variant?: string
    sx?: any
    paused?: boolean
    size?: MantineNumberSize | undefined
    withinPortal?: boolean
    disabled?: boolean
    testAttrName?: string
}

export default function ActionPopoverIcon(
    {
        icon,
        color,
        iconColor,
        action,
        confirmLabel,
        title,
        testAttr,
        testAttrName = '',
        loading,
        buttonColor,
        paused,
        disabled = false,
        withinPortal = true,
        size = 24,
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
            withinPortal={withinPortal}
        >
            <Popover.Target>
                <Tooltip
                    withinPortal={withinPortal}
                    label={
                        (
                            <Group noWrap>
                                <Text>{title}</Text>
                            </Group>
                        )
                    }
                >
                    <ActionIcon
                        disabled={disabled}
                        data-test={testAttr}
                        data-accept-icon-name={testAttrName}
                        variant={'light' as any}
                        color={iconColor}
                        onClick={() => {
                            if (paused) return;
                            handlers.toggle();
                        }}
                        title={title}
                        loading={loading}
                        size={size}
                        {...rest}
                    >
                        {icon}
                    </ActionIcon>
                </Tooltip>
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
                    data-confirm-button-name={testAttrName}
                    onClick={() => {
                        action();
                        handlers.close();
                    }}
                >
                    {confirmLabel}
                </Button>
            </Popover.Dropdown>
        </Popover>
    );
}
