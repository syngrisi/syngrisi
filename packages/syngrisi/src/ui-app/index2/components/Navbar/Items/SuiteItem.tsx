/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, List, Stack, Text, Tooltip } from '@mantine/core';
import * as dateFns from 'date-fns';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import RemoveItemModalAsk from '@index/components/Navbar/Items/RemoveItemModalAsk';
import { RemoveItemPopover } from '@index/components/Navbar/Items/RemoveItemPopover';

interface Props {
    item: { [key: string]: string }
    index: number
    className: string
    handlerItemClick: any
    infinityQuery: any
    type: string
}

export const SuiteItem = React.memo(function SuiteItem(
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
                style={{ cursor: 'pointer', width: '100%' }}
            >
                <Group
                    noWrap
                    pl={8}
                    justify="space-between"
                    gap={0}
                >
                    <Group style={{ width: '100%' }} noWrap>
                        <Stack gap={0} style={{ width: '100%' }}>
                            <Group justify="flex-start" style={{ width: '100%' }}>
                                <Tooltip label={item.name} multiline withinPortal>
                                    <Text
                                        data-test="navbar-item-name"
                                        size={16}
                                        lineClamp={1}
                                        style={{ wordBreak: 'break-all' }}
                                    >
                                        {item.name}
                                    </Text>
                                </Tooltip>
                            </Group>

                            <Group justify="flex-end">
                                <Tooltip
                                    withinPortal
                                    label={
                                        dateFns.format(dateFns.parseISO(item.createdDate), 'yyyy-MM-dd HH:mm:ss')
                                    }
                                >
                                    <Text
                                        align="right"
                                        size="xs"
                                        c="dimmed"
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
                    <Group justify="flex-end" gap={0} noWrap>
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
});
