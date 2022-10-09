import * as React from 'react';
import { Checkbox, Group, List, Stack, Text, Tooltip } from '@mantine/core';
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

export function Suite({ item, selected, toggleRowSelection, index, classes, id, activeItem, setActiveItem }: Props) {
    const { setQuery } = useParams();

    const handlerItemClick = () => {
        setActiveItem(() => id);
        setQuery({ base_filter: { suite: id } });
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
                                data-test="navbar-item-name"
                                size={16}
                                lineClamp={1}
                                sx={{ wordBreak: 'break-all' }}
                            >
                                {item.name}
                            </Text>
                        </Tooltip>
                    </Stack>
                </Group>
            </Group>
        </List.Item>
    );
}
