/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, List, Stack, Text, Tooltip } from '@mantine/core';
import * as dateFns from 'date-fns';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import RemoveItemModalAsk from './RemoveItemModalAsk';
import { RemoveItemPopover } from './RemoveItemPopover';

interface Props {
    item: { [key: string]: string }
    index: number
    className: string
    handlerItemClick: any
    infinityQuery: any
    type: string
}

export function SuiteItem(
    {
        item,
        type,
        index,
        className,
        infinityQuery,
        handlerItemClick,
    }: Props,
) {
    const [modalOpen, setModalOpen] = useState(false);
    const [opened, { toggle, close }] = useDisclosure(false);

    const handleRemoveItemClick = () => {
        setModalOpen(true);
        close();
    };

    return (
        <>
            <List.Item
                data-test={`navbar_item_${index}`}
                data-item-name={item.name}
                onClick={handlerItemClick}
                className={className}
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
                                <Tooltip label={item.name} multiline withinPortal>
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
                                    withinPortal
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
                        <RemoveItemPopover
                            handleRemoveItemClick={handleRemoveItemClick}
                            type={type}
                            opened={opened}
                            toggle={toggle}
                        />
                    </Group>
                </Group>
            </List.Item>
            <RemoveItemModalAsk
                opened={modalOpen}
                setOpened={setModalOpen}
                infinityQuery={infinityQuery}
                item={item}
                type={type}
            />
        </>
    );
}
