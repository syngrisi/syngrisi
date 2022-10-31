/* eslint-disable no-underscore-dangle,no-nested-ternary,prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Group, ScrollArea, Stack, Text, Transition } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconArrowsSort, IconCaretLeft, IconCaretRight, IconRefresh } from '@tabler/icons';
import { useEffect } from 'react';
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
    const [openedSort, toggleOpenedSort] = useToggle([false, true]);

    useEffect(function onSortChange() {
        related.relatedChecksQuery.firstPageQuery.refetch();
    }, [`${related.sortBy}_${related.sortOrder}`]);

    const hideRelatedChecks = () => {
        related.handler.toggle();
    };

    return (
        <Stack spacing={4}>
            <Group position="right" pr="sm" align="end" sx={{ width: '100%' }}>
                <Group position="right" spacing={4}>
                    {/* <ActionIcon */}
                    {/*    data-test="navbar-icon-open-filter" */}
                    {/*    onClick={() => toggleOpenedFilter()} */}
                    {/*    mb={4} */}
                    {/* > */}
                    {/*    <IconFilter stroke={1} /> */}
                    {/* </ActionIcon> */}
                    {
                        related.opened && (
                            <>
                                <ActionIcon
                                    data-test="related-check-icon-open-sort"
                                    onClick={() => toggleOpenedSort()}
                                    mb={4}
                                >
                                    <IconArrowsSort stroke={1} />
                                </ActionIcon>

                                <ActionIcon
                                    data-test="related-check-icon-refresh"
                                    onClick={() => related.relatedChecksQuery.firstPageQuery.refetch()}
                                    mb={4}
                                >
                                    <IconRefresh stroke={1} />
                                </ActionIcon>
                            </>
                        )
                    }

                    <ActionIcon
                        data-test="hide-related-checks-icon"
                        onClick={() => hideRelatedChecks()}
                        mb={4}
                    >
                        {related.opened ? (<IconCaretLeft stroke={1} />) : (<IconCaretRight stroke={1} />)}
                    </ActionIcon>

                </Group>
            </Group>

            <Group sx={{ width: '100%' }}>
                <RelatedCheckSort
                    toggleOpenedSort={toggleOpenedSort}
                    sortBy={related.sortBy}
                    setSortBy={related.setSortBy}
                    setSortOrder={related.setSortOrder}
                    sortOrder={related.sortOrder}
                    openedSort={openedSort}
                />
            </Group>
            {
                related.opened && (
                    <Transition mounted={related.opened} transition="fade" duration={400} timingFunction="ease">
                        {
                            (styles: any) => (

                                <ScrollArea
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
                                                        <Stack spacing={8}>
                                                            <RelatedChecksItems
                                                                infinityQuery={related.relatedChecksQuery.infinityQuery}
                                                                relatedActiveCheck={related.relatedActiveCheck}
                                                                setRelatedActiveCheck={related.setRelatedActiveCheck}
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
