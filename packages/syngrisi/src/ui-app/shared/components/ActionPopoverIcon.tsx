/* eslint-disable react/jsx-props-no-spreading */
import {
    ActionIcon,
    Popover,
    Button,
    Tooltip,
    Box,
} from '@mantine/core';
import type { MantineColor } from '@mantine/core';
import React, { ReactElement } from 'react';
import { useDisclosure } from '@mantine/hooks';

interface IActionPopoverIcon {
    icon: ReactElement
    color?: MantineColor
    iconColor?: MantineColor
    buttonColor?: MantineColor
    action: () => void,
    confirmLabel: string
    title?: React.ReactNode
    testAttr: string
    loading: boolean
    variant?: string
    style?: React.CSSProperties
    paused?: boolean
    size?: number | string | undefined
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
        style: styleProp,
        ...rest
    }: IActionPopoverIcon,
): ReactElement {
    const [openPopover, handlers] = useDisclosure(false);

    // We rely on Popover's closeOnClickOutside={true} instead of useClickOutside
    // to avoid conflicts where clicking the trigger immediately closes the popover.

    return (
        <Popover
            opened={openPopover}
            onChange={(nextOpened) => {
                if (disabled && nextOpened) return;
                handlers.toggle();
            }}
            position="bottom"
            withArrow
            shadow="md"
            closeOnClickOutside
            closeOnEscape
            withinPortal={withinPortal}
        >
            <Popover.Target>
                <Tooltip
                    label={title}
                    withinPortal={withinPortal}
                    disabled={!title || openPopover}
                >
                    <Box
                        onClick={(e) => {
                            if (paused || disabled) {
                                e.stopPropagation();
                                return;
                            }
                            e.stopPropagation();
                            handlers.toggle();
                        }}
                        data-test={testAttr}
                        data-popover-icon-name={testAttrName}
                        data-loading={loading}
                        aria-label={typeof title === 'string' ? title : undefined}
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                if (paused || disabled) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return;
                                }
                                e.preventDefault();
                                e.stopPropagation();
                                handlers.toggle();
                            }
                        }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            overflow: 'visible',
                            position: 'relative',
                            lineHeight: 1,
                            ...(styleProp || {}),
                        }}
                    >
                        <ActionIcon
                            disabled={disabled}
                            aria-hidden="true"
                            variant={'light' as any}
                            color={iconColor || color}
                            loading={loading}
                            size={size}

                            style={{
                                pointerEvents: 'none',
                                overflow: 'visible',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                                flexShrink: 0,
                            }}
                            {...rest}
                        >
                            {icon}
                        </ActionIcon>
                    </Box>
                </Tooltip>
            </Popover.Target>

            <Popover.Dropdown p={4}>
                <Button
                    data-test={`${testAttr}-confirm`}
                    aria-label={confirmLabel}
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
