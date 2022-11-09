/* eslint-disable prefer-arrow-callback,indent,react/jsx-one-expression-per-line,no-nested-ternary */
import {
    ActionIcon,
    Group,
    List,
    Navbar,
    ScrollArea,
    Text,
} from '@mantine/core';
import * as React from 'react';
import {
    IconArrowsSort,
    IconFilter,
    IconRefresh,
} from '@tabler/icons';
import { createStyles } from '@mantine/styles';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue, useToggle } from '@mantine/hooks';
import useInfinityScroll from '../../../shared/hooks/useInfinityScroll';

import { NavbarItems } from './NavbarItems';
import SkeletonWrapper from './Skeletons/SkeletonWrapper';
import { NavbarSort } from './NavbarSort';
import { escapeRegExp } from '../../../shared/utils/utils';
import { useParams } from '../../hooks/useParams';
import { NavbarFilter } from './NavbarFilter';
import { useIndexSubpageEffect } from '../../hooks/useIndexSubpageEffect';
import { NavbarGroupBySelect } from './NavbarGroupBySelect';

const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.xs,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
    },
    navbarItem: {
        display: 'block',
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.red[0] : theme.black,
        borderBottom: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
        }`,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
    activeNavbarItem: {
        backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
        color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? 'rgba(47, 158, 68, 0.2)' : 'rgba(235, 251, 238, 1)',
            color: theme.colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[6],
        },
    },
}));

export default function NavbarIndex() {
    const { classes } = useStyles();
    const { query, setQuery } = useParams();

    const [sortBy, setSortBy] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc');

    const [groupByValue, setGroupByValue] = useState(query.groupBy || 'runs');

    const [activeItems, setActiveItems] = useState<string[]>([]);
    const activeItemsHandler = {
        get: () => activeItems,
        addOrRemove: (item: string) => {
            setActiveItems(
                (prevItems: any[]) => {
                    const newItems = [...prevItems];
                    if (newItems.includes(item)) {
                        return newItems.filter((x) => x !== item);
                    }
                    return newItems.concat(item);
                },
            );
        },
        clear: () => {
            setActiveItems(() => []);
        },
        set: (items: any) => {
            setActiveItems(() => items);
        },
        navbarItemClass: () => classes.navbarItem,
        activeNavbarItemClass: () => classes.activeNavbarItem,
    };

    const baseFilterMap = (
        {
            suites: 'suite',
            runs: 'run',
            'test-distinct/browserName': 'browserName',
            'test-distinct/os': 'os',
            'test-distinct/status': 'status',
            'test-distinct/markedAs': 'markedAs',
        }[groupByValue] || groupByValue
    );

    useEffect(function setActiveItemsFromQueryFirstTime() {
        if (
            (query?.base_filter && query?.base_filter[baseFilterMap]?.$in?.length > 0)
            && (activeItemsHandler.get().length < 1)
        ) {
            activeItemsHandler.set(query?.base_filter[baseFilterMap]?.$in);
        }
    }, []);

    useEffect(function onActiveItemsChange() {
        if (activeItemsHandler.get().length > 0) {
            setQuery({ base_filter: { [baseFilterMap]: { $in: activeItemsHandler.get() } } });
        } else {
            setQuery({ base_filter: null });
        }
    }, [JSON.stringify(activeItemsHandler.get())]);

    const [quickFilter, setQuickFilter] = useState<string>('');
    const [debouncedQuickFilter] = useDebouncedValue(quickFilter, 400);

    const quickFilterKey = (value: string) => {
        const transform = {
            runs: 'name',
            suites: 'name',
            'test-distinct/browserName': 'browserName',
            'test-distinct/os': 'os',
            'test-distinct/status': 'status',
            'test-distinct/markedAs': 'markedAs',
        } as { [key: string]: string };
        return transform[value] || 'name';
    };

    const quickFilterObject = useMemo<{ [key: string]: any } | undefined>(() => {
        if (!debouncedQuickFilter) return ({});
        return ({ [quickFilterKey(groupByValue)]: { $regex: escapeRegExp(debouncedQuickFilter), $options: 'im' } });
    }, [debouncedQuickFilter]);

    const navbarFilterObject = query?.app
        ? {
            app: { $oid: query?.app || '' },
            ...quickFilterObject,
        }
        : quickFilterObject;

    const [openedFilter, toggleOpenedFilter] = useToggle([false, true]);
    const [openedSort, toggleOpenedSort] = useToggle([false, true]);

    const getNewestFilter = (item: string) => {
        const transform = {
            runs: 'createdDate',
            suites: 'createdDate',
        };
        return transform[item as keyof typeof transform] || '';
    };

    const { firstPageQuery, infinityQuery } = useInfinityScroll({
        resourceName: groupByValue,
        filterObj: query.filter,
        newestItemsFilterKey: getNewestFilter(groupByValue),
        baseFilterObj: navbarFilterObject,
        sortBy: `${sortBy}:${sortOrder}`,
    });

    useEffect(function refetch() {
        firstPageQuery.refetch();
    }, [
        query?.app,
        query?.groupBy,
        JSON.stringify(quickFilterObject),
        `${sortBy}:${sortOrder}`,
    ]);

    const refreshIconClickHandler = () => {
        setQuery({ base_filter: null });
        firstPageQuery.refetch();
        activeItemsHandler.clear();
    };

    const subpageMap: { [key: string]: string } = {
        runs: 'By Runs',
        suites: 'By Suites',
        'test-distinct/browserName': 'By Browser',
        'test-distinct/os': 'By Platform',
        'test-distinct/status': 'By Test Status',
        'test-distinct/markedAs': 'By Accept Status',
    };

    const title: string = query?.groupBy as string;
    useIndexSubpageEffect(subpageMap[title] || 'Test Results');

    return (
        <Group position="apart" align="start" noWrap>
            {
                (
                    <Navbar
                        height="100%"
                        width={{ sm: 350 }}
                        className={classes.navbar}
                        pt={0}
                        pr={2}
                        pl={8}
                        zIndex={10}
                        styles={{
                            root: {
                                zIndex: 20,
                            },
                        }}
                    >
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            styles={{ scrollbar: { marginTop: '74px' } }}
                            pr={12}
                        >
                            <Group position="apart" align="end" sx={{ width: '100%' }}>
                                <NavbarGroupBySelect
                                    setActiveItems={setActiveItems}
                                    groupByValue={groupByValue}
                                    setGroupByValue={setGroupByValue}
                                />

                                <Group spacing={4}>
                                    <ActionIcon
                                        data-test="navbar-icon-open-filter"
                                        onClick={() => toggleOpenedFilter()}
                                        mb={4}
                                    >
                                        <IconFilter stroke={1} />
                                    </ActionIcon>
                                    <ActionIcon
                                        data-test="navbar-icon-open-sort"
                                        onClick={() => toggleOpenedSort()}
                                        mb={4}
                                    >
                                        <IconArrowsSort stroke={1} />
                                    </ActionIcon>

                                    <ActionIcon
                                        data-test="navbar-icon-refresh"
                                        onClick={() => refreshIconClickHandler()}
                                        mb={4}
                                    >
                                        <IconRefresh stroke={1} />
                                    </ActionIcon>
                                </Group>
                            </Group>

                            <Group sx={{ width: '100%' }}>
                                <NavbarSort
                                    groupBy={groupByValue}
                                    toggleOpenedSort={toggleOpenedSort}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    setSortOrder={setSortOrder}
                                    sortOrder={sortOrder}
                                    openedSort={openedSort}
                                />
                            </Group>

                            <Group sx={{ width: '100%' }}>
                                <NavbarFilter
                                    openedFilter={openedFilter}
                                    quickFilter={quickFilter}
                                    setQuickFilter={setQuickFilter}
                                    debouncedQuickFilter={debouncedQuickFilter}
                                    infinityQuery={infinityQuery}
                                    toggleOpenedFilter={toggleOpenedFilter}
                                />
                            </Group>

                            {
                                infinityQuery.status === 'loading'
                                    ? (
                                        <SkeletonWrapper
                                            infinityQuery={null}
                                            itemType={groupByValue}
                                            num={20}
                                            itemClass={classes.navbarItem}
                                        />
                                    )
                                    : infinityQuery.status === 'error'
                                        ? (<Text color="red">Error: {infinityQuery.error.message}</Text>)
                                        : (
                                            <List
                                                size="md"
                                                listStyleType="none"
                                                sx={{ width: '100%' }}
                                                styles={{ itemWrapper: { width: '100%' } }}
                                                pt={4}
                                            >
                                                {/* eslint-disable-next-line max-len */}
                                                <NavbarItems
                                                    infinityQuery={infinityQuery}
                                                    groupByValue={groupByValue}
                                                    activeItemsHandler={activeItemsHandler}
                                                />
                                            </List>
                                        )
                            }
                            <SkeletonWrapper
                                itemType={groupByValue}
                                infinityQuery={infinityQuery}
                                itemClass={classes.navbarItem}
                            />
                        </Navbar.Section>
                    </Navbar>
                )
            }
        </Group>
    );
}
