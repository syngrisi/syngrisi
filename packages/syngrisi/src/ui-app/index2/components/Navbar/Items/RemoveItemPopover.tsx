import * as React from 'react';
import { ActionIcon, Button, Stack, Popover } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

interface Props {
    opened: boolean
    toggle: any
    handleRemoveItemClick: any
    type: string
    testAttr?: string
    // Optional extra action rendered above the Remove button (e.g. "Promote baselines to main"
    // for runs). Kept optional so this popover stays reusable for other item types (e.g. Suite)
    // that don't need it.
    onPromoteClick?: any
}

export function RemoveItemPopover(
    {
        opened,
        toggle,
        handleRemoveItemClick,
        type,
        testAttr = 'remove-popover-action-icon',
        onPromoteClick,

    }: Props,
) {
    return (
        <Popover position="bottom" withArrow shadow="md" opened={opened} onChange={toggle}>
            <Popover.Target>
                <ActionIcon data-item={testAttr} variant="transparent" color="gray">
                    <IconDotsVertical
                        onClick={
                            (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                toggle();
                            }
                        }
                    />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p={8}>
                <Stack gap={4} align="stretch">
                    {onPromoteClick && (
                        <Button
                            data-test="run-promote-baselines"
                            variant="light"
                            onClick={
                                (e: any) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onPromoteClick();
                                }
                            }
                        >
                            Promote baselines to main
                        </Button>
                    )}
                    <Button
                        data-item={`${testAttr}_confirm`}
                        onClick={
                            (e: any) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleRemoveItemClick();
                            }
                        }
                    >
                        Remove
                        {' '}
                        {type}
                    </Button>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
