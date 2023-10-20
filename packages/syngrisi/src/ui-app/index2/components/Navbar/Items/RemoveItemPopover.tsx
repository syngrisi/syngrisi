import * as React from 'react';
import { ActionIcon, Button, Group, Popover } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons';

interface Props {
    opened: boolean
    toggle: any
    handleRemoveItemClick: any
    type: string
    testAttr?: string
}

export function RemoveItemPopover(
    {
        opened,
        toggle,
        handleRemoveItemClick,
        type,
        testAttr = 'remove-popover-action-icon',

    }: Props,
) {
    return (
        <Popover position="bottom" withArrow shadow="md" opened={opened} onChange={toggle}>
            <Popover.Target>
                <ActionIcon data-item={testAttr}>
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
                <Group position="center">
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
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
}
