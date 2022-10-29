/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, List, Loader, Stack, Text, Tooltip } from '@mantine/core';
import * as dateFns from 'date-fns';
import { useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import RemoveItemModalAsk from './RemoveItemModalAsk';
import { StatusesRing } from '../../../../shared/components/Tests/StatusesRing';
import { GenericService } from '../../../../shared/services';
import { errorMsg } from '../../../../shared/utils';
import { RemoveItemPopover } from './RemoveItemPopover';

interface Props {
    item: { [key: string]: string }
    index: number
    className: string
    handlerItemClick: any
    infinityQuery: any
    type: string
}

export function RunItem(
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

    const testsQuery = useQuery(
        [
            `${type}_item_tests_query`,
            item._id,
        ],
        () => GenericService.get(
            'tests',
            {
                [type.toLowerCase()]: { $eq: item._id },
            },
            {
                limit: String(0),
            },
            `${type}_item_tests_query`,
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
