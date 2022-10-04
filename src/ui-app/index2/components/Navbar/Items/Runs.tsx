import * as React from 'react';
import { Checkbox, Group, List, RingProgress, Stack, Text, Tooltip } from '@mantine/core';
import { useParams } from '../../../hooks/useParams';

interface Props {
    item: { [key: string]: string }
    selected: boolean
    toggleRowSelection: (id: string) => void
    index: number
    classes: any
    id: string
    activeItem: string,
    setActiveItem: any
}

export function Runs({ item, selected, toggleRowSelection, index, classes, id, activeItem, setActiveItem }: Props) {
    const { updateQueryJsonParam } = useParams();

    const handlerItemClick = () => {
        setActiveItem(() => id);
        updateQueryJsonParam('base_filter', 'run', id);
    };
    return (
        <List.Item
            data-test={`navbar_item_${index}`}
            onClick={handlerItemClick}
            className={
                `${classes.navbarItem} ${(activeItem === id) && classes.activeNavbarItem}`
            }
            style={{ cursor: 'pointer' }}
        >
            <Group
                noWrap
                p={4}
                position="apart"
                spacing={0}
            >
                <Group noWrap style={{ width: '100%' }}>
                    <Checkbox
                        test-data="navbar-item-checkbox"
                        checked={selected}
                        onChange={(event) => {
                            event.stopPropagation();
                            toggleRowSelection(item.id!);
                        }}
                        onClick={(event) => event.stopPropagation()}
                    />
                    <Stack spacing={0} style={{ width: '100%' }}>
                        <Tooltip label={item.name} multiline>
                            <Text
                                size={16}
                                lineClamp={1}
                                sx={{ wordBreak: 'break-all' }}
                            >
                                {item.name}
                            </Text>
                        </Tooltip>
                        <Text align="right" size="xs" color="dimmed">3 hous ago</Text>
                    </Stack>
                </Group>

                <RingProgress
                    sections={[{
                        value: 100,
                        color: 'green',
                    }]}
                    size={48}
                />
            </Group>
        </List.Item>
    );
}
