/* eslint-disable no-underscore-dangle,no-nested-ternary,prefer-arrow-callback,max-len */
import * as React from 'react';
import { ActionIcon, Group, ScrollArea, Stack, Text, Transition, Chip, Burger, Divider, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowsSort, IconFilter, IconRefresh, IconX } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { RelatedChecksSkeleton } from './RelatedChecksSkeleton';
import { RelatedChecksItems } from './RelatedChecksItems';
import { RelatedCheckSort } from './RelatedCheckSort';

interface Props {
    check: any
    related: any
}

export function RelatedChecks(
    {
        check,
        related,
    }: Props,
) {
    const [openedSort, sortHandler] = useDisclosure(false);
    const [openedFilter, filterHandler] = useDisclosure(false);
    const [filter, setFilter] = useState(['name']);
    const [opened, setOpened] = useState(true);
    const title = opened ? 'Close related checks' : 'Open related checks';

    useEffect(function onSortChange() {
        related.relatedChecksQuery.firstPageQuery.refetch();
    }, [`${related.sortBy}_${related.sortOrder}`]);

    const hideRelatedChecks = () => {
        sortHandler.close();
        filterHandler.close();
        related.handler.toggle();
    };

    useEffect(function onFilterChange() {
        const newFilter = filter.map((item) => ({ [item]: check[item] }));
        related.setRelatedFilter(() => ({
            $and: newFilter,
        }));
        related.relatedChecksQuery.firstPageQuery.refetch();
    }, [filter.length]);

    return (
        <Stack spacing={4} pr={0}>
            <Stack pr="sm" align="end" sx={{ width: '100%' }} spacing={0}>

                <Group position="apart" align="center" sx={{ width: '100%' }} spacing={0}>
                    <Group />
                    {
                        related.opened && (
                            <Group position="left" ml={0}>
                                <Text size="sm">Related Checks</Text>
                            </Group>
                        )
                    }
                    <Group>
                        <Tooltip label={title} withinPortal>
                            <Burger
                                opened={opened}
                                styles={{
                                    // burger
                                }}
                                size={16}
                                onClick={() => {
                                    hideRelatedChecks();
                                    setOpened((o) => !o);
                                }}
                                title={title}
                            />
                        </Tooltip>
                    </Group>

                </Group>

                {
                    related.opened && (
                        <Group position="center" spacing="xs" sx={{ width: '100%' }} mb={4}>
                            <Tooltip label={`${openedSort ? 'Close ' : ' Open'} sorting`} withinPortal>
                                <ActionIcon
                                    data-test="related-check-icon-open-sort"
                                    onClick={() => sortHandler.toggle()}
                                    mb={4}
                                >
                                    <IconArrowsSort stroke={1} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={`${openedSort ? 'Close ' : ' Open'} filtering`} withinPortal>
                                <ActionIcon
                                    data-test="related-check-icon-open-filter"
                                    onClick={() => filterHandler.toggle()}
                                    mb={4}
                                >
                                    <IconFilter stroke={1} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Refresh items" withinPortal>
                                <ActionIcon
                                    data-test="related-check-icon-refresh"
                                    onClick={() => related.relatedChecksQuery.firstPageQuery.refetch()}
                                    mb={4}
                                >
                                    <IconRefresh stroke={1} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    )
                }

                <Divider sx={{ width: '100%' }} size="xs" p={1} />

                <RelatedCheckSort
                    toggleOpenedSort={sortHandler.toggle}
                    sortBy={related.sortBy}
                    setSortBy={related.setSortBy}
                    setSortOrder={related.setSortOrder}
                    sortOrder={related.sortOrder}
                    openedSort={openedSort}
                />

                {
                    openedFilter && (
                        <Group mb="xs" mt="xs" ml={-10} mr={-10} spacing={4}>
                            <Group position="apart" align="center" noWrap>
                                <Text size="sm" mb={-8}>
                                    Show checks with same parameters
                                </Text>
                                <ActionIcon onClick={filterHandler.close}>
                                    <IconX size={24} stroke={1} />
                                </ActionIcon>
                            </Group>

                            <Chip.Group spacing={6} value={filter} onChange={setFilter} multiple>
                                <Chip size="xs" value="name">Name</Chip>
                                <Chip size="xs" value="Browser">Browser</Chip>
                                <Chip size="xs" value="browserVersion">Browser ver.</Chip>
                                <Chip size="xs" value="os">Platform</Chip>
                                <Chip size="xs" value="viewport">Viewport</Chip>
                                <Chip size="xs" value="branch">Branch</Chip>
                            </Chip.Group>
                        </Group>
                    )
                }
            </Stack>

            {
                related.opened && (
                    <Transition mounted={related.opened} transition="fade" duration={400} timingFunction="ease">
                        {
                            (styles: any) => (

                                <ScrollArea
                                    mt={4}
                                    style={{ height: '75vh' }}
                                    styles={styles}
                                >
                                    {
                                        related.relatedChecksQuery.infinityQuery.isLoading
                                            ? (<RelatedChecksSkeleton num={5} infinityQuery={null} />)
                                            : (
                                                related.relatedChecksQuery.infinityQuery.isError
                                                    ? (<Text size="xs" color="red"> Fail to load</Text>)
                                                    : (
                                                        <Stack spacing={4}>
                                                            <RelatedChecksItems
                                                                infinityQuery={related.relatedChecksQuery.infinityQuery}
                                                                relatedActiveCheckId={related.relatedActiveCheckId}
                                                                setRelatedActiveCheckId={related.setRelatedActiveCheckId}
                                                            />
                                                        </Stack>
                                                    )
                                            )
                                    }

                                    <RelatedChecksSkeleton
                                        num={3}
                                        infinityQuery={related.relatedChecksQuery.infinityQuery}
                                    />
                                </ScrollArea>
                            )
                        }
                    </Transition>
                )
            }
        </Stack>
    );
}
