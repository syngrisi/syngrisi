import * as React from 'react';
import { ActionIcon, Button, Group, Popover } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons';

interface Props {
    opened: boolean
    toggle: any
    handleRemoveItemClick: any
    type: string
}

export function RemoveItemPopover({ opened, toggle, handleRemoveItemClick, type }: Props) {
    return (
        <Popover position="bottom" withArrow shadow="md" opened={opened} onChange={toggle}>
            <Popover.Target>
                <ActionIcon>
                    <IconDotsVertical onClick={
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
