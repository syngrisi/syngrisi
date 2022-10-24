/* eslint-disable no-underscore-dangle,prefer-arrow-callback */
import React, { useEffect, useState } from 'react';
import {
    ActionIcon,
    Group,
    List,
    RingProgress,
    Stack,
    Text,
    Tooltip,
    Popover,
    Button,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { useParams } from '../../../hooks/useParams';
import RemoveRunModalAsk from './RemoveRunModalAsk';

interface Props {
    item: { [key: string]: string }
    index: number
    classes: any
    id: string
    activeItemsHandler: any,
    infinityQuery: any,
}

export function Run(
    {
        item,
        index,
        classes,
        id,
        // activeItem,
        // setActiveItem,
        activeItemsHandler,
        infinityQuery,
    }: Props,
) {
    const { setQuery } = useParams();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleClick = () => {
        setModalOpen(true);
        close();
    };

    const handlerItemClick = (e: any) => {
        if (!(e.metaKey || e.ctrlKey)) activeItemsHandler.clear();
        activeItemsHandler.addOrRemove(id);
    };
    useEffect(function onActiveItemsChange() {
        if (activeItemsHandler.get()?.length < 1) {
            setQuery({ base_filter: null });
            return;
        }
        setQuery({ base_filter: { run: { $in: activeItemsHandler.get() } } });
    }, [JSON.stringify(activeItemsHandler.get())]);

    return (
        <>
            <List.Item
                data-test={`navbar_item_${index}`}
                onClick={handlerItemClick}
                className={
                    `${classes.navbarItem} ${(activeItemsHandler.get().includes(id)) && classes.activeNavbarItem}`
                }
                sx={{ cursor: 'pointer', width: '100%' }}
            >
                <Group
                    noWrap
                    pl={8}
                    position="apart"
                    spacing={0}
                >
                    <Group noWrap>
                        <Stack spacing={0}>
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
                            <Text align="right" size="xs" color="dimmed">3 hou!s ago</Text>
                        </Stack>
                    </Group>

                    <Group position="right" spacing={0} noWrap>
                        <RingProgress
                            sections={[{
                                value: 100,
                                color: 'green',
                            }]}
                            size={48}
                        />

                        <Popover position="bottom" withArrow shadow="md" opened={opened} onChange={toggle}>
                            <Popover.Target>
                                <ActionIcon>
                                    <IconDotsVertical onClick={toggle} />
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Group position="center">
                                    <Button onClick={() => handleClick()}>Remove run</Button>
                                </Group>
                            </Popover.Dropdown>
                        </Popover>
                    </Group>
                </Group>
            </List.Item>
            <RemoveRunModalAsk opened={modalOpen} setOpened={setModalOpen} infinityQuery={infinityQuery} item={item} />
        </>
    );
}
