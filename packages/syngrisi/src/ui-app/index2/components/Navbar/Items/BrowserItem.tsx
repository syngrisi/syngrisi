/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, List, Stack, Text, Tooltip } from '@mantine/core';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';

interface Props {
    item: { [key: string]: string }
    index: number
    handlerItemClick: any
    className: string
}

export function BrowserItem({ item, index, handlerItemClick, className }: Props) {
    return (
        <List.Item
            data-test={`navbar_item_${index}`}
            onClick={handlerItemClick}
            className={className}
            style={{ cursor: 'pointer', width: '100%' }}
        >
            <Group noWrap pl={8} justify="space-between" gap={0} style={{ width: '100%' }}>
                <Stack gap={0} style={{ width: '100%' }}>
                    <Group justify="flex-start" style={{ width: '100%' }}>
                        <Tooltip label={item.name} multiline withinPortal>
                            <Group gap={8}>
                                <BrowserIcon browser={item.name} size={20} />
                                <Text
                                    data-test="navbar-item-name"
                                    size={16}
                                    lineClamp={1}
                                    style={{ wordBreak: 'break-all' }}
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
