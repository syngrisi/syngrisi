/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Group, List, Stack, Text, Tooltip } from '@mantine/core';
import { AcceptedStatusIcon } from '@shared/components/Check/AcceptedStatusIcon';

interface Props {
    item: { [key: string]: string }
    index: number
    handlerItemClick: any
    className: string
}

export function AcceptStatusItem({ item, index, handlerItemClick, className }: Props) {
    const itemRef = useRef<HTMLLIElement>(null);
    const handlerRef = useRef(handlerItemClick);
    handlerRef.current = handlerItemClick;

    useEffect(() => {
        const el = itemRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => handlerRef.current(e);
        el.addEventListener('click', handler);
        return () => el.removeEventListener('click', handler);
    }, []);

    return (
        <List.Item
            ref={itemRef}
            data-test={`navbar_item_${index}`}
            data-item-name={item.name}
            data-testid={`navbar-accept-status-${item.name.toLowerCase()}`}
            className={className}
            style={{ cursor: 'pointer', width: '100%' }}
        >
            <Group wrap="nowrap" pl={8} justify="space-between" gap={0} style={{ width: '100%' }}>
                <Stack gap={0} style={{ width: '100%' }}>
                    <Group justify="flex-start" style={{ width: '100%' }}>
                        <Tooltip label={item.name} multiline withinPortal>
                            <Group gap={8}>
                                <AcceptedStatusIcon status={item.name} size={44} />
                                <Text
                                    component="span" data-test="navbar-item-name"
                                    data-testid={`accept-status-${item.name.toLowerCase()}`}
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
