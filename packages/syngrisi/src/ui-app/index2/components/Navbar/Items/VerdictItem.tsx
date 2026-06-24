/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Badge, Group, List, Stack, Text, Tooltip } from '@mantine/core';

interface Props {
    item: { [key: string]: string }
    index: number
    handlerItemClick: any
    className: string
}

const verdictColor = (v: string) => ({
    intended_change: 'green',
    likely_bug: 'red',
    noise: 'gray',
    uncertain: 'yellow',
} as { [k: string]: string })[v] || 'gray';

// Navbar group item for "Group by AI Verdict". item.name is the verdict value.
export function VerdictItem({ item, index, handlerItemClick, className }: Props) {
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

    const name = item.name || 'no verdict';

    return (
        <List.Item
            ref={itemRef}
            data-test={`navbar_item_${index}`}
            data-item-name={name}
            data-testid={`navbar-verdict-${String(name).toLowerCase()}`}
            className={className}
            style={{ cursor: 'pointer', width: '100%' }}
        >
            <Group wrap="nowrap" pl={8} justify="space-between" gap={0} style={{ width: '100%' }}>
                <Stack gap={0} style={{ width: '100%' }}>
                    <Group justify="flex-start" style={{ width: '100%' }}>
                        <Tooltip label={name} multiline withinPortal>
                            <Badge color={verdictColor(item.name)} variant="light" size="lg" data-test="navbar-item-name">
                                {name}
                            </Badge>
                        </Tooltip>
                    </Group>
                </Stack>
            </Group>
        </List.Item>
    );
}
