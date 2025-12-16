/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, List, Stack, Text, Tooltip } from '@mantine/core';
import { StatusIcon } from '@shared/components/Check/StatusIcon';

interface Props {
    item: { [key: string]: string }
    index: number
    handlerItemClick: any
    className: string
}

export function StatusItem({ item, index, handlerItemClick, className }: Props) {
    return (
        <List.Item
            data-test={`navbar_item_${index}`}
            onClick={handlerItemClick}
            className={className}
            sx={{ cursor: 'pointer', width: '100%' }}
        >
            <Group noWrap pl={8} position="apart" spacing={0} sx={{ width: '100%' }}>
                <Stack spacing={0} sx={{ width: '100%' }}>
                    <Group position="left" sx={{ width: '100%' }}>
                        <Tooltip label={item.name} multiline withinPortal>
                            <Group spacing={8}>
                                <StatusIcon status={item.name} size={44} />
                                <Text
                                    data-test="navbar-item-name"
                                    size={16}
                                    lineClamp={1}
                                    sx={{ wordBreak: 'break-all' }}
                                >
                                    {item.name}
                                </Text>
                            </Group>
                        </Tooltip>
                    </Group>
                </Stack>
            </Group>
        </List.Item>
    );
}
