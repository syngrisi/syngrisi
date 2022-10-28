/* eslint-disable no-underscore-dangle,prefer-arrow-callback */
import React, { useEffect, useMemo, useState } from 'react';
import * as dateFns from 'date-fns';
import {
    ActionIcon,
    Group,
    List,
    Stack,
    Text,
    Tooltip,
    Popover,
    Button,
    Loader,
} from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '../../../hooks/useParams';
import RemoveRunModalAsk from './RemoveRunModalAsk';
import { GenericService } from '../../../../shared/services';
import { errorMsg } from '../../../../shared/utils';
import { StatusesRing } from '../../../../shared/components/Tests/StatusesRing';

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

    const testsQuery = useQuery(
        [
            'run_item_tests_query',
            item._id,
        ],
        () => GenericService.get(
            'tests',
            {
                run: { $eq: item._id },
            },
            {
                limit: String(0),
            },
            'run_item_tests_query',
        ),
        {
            enabled: true,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const testsStatuses: any = useMemo(() => {
        if (testsQuery?.data?.results) {
            return testsQuery?.data?.results.map((x) => x.status);
        }
        return [];
    }, [testsQuery?.data?.timestamp]);

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
                    <Group sx={{ width: '100%' }} noWrap>
                        <Stack spacing={0} sx={{ width: '100%' }}>
                            <Group position="left" sx={{ width: '100%' }}>
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
                            </Group>

                            <Group position="right">
                                <Tooltip
                                    label={
                                        dateFns.format(dateFns.parseISO(item.createdDate), 'yyyy-MM-dd HH:mm:ss')
                                    }
                                >
                                    <Text
                                        align="right"
                                        size="xs"
                                        color="dimmed"
                                    >
                                        {
                                            dateFns.formatDistanceToNow(
                                                dateFns.parseISO(item.createdDate),
                                            )
                                        }
                                    </Text>
                                </Tooltip>
                            </Group>
                        </Stack>

                    </Group>
                    <Group position="right" spacing={0} noWrap>
                        {
                            testsQuery.isLoading
                                ? (<Loader variant="dots" size="xs" mr={16} />)
                                : (<StatusesRing statuses={testsStatuses} />)
                        }

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
