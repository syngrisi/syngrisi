/* eslint-disable no-underscore-dangle,no-nested-ternary,prefer-arrow-callback,max-len */
import * as React from 'react';
import { ActionIcon, Group, ScrollArea, Stack, Text, Transition, Chip, Burger, Divider, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowsSort, IconFilter, IconRefresh, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RelatedChecksSkeleton } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedChecksSkeleton';
import { RelatedChecksItems } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedChecksItems';
import { RelatedCheckSort } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedCheckSort';

interface Props {
    currentCheck: any
    related: any
}

export function RelatedChecks(
    {
        currentCheck,
        related,
    }: Props,
) {
    const [openedSort, sortHandler] = useDisclosure(false);
    const [openedFilter, filterHandler] = useDisclosure(false);
    const [filter, setFilter] = useState(['name']);
    const title = related.opened ? 'Close related checks' : 'Open related checks';
    const queryClient = useQueryClient();

    const hideRelatedChecks = () => {
        sortHandler.close();
        filterHandler.close();
        related.handler.toggle();
    };

    const updateFilter = (value: any) => {
        setFilter(() => {
            if (!value.includes('name')) return [...['name'], ...value];
            return value;
        });
    };

    useEffect(function onFilterChange() {
        const newFilter = filter.map((item) => ({ [item]: encodeURIComponent(currentCheck[item]) }));
        related.setRelatedFilter(() => ({
            $and: newFilter,
        }));
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
                                opened={related.opened}
                                styles={{
                                    // burger
                                }}
                                size={16}
                                onClick={() => {
                                    hideRelatedChecks();
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
                                    onClick={
                                        async () => {
                                            await queryClient.invalidateQueries({ queryKey: ['related_checks_infinity_pages', currentCheck._id] });
                                        }
                                    }
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

                            <Chip.Group spacing={6} value={filter} onChange={updateFilter} multiple>
                                <Chip size="xs" value="name" disabled>Name</Chip>
                                <Chip size="xs" value="browserName">Browser</Chip>
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
